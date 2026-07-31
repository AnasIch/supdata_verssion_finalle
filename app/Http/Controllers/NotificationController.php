<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService,
    ) {}

    private function getData(Request $request): array
    {
        $user = Auth::user();
        $paginator = $this->notificationService->getPaginated($user, $request);
        $stats = $this->notificationService->getStats($user);

        $notifications = $paginator->getCollection()->map(
            fn ($n) => $this->notificationService->serialize($n)
        );

        return [
            'notifications' => $notifications,
            'pagination' => [
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'perPage' => $paginator->perPage(),
            ],
            'stats' => $stats,
            'unreadCount' => $this->notificationService->getUnreadCount($user),
            'filters' => $request->only(['search', 'source', 'type', 'read']),
        ];
    }

    public function index(Request $request)
    {
        return Inertia::render('Dashboard/Notifications/Index', $this->getData($request));
    }

    public function commercialIndex(Request $request)
    {
        return Inertia::render('Dashboard/Commercial/Notifications', $this->getData($request));
    }

    public function localAdminIndex(Request $request)
    {
        return Inertia::render('Dashboard/LocalAdmin/Notifications/Index', $this->getData($request));
    }

    public function unreadCount()
    {
        return response()->json([
            'count' => $this->notificationService->getUnreadCount(Auth::user()),
        ]);
    }

    public function markAsRead(Request $request, string $notification)
    {
        $this->notificationService->markAsRead($notification, Auth::user());

        return back();
    }

    public function markAllAsRead()
    {
        $this->notificationService->markAllAsRead(Auth::user());

        return back();
    }

    public function destroy(string $notification)
    {
        $this->notificationService->delete($notification, Auth::user());

        return back();
    }

    public function destroyAllRead()
    {
        $this->notificationService->deleteAllRead(Auth::user());

        return back();
    }
}
