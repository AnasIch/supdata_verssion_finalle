# SUPDATA ERP

ERP interne pour la gestion des achats, stock, clients et agences SUPDATA.

Développé avec **Laravel 12** + **React 18** + **Inertia.js**.

---

## Aperçu

SUPDATA ERP est une application web interne destinée à centraliser la gestion opérationnelle de SUPDATA. Le projet offre un tableau de bord dédié par rôle, une gestion complète des demandes d'achat, du stock et des agences, le tout avec une interface moderne et responsive.

---

## Fonctionnalités

- Authentification (login, reset password, forgot password)
- Gestion des utilisateurs (CRUD complet)
- Gestion des rôles & permissions
- Gestion des agences
- Demandes d'achat (création, archivage, filtres, pagination)
- Réservation de stock (CRUD complet, notifications email)
- Stock disponible (consultation, filtres, disponibilité)
- Notifications (Laravel Notifications, email SMTP, badge live)
- Audit logs
- Dashboards par rôle avec statistiques réelles

---

## Rôles

| Rôle | Dashboard | Backend | Statut |
|---|---|---|---|
| Super Admin | `/dashboard-super-admin` | Complet | Terminé |
| Administrateur Local | `/dashboard-admin-local` | Mock Data | Terminé |
| Gestion Administrative | `/dashboard-administrative` | Mock Data | En attente |
| Responsable Commercial | `/dashboard-commercial` | Complet | Terminé |
| Responsable Stock | `/dashboard-stock` | Mock Data | En attente |

---

## Stack Technique

| Layer | Tech | Version |
|---|---|---|
| Backend | Laravel 12 / PHP 8.3+ | — |
| Frontend | React 18 + Inertia.js 2 | — |
| UI | shadcn/ui (Radix) + Tailwind CSS v3 | ^3.2.1 |
| Animations | Framer Motion | ^12.42 |
| Charts | Recharts | ^3.9 |
| Icons | Lucide React (unique) | — |
| Build | Vite 7 + laravel-vite-plugin | — |
| Database | MySQL | — |

---

## Structure du projet

```
resources/js/
├── Components/
│   ├── UI/          # 27 composants réutilisables (shadcn/ui)
│   ├── Layout/      # Sidebar, Header, NotificationDropdown, etc.
│   ├── Dashboard/   # WelcomeBanner, StatCard, DashboardCharts, etc.
│   ├── Users/       # UsersTable, UserStatusBadge, CreateUserForm, etc.
│   ├── Auth/        # AuthCard, AuthInput, PasswordInput, etc.
│   ├── Landing/     # Navbar, Footer, Hero, etc.
│   ├── Common/      # SupdataLogo
│   ├── Charts/      # ChartCard, LineChart, BarChart, PieChart, etc.
│   ├── Demandes/    # DemandeStats, DemandeFilters, DemandeTable, etc.
│   ├── Profile/     # ProfileHeader, ProfileAvatar, ChangePasswordForm, etc.
│   ├── Commercial/  # DashboardHeader, KpiCards, Stock*, Reservations*, etc.
│   ├── LocalAdmin/  # DashboardHeader, KpiCards, Notifications*, etc.
│   ├── Stock/       # DashboardHeader, KpiCards, etc.
│   ├── Agences/     # AgencesTable, AgencesStats, etc.
│   └── Roles/       # RolesTable, RolesStats
├── Layouts/
│   ├── DashboardLayout.jsx  # Layout principal dashboard
│   └── AuthLayout.jsx       # Layout auth (50/50 grid)
├── Pages/
│   ├── Dashboard/{SuperAdmin,LocalAdmin,Administrative,Commercial,Stock}/Index.jsx
│   ├── Dashboard/{Reports,AuditLogs,Notifications,Settings}/Index.jsx
│   ├── Users/{Index,Show,Create,Edit}.jsx
│   ├── Roles/{Index,Show}.jsx
│   ├── Agences/Index.jsx
│   ├── Agencies/{Index,Show,Edit}.jsx
│   ├── Permissions/{Index,Show}.jsx
│   ├── Commercial/{Demandes,Stock,Reservations}/*.jsx
│   ├── Profile/Index.jsx
│   ├── Auth/{Login,ForgotPassword,ResetPassword,VerifyEmail}.jsx
│   ├── Landing/Index.jsx
│   └── Errors/{403,404,500}.jsx
├── Data/
│   ├── sidebarMenus.js    # Config navigation par rôle
│   └── mockUsers.js       # Mock users par rôle
├── Mocks/          # Données simulées par module
├── Hooks/          # Hooks par module
└── lib/
    ├── utils.js    # cn() = clsx + tailwind-merge
    └── animations.js  # Config Framer Motion (non importé)
```

