<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationService
{
    public function create(
        User $user,
        string $title,
        string $description,
        string $type = 'info',
        string $source = 'system',
        ?string $actionUrl = null,
        array $context = [],
    ): DatabaseNotification {
        $user->notify(
            new SystemNotification($title, $description, $type, $source, $actionUrl, $context)
        );

        return $user->notifications()->latest()->first();
    }

    public function getPaginated(User $user, Request $request): LengthAwarePaginator
    {
        $query = $user->notifications();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('data->title', 'like', "%{$search}%")
                  ->orWhere('data->description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('source')) {
            $query->where('data->source', $request->source);
        }

        if ($request->filled('type')) {
            $query->where('data->type', $request->type);
        }

        if ($request->filled('read')) {
            if ($request->read === 'read') {
                $query->whereNotNull('read_at');
            } elseif ($request->read === 'unread') {
                $query->whereNull('read_at');
            }
        }

        $query->orderBy('created_at', 'desc');

        $perPage = (int) $request->input('perPage', 10);
        if (!in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getUnreadCount(User $user): int
    {
        return $user->notifications()->whereNull('read_at')->count();
    }

    public function markAsRead(string $notificationId, User $user): bool
    {
        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (!$notification) {
            return false;
        }

        if (is_null($notification->read_at)) {
            $notification->markAsRead();
        }

        return true;
    }

    public function markAllAsRead(User $user): int
    {
        return $user->notifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function delete(string $notificationId, User $user): bool
    {
        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (!$notification) {
            return false;
        }

        return $notification->delete();
    }

    public function deleteAllRead(User $user): int
    {
        return $user->notifications()
            ->whereNotNull('read_at')
            ->delete();
    }

    public function getStats(User $user): array
    {
        $all = $user->notifications();
        $today = now()->startOfDay();
        $weekAgo = now()->subWeek();

        return [
            'total' => (clone $all)->count(),
            'unread' => (clone $all)->whereNull('read_at')->count(),
            'read' => (clone $all)->whereNotNull('read_at')->count(),
            'today' => (clone $all)->where('created_at', '>=', $today)->count(),
            'thisWeek' => (clone $all)->where('created_at', '>=', $weekAgo)->count(),
            'warning' => (clone $all)->where('data->type', 'warning')->count(),
            'error' => (clone $all)->where('data->type', 'error')->count(),
        ];
    }

    public function getRecentForDropdown(User $user, int $limit = 5): array
    {
        return $user->notifications()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn ($n) => $this->serialize($n))
            ->toArray();
    }

    public function serialize(DatabaseNotification $notification): array
    {
        $data = $notification->data;

        return [
            'id' => $notification->id,
            'title' => $data['title'] ?? '',
            'description' => $data['description'] ?? '',
            'type' => $data['type'] ?? 'info',
            'source' => $data['source'] ?? 'system',
            'action_url' => $data['action_url'] ?? null,
            'read' => !is_null($notification->read_at),
            'time' => $notification->created_at->locale('fr')->diffForHumans(),
            'timestamp' => $notification->created_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
        ];
    }
}
