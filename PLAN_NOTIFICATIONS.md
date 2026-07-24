# Plan Correction Module Notifications — Super Admin

## Diagnostic Summary

The notification module has **zero backend infrastructure**. Everything is frontend mock data:
- No migration, no model, no service, no controller, no API routes
- No notification dispatch in any controller
- No shared unread count in HandleInertiaRequests
- NotificationDropdown has 3 hardcoded notifications
- Notifications/Index.jsx uses `useNotifications` hook backed by mock data

**Scope**: Super Admin only. Do NOT touch LocalAdmin, Commercial, Stock, Administrative notification pages.

---

## Phase 1: Backend Infrastructure (5 new files)

### 1.1 Migration — `create_notifications_table`
**New file**: `database/migrations/2026_07_20_000000_create_notifications_table.php`
- Laravel default schema: id (uuid), type, notifiable_type/id, data (json), read_at, timestamps
- Run `php artisan notifications:table` to generate, or create manually

### 1.2 Notification class
**New file**: `app/Notifications/SystemNotification.php`
- Implements `ShouldQueue`? No — synchronous for now (no queue worker configured)
- Constructor: `title`, `description`, `type` (info/success/warning/error), `source` (utilisateurs/system/stock/etc.), `actionUrl`
- `toArray()` returns custom data fields
- `database()` channel

### 1.3 NotificationService
**New file**: `app/Services/NotificationService.php`
- `create(User $user, string $title, string $description, string $type, string $source, ?string $actionUrl): DatabaseNotification`
- `getPaginated(User $user, Request $request): LengthAwarePaginator` — search on data->title + data->description, filter on data->type, data->source, read_at null/not-null, pagination 10/page
- `getUnreadCount(User $user): int`
- `markAsRead(string $id, User $user): bool`
- `markAllAsRead(User $user): int`
- `delete(string $id, User $user): bool`
- `deleteAllRead(User $user): int`

### 1.4 NotificationController
**New file**: `app/Http/Controllers/NotificationController.php`
- `index()` — Inertia render `Dashboard/Notifications/Index` with paginated data, filters, stats
- `unreadCount()` — JSON response `{ count: N }` for header badge
- `markAsRead($notification)` — PATCH, returns back()
- `markAllAsRead()` — PATCH, returns back()
- `destroy($notification)` — DELETE, returns back()
- `destroyAllRead()` — DELETE, returns back()

### 1.5 NotificationSeeder
**New file**: `database/seeders/NotificationSeeder.php`
- Creates 20 notifications for admin@supdata.com
- Mix of types: success, info, warning, error
- Mix of sources: utilisateurs, stock, system, achats, agences, roles
- Mix of read/unread (some read_at = null, some with timestamps)
- Meaningful French titles and descriptions

---

## Phase 2: Backend Integration (4 files to modify)

### 2.1 Routes
**Modify**: `routes/web.php`
- Replace the existing closure `GET /dashboard-super-admin/notifications` with controller route
- Add CRUD routes under Super Admin prefix:
  - `GET /dashboard-super-admin/notifications` → NotificationController@index
  - `GET /dashboard-super-admin/notifications/unread-count` → NotificationController@unreadCount
  - `PATCH /dashboard-super-admin/notifications/read-all` → NotificationController@markAllAsRead
  - `PATCH /dashboard-super-admin/notifications/{notification}/read` → NotificationController@markAsRead
  - `DELETE /dashboard-super-admin/notifications/{notification}` → NotificationController@destroy
  - `DELETE /dashboard-super-admin/notifications/read` → NotificationController@destroyAllRead

### 2.2 HandleInertiaRequests
**Modify**: `app/Http/Middleware/HandleInertiaRequests.php`
- Add `unreadCount` to shared props (count of notifications where read_at is null)
- Only for authenticated users

### 2.3 UserController — dispatch notifications
**Modify**: `app/Http/Controllers/UserController.php`
- Inject `NotificationService` via constructor
- After `store()`: create notification "Utilisateur créé" (type: success, source: utilisateurs)
- After `update()`: create notification "Utilisateur modifié" (type: info, source: utilisateurs)
- After `toggleStatus()`: create notification "Utilisateur activé/désactivé" (type: info/warning, source: utilisateurs)
- After `destroy()`: create notification "Utilisateur supprimé" (type: warning, source: utilisateurs)

