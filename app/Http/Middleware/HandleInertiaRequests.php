<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role->name ?? null,
                    'agency_id' => $request->user()->agency_id,
                    'must_change_password' => $request->user()->must_change_password ?? false,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'unreadCount' => fn () => $request->user()
                ? $request->user()->notifications()->whereNull('read_at')->count()
                : 0,
            'recentNotifications' => function () use ($request) {
                if (!$request->user()) {
                    return [];
                }

                return $request->user()->notifications()
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(fn ($n) => [
                        'id' => $n->id,
                        'title' => $n->data['title'] ?? '',
                        'description' => $n->data['description'] ?? '',
                        'type' => $n->data['type'] ?? 'info',
                        'source' => $n->data['source'] ?? 'system',
                        'action_url' => $n->data['action_url'] ?? null,
                        'read' => !is_null($n->read_at),
                        'time' => $n->created_at->locale('fr')->diffForHumans(),
                        'timestamp' => $n->created_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                    ])
                    ->toArray();
            },
        ];
    }
}