---

## Backend (app/)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── NotificationController.php      # CRUD notifications (tous rôles)
│   │   ├── DemandeController.php           # CRUD demandes d'achat
│   │   ├── ReservationController.php       # CRUD réservations
│   │   ├── CommercialStockController.php   # Stock disponible
│   │   ├── UserController.php              # CRUD utilisateurs
│   │   ├── ProfileController.php           # Profil
│   │   └── DashboardController.php         # Dashboard Super Admin
│   └── Requests/
│       ├── DemandeFormRequest.php          # Validation demandes
│       └── StoreReservationFormRequest.php # Validation réservations
├── Services/
│   ├── NotificationService.php     # CRUD notifications, stats, pagination
│   ├── DemandeService.php          # Logique demandes + notifications
│   ├── ReservationService.php      # Logique réservations + notifications email
│   ├── AuditLogService.php         # Logs d'audit
│   └── StockService.php            # Logique stock
├── Models/
│   ├── Demande.php                 # SoftDeletes, relations
│   ├── Reservation.php             # Relations user/product/agency
│   ├── Product.php                 # reserved_quantity, relations
│   ├── User.php                    # Notifiable trait
│   ├── Agency.php                  # relations users/products
│   └── Role.php                    # name, slug
├── Notifications/
│   └── SystemNotification.php      # channel: database + mail
├── Mail/
│   └── NouvelleDemandeMail.php     # Email Gestion Admin
└── Middleware/
    └── HandleInertiaRequests.php   # Shared: flash, unreadCount, user
```

---

## Routes principales (Backend)

```php
// Commercial — Demandes
GET    /dashboard-commercial/demandes          # Liste paginée
GET    /dashboard-commercial/demandes/creer    # Formulaire
POST   /dashboard-commercial/demandes          # Création
GET    /dashboard-commercial/demandes/{id}     # Détail
POST   /dashboard-commercial/demandes/{id}/archiver  # Archivage

// Commercial — Stock
GET    /dashboard-commercial/stock             # Stock disponible

// Commercial — Réservations
GET    /dashboard-commercial/reservations      # Liste paginée
POST   /dashboard-commercial/reservations      # Création
PUT    /dashboard-commercial/reservations/{id} # Modification
DELETE /dashboard-commercial/reservations/{id} # Suppression

// Commercial — Notifications
GET    /dashboard-commercial/notifications              # Liste paginée
PATCH  /dashboard-commercial/notifications/read-all     # Tout marquer lu
PATCH  /dashboard-commercial/notifications/{id}/read    # Marquer lu
DELETE /dashboard-commercial/notifications/{id}         # Supprimer
DELETE /dashboard-commercial/notifications/read         # Supprimer tous lus
```

---

## Installation

```bash
git clone https://github.com/anas/supdata-erp.git
cd supdata-erp
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```

---

## Build

```bash
npm run build
```

Le build doit toujours passer sans erreur avant de valider une tâche.

---

## Captures d'écran

> *À venir*

---

## Auteur

Développé par **Anas** — Développeur Full Stack.

Projet SUPDATA ERP.