### 2.4 ProfileController — dispatch notification
**Modify**: `app/Http/Controllers/ProfileController.php`
- Inject `NotificationService` via constructor
- After `changePassword()`: create notification "Mot de passe modifié" (type: success, source: system)

---

## Phase 3: Frontend Adaptation (3 files to modify)

### 3.1 NotificationDropdown
**Modify**: `resources/js/Components/Layout/NotificationDropdown.jsx`
- Remove hardcoded `notifications` array (lines 14-36)
- Use `usePage().props` to get notifications and unreadCount
- Fetch recent notifications (5 latest) via `router.get` or use shared props
- "Tout marquer comme lu" button → `router.patch('/dashboard-super-admin/notifications/read-all')`
- Each notification click → mark as read + navigate to action URL
- Badge uses real `unreadCount` from shared props

### 3.2 Notifications/Index.jsx
**Modify**: `resources/js/Pages/Dashboard/Notifications/Index.jsx`
- Accept Inertia props: `notifications`, `filters`, `unreadCount`, `stats`
- Replace `useNotifications` hook with server-side data
- Search → `router.get()` with query params (debounced)
- Filters (source, type, read) → `router.get()` with query params
- Pagination → `router.get()` with page param
- Mark as read → `router.patch()`
- Mark all as read → `router.patch('/dashboard-super-admin/notifications/read-all')`
- Delete → `router.delete()`
- Delete all read → `router.delete('/dashboard-super-admin/notifications/read')`
- Keep all existing UI components (FilterBar, NotificationRow, EmptyState, etc.)
- Keep all existing styling and design

### 3.3 useNotifications hook
**Modify**: `resources/js/Hooks/useNotifications.js`
- Accept Inertia props as initial data
- Manage filter state locally
- Trigger Inertia visits on filter/search/page changes
- Remove client-side filtering (server handles it)

---

## Phase 4: Seeder & Testing

### 4.1 Register seeder
**Modify**: `database/seeders/DatabaseSeeder.php`
- Add `NotificationSeeder::class` to `$this->call()`

### 4.2 Run migration & seed
```bash
php artisan migrate:fresh --seed
```

### 4.3 Build verification
```bash
npm run build
```

---

## Files Summary

### New files (5)
| File | Purpose |
|---|---|
| `database/migrations/2026_07_20_000000_create_notifications_table.php` | Notifications table |
| `app/Notifications/SystemNotification.php` | Laravel notification class |
| `app/Services/NotificationService.php` | Business logic |
| `app/Http/Controllers/NotificationController.php` | API endpoints |
| `database/seeders/NotificationSeeder.php` | Demo data |

### Modified files (7)
| File | Change |
|---|---|
| `routes/web.php` | Add notification routes, replace closure |
| `app/Http/Middleware/HandleInertiaRequests.php` | Share unreadCount |
| `app/Http/Controllers/UserController.php` | Dispatch notifications |
| `app/Http/Controllers/ProfileController.php` | Dispatch notification |
| `resources/js/Components/Layout/NotificationDropdown.jsx` | Use real data |
| `resources/js/Pages/Dashboard/Notifications/Index.jsx` | Use Inertia props |
| `resources/js/Hooks/useNotifications.js` | Adapt for server-side |
| `database/seeders/DatabaseSeeder.php` | Register seeder |

### NOT modified
- Auth, Dashboard, CRUD Users (logic unchanged)
- Profile (logic unchanged)
- Email, Password, Audit Logs, Reports, Settings
- LocalAdmin, Commercial, Stock, Administrative notification pages
- Other dashboards

---

## Notification Data Shape

Stored in `notifications.data` JSON column:
```json
{
  "title": "Utilisateur créé",
  "description": "Ahmed Tazi a été ajouté en tant que Responsable Stock à Casablanca.",
  "type": "success",
  "source": "utilisateurs",
  "action_url": "utilisateurs"
}
```

Frontend receives serialized notifications with:
- `id` (uuid)
- `title`, `description`, `type`, `source`, `action_url` (from data)
- `read` (boolean, derived from read_at)
- `time` (human-readable relative time)
- `timestamp` (formatted date)
