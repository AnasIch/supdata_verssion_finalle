# SUPDATA ERP — Documentation Complète

ERP interne pour la gestion des achats, stock, clients et agences SUPDATA.

> **Phase actuelle : Frontend uniquement.** Pas de logique métier, pas d'API, pas de CRUD backend. Toutes les données sont des Mock Data.

---

## Table des matières

1. [Stack technique](#stack-technique)
2. [Démarrage rapide](#démarrage-rapide)
3. [Commandes disponibles](#commandes-disponibles)
4. [Architecture du projet](#architecture-du-projet)
5. [Arborescence complète](#arborescence-complète)
6. [Système de routes](#système-de-routes)
7. [Rôles et navigation](#rôles-et-navigation)
8. [Dashboard par rôle](#dashboard-par-rôle)
9. [Système de design](#système-de-design)
10. [Catalogue des composants](#catalogue-des-composants)
11. [Stratégie Mock Data](#stratégie-mock-data)
12. [Hooks](#hooks)
13. [Conventions de code](#conventions-de-code)
14. [Gotchas et pièges courants](#gotchas-et-pièges-courants)

---

## Stack technique

| Layer | Tech | Version |
|---|---|---|
| Frontend | React 18 + Inertia.js 2 | — |
| UI | shadcn/ui (Radix primitives) + Tailwind CSS **v3** | `^3.2.1` |
| Animations | Framer Motion | `^12.42` |
| Charts | Recharts | `^3.9` |
| Icons | Lucide React (unique — jamais d'autre biblio) | — |
| Forms | React Hook Form + Zod | — |
| Build | Vite 7 + laravel-vite-plugin | — |
| Backend | Laravel 13 / PHP 8.3+ | — |
| DB | MySQL | — |

---

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone <repo-url>
cd Supdata_Derniere_Version

# 2. Installer les dépendances frontend
npm install

# 3. Lancer le dev server Vite
npm run dev
# → accessible sur http://127.0.0.1:5173

# 4. (Optionnel) Lancer Laravel en parallèle
php artisan serve
# → accessible sur http://127.0.0.1:8000
```

---

## Commandes disponibles

```bash
npm run dev       # Vite dev server (127.0.0.1:5173)
npm run build     # Production build — DOIT passer avant chaque fin de tâche
php artisan serve # Laravel dev server (127.0.0.1:8000)
```

> **Pas de `npm run lint`, pas de `npm run test`.** Seul `npm run build` vérifie la compilation.

---

## Architecture du projet

### Principe fondamental

```
Routes (web.php)
    ↓
Inertia render → Page component
    ↓
Page utilise DashboardLayout + composants métier
    ↓
Composants utilisent les composants UI réutilisables
    ↓
Mock Data alimentent les composants via des Hooks
```

### Séparation des responsabilités

| Répertoire | Rôle |
|---|---|
| `Pages/` | Routes/écrans — chaque fichier = une page |
| `Components/` | Composants réutilisables, organisés par domaine |
| `Layouts/` | Mise en page globale (DashboardLayout, AuthLayout) |
| `Hooks/` | Logique de données (mock) pour chaque module |
| `Mocks/` | Données simulées (produits, demandes, utilisateurs, etc.) |
| `Data/` | Configuration (sidebarMenus, mockUsers) |
| `lib/` | Utilitaires (cn(), mockAuth, animations) |

### Isolation par rôle

Chaque rôle possède :
- **Sa propre page dashboard** : `Pages/Dashboard/{Role}/Index.jsx`
- **Ses propres composants** : `Components/{Role}/*.jsx`
- **Ses propres mock data** : `Mocks/{role}Dashboard.js`
- **Son propre hook** : `Hooks/use{Role}Dashboard.js`
- **Ses propres routes** : `/dashboard-{role}/...`

**Règle d'or** : les composants métier d'un rôle ne doivent **jamais** être réutilisés par un autre rôle. Seuls les composants UI génériques (`Components/UI/`, `Layout/`, `Charts/`) peuvent être partagés.

---

## Arborescence complète

```
resources/js/
├── app.jsx                              ← Point d'entrée Inertia
├── bootstrap.js                         ← Setup Axios
│
├── Components/
│   ├── UI/                  (27)        ← Composants réutilisables (shadcn/ui)
│   │   ├── Alert.jsx
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── Breadcrumb.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Checkbox.jsx
│   │   ├── DataTable.jsx
│   │   ├── Dialog.jsx
│   │   ├── Drawer.jsx
│   │   ├── DropdownMenu.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Input.jsx
│   │   ├── Label.jsx
│   │   ├── PageHeader.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchInput.jsx
│   │   ├── Select.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Spinner.jsx
│   │   ├── Switch.jsx
│   │   ├── Table.jsx
│   │   ├── TablePagination.jsx
│   │   ├── Tabs.jsx
│   │   ├── Textarea.jsx
│   │   ├── Toast.jsx
│   │   └── Tooltip.jsx
│   │
│   ├── Layout/              (13)        ← Sidebar, Header, Breadcrumbs, etc.
│   │   ├── Breadcrumbs.jsx
│   │   ├── Header.jsx
│   │   ├── NotificationDropdown.jsx
│   │   ├── PageContainer.jsx
│   │   ├── PageTitle.jsx
│   │   ├── QuickActions.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SidebarCollapse.jsx
│   │   ├── SidebarFooter.jsx
│   │   ├── SidebarGroup.jsx
│   │   ├── SidebarItem.jsx
│   │   └── UserDropdown.jsx
│   │
│   ├── Charts/              (7)         ← Graphiques Recharts
│   │   ├── AreaChart.jsx
│   │   ├── BarChart.jsx
│   │   ├── ChartCard.jsx
│   │   ├── ChartContainer.jsx
│   │   ├── KpiCard.jsx
│   │   ├── LineChart.jsx
│   │   └── PieChart.jsx
│   │
│   ├── Auth/                (9)         ← Composants d'authentification
│   │   ├── AuthCard.jsx
│   │   ├── AuthFooter.jsx
│   │   ├── AuthHeader.jsx
│   │   ├── AuthIllustration.jsx
│   │   ├── AuthInput.jsx
│   │   ├── AuthLogo.jsx
│   │   ├── BackButton.jsx
│   │   ├── FloatingElements.jsx
│   │   └── PasswordInput.jsx
│   │
│   ├── Common/              (1)
│   │   └── SupdataLogo.jsx
│   │
│   ├── Dashboard/           (10)        ← SuperAdmin dashboard
│   │   ├── AgencyStatus.jsx
│   │   ├── DashboardCharts.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── QuickActionsCard.jsx
│   │   ├── RecentActivity.jsx
│   │   ├── RecentPurchaseRequests.jsx
│   │   ├── RecentUsers.jsx
│   │   ├── StatCard.jsx
│   │   ├── SystemOverview.jsx
│   │   └── WelcomeBanner.jsx
│   │
│   ├── LocalAdmin/          (7)         ← Administrateur Local dashboard
│   │   ├── DashboardCharts.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── KpiCards.jsx
│   │   ├── NotificationsCard.jsx
│   │   ├── PendingRequestsCard.jsx
│   │   ├── QuickActionsCard.jsx
│   │   └── RecentActivityCard.jsx
│   │
│   ├── Administrative/      (7)         ← Gestion Administrative dashboard
│   │   ├── DashboardCharts.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── KpiCards.jsx
│   │   ├── NotificationsCard.jsx
│   │   ├── PendingDocumentsCard.jsx
│   │   ├── QuickActionsCard.jsx
│   │   └── RecentActivityCard.jsx
│   │
│   ├── Commercial/          (7)         ← Responsable Commercial dashboard
│   │   ├── DashboardCharts.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── KpiCards.jsx
│   │   ├── NotificationsCard.jsx
│   │   ├── PendingQuotesCard.jsx
│   │   ├── QuickActionsCard.jsx
│   │   └── RecentActivityCard.jsx
│   │
│   ├── Stock/               (14)        ← Responsable Stock + module Stock
│   │   ├── DashboardCharts.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── KpiCards.jsx
│   │   ├── LowStockAlertsCard.jsx
│   │   ├── NotificationsCard.jsx
│   │   ├── QuickActionsCard.jsx
│   │   ├── RecentMovementsCard.jsx
│   │   ├── StockCard.jsx
│   │   ├── StockDetails.jsx
│   │   ├── StockFilters.jsx
│   │   ├── StockMovementHistory.jsx
│   │   ├── StockStats.jsx
│   │   ├── StockStatusBadge.jsx
│   │   └── StockTable.jsx
│   │
│   ├── Users/               (21)        ← Gestion des utilisateurs
│   │   ├── AgencyBadge.jsx
│   │   ├── CreateUserForm.jsx
│   │   ├── DeleteUserDialog.jsx
│   │   ├── RoleBadge.jsx
│   │   ├── ToggleStatusDialog.jsx
│   │   ├── UserActivityTimeline.jsx
│   │   ├── UserCard.jsx
│   │   ├── UserInformationCard.jsx
│   │   ├── UserPermissionsCard.jsx
│   │   ├── UserPermissionsSelector.jsx
│   │   ├── UserPersonalInformation.jsx
│   │   ├── UserProfessionalInformation.jsx
│   │   ├── UserProfileCard.jsx
│   │   ├── UserSecurityCard.jsx
│   │   ├── UsersFilters.jsx
│   │   ├── UsersStats.jsx
│   │   ├── UsersTable.jsx
│   │   ├── UserStatsCards.jsx
│   │   ├── UserStatusBadge.jsx
│   │   ├── UserSummaryCard.jsx
│   │   └── UserSystemCard.jsx
│   │
│   ├── Demandes/            (6)         ← Gestion des demandes
│   │   ├── DemandeCard.jsx
│   │   ├── DemandeFilters.jsx
│   │   ├── DemandeStats.jsx
│   │   ├── DemandeTable.jsx
│   │   ├── RefuseDemandeDialog.jsx
│   │   └── ValidateDemandeDialog.jsx
│   │
│   ├── Roles/               (3)         ← Gestion des rôles
│   │   ├── RoleDetailDialog.jsx
│   │   ├── RolesStats.jsx
│   │   └── RolesTable.jsx
│   │
│   ├── Agences/             (3)         ← Gestion des agences
│   │   ├── AgenceDetailDialog.jsx
│   │   ├── AgencesStats.jsx
│   │   └── AgencesTable.jsx
│   │
│   ├── Profile/             (7)         ← Profil utilisateur
│   │   ├── ChangePasswordForm.jsx
│   │   ├── ProfileActivity.jsx
│   │   ├── ProfileAvatar.jsx
│   │   ├── ProfileHeader.jsx
│   │   ├── ProfileInformationForm.jsx
│   │   ├── ProfileStatistics.jsx
│   │   └── SessionList.jsx
│   │
│   └── Landing/             (11)        ← Page d'accueil marketing
│       ├── Benefits.jsx
│       ├── CTA.jsx
│       ├── DashboardPreview.jsx
│       ├── FAQ.jsx
│       ├── Features.jsx
│       ├── Footer.jsx
│       ├── Hero.jsx
│       ├── Modules.jsx
│       ├── Navbar.jsx
│       ├── Statistics.jsx
│       └── Workflow.jsx
│
├── Pages/
│   ├── Landing/Index.jsx
│   ├── Development/UIShowcase.jsx
│   │
│   ├── Dashboard/
│   │   ├── SuperAdmin/Index.jsx
│   │   ├── LocalAdmin/Index.jsx
│   │   ├── Administrative/Index.jsx
│   │   ├── Commercial/Index.jsx
│   │   ├── Stock/Index.jsx
│   │   ├── Reports/Index.jsx
│   │   ├── AuditLogs/Index.jsx
│   │   ├── Notifications/Index.jsx
│   │   └── Settings/Index.jsx
│   │
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── VerifyEmail.jsx
│   │
│   ├── Users/{Index,Show,Create,Edit}.jsx
│   ├── Roles/{Index,Show}.jsx
│   ├── Agences/Index.jsx
│   ├── Agencies/{Index,Show,Edit}.jsx
│   ├── Permissions/{Index,Show}.jsx
│   ├── Demandes/{Index,Show}.jsx
│   ├── Stock/{Index,Show}.jsx
│   ├── Profile/Index.jsx
│   └── Errors/{403,404,500}.jsx
│
├── Layouts/
│   ├── DashboardLayout.jsx     ← Layout principal dashboard
│   └── AuthLayout.jsx          ← Layout auth (50/50 grid)
│
├── Data/
│   ├── sidebarMenus.js         ← Config navigation par rôle
│   └── mockUsers.js            ← Mock users par rôle
│
├── Hooks/
│   ├── useAdministrativeDashboard.js
│   ├── useAgencies.js
│   ├── useCommercialDashboard.js
│   ├── useDemandes.js
│   ├── useLoading.js
│   ├── useLocalAdminDashboard.js
│   ├── useNotifications.js
│   ├── usePermissions.js
│   ├── useProfile.js
│   ├── useSettings.js
│   ├── useStock.js
│   ├── useStockDashboard.js
│   └── useUnsavedChanges.js
│
├── Mocks/
│   ├── activities.js
│   ├── activity.js
│   ├── administrativeDashboard.js
│   ├── agencies.js
│   ├── agencyActivity.js
│   ├── agencyProducts.js
│   ├── agencyUsers.js
│   ├── analytics.js
│   ├── auditLogs.js
│   ├── charts.js
│   ├── commercialDashboard.js
│   ├── demandes.js
│   ├── localAdminDashboard.js
│   ├── loginHistory.js
│   ├── notifications.js
│   ├── notificationsList.js
│   ├── permissionGroups.js
│   ├── permissions.js
│   ├── profile.js
│   ├── reports.js
│   ├── roleDetails.js
│   ├── rolePermissions.js
│   ├── roles.js
│   ├── roleUsers.js
│   ├── sessions.js
│   ├── settings.js
│   ├── stock.js
│   ├── stockDashboard.js
│   ├── stockMovements.js
│   └── systemInfo.js
│
└── lib/
    ├── animations.js           ← Config animations Framer Motion
    ├── mockAuth.js             ← Auth simulée (localStorage)
    └── utils.js                ← cn() = clsx + tailwind-merge
```

**Total : 127 composants, 34 pages, 13 hooks, 30 fichiers mock, ~55 routes.**

---

## Système de routes

### Route Isolation

Chaque Dashboard possède ses propres routes. Les routes communes sont autorisées uniquement pour :

- Profil
- Notifications
- Paramètres personnels

Toutes les autres routes appartiennent exclusivement au rôle concerné.

### Toutes les routes

| URL | Page | Route name |
|---|---|---|
| `/` | Landing/Index | `home` |
| `/ui-showcase` | Development/UIShowcase | `ui-showcase` |
| **Super Admin** | | |
| `/dashboard-super-admin` | Dashboard/SuperAdmin/Index | `super-admin.dashboard` |
| `/utilisateurs` | Users/Index | `users` |
| `/utilisateurs/creer` | Users/Create | `users.create` |
| `/utilisateurs/{id}/modifier` | Users/Edit | `users.edit` |
| `/utilisateurs/{id}` | Users/Show | `users.show` |
| `/roles-permissions` | Roles/Index | `roles` |
| `/roles/{id}` | Roles/Show | `roles.show` |
| `/agences` | Agences/Index | `agences` |
| `/agences/{id}/modifier` | Agencies/Edit | `agences.edit` |
| `/agences/{id}` | Agencies/Show | `agences.show` |
| `/permissions` | Permissions/Index | `permissions` |
| `/permissions/{roleId}` | Permissions/Show | `permissions.show` |
| **Administrateur Local** | | |
| `/dashboard-admin-local` | Dashboard/LocalAdmin/Index | `local-admin.dashboard` |
| `/demandes` | Demandes/Index | `demandes` |
| `/demandes/{id}` | Demandes/Show | `demandes.show` |
| **Gestion Administrative** | | |
| `/dashboard-administrative` | Dashboard/Administrative/Index | `administrative.dashboard` |
| **Responsable Commercial** | | |
| `/dashboard-commercial` | Dashboard/Commercial/Index | `commercial.dashboard` |
| **Responsable Stock** | | |
| `/dashboard-stock` | Dashboard/Stock/Index | `stock.dashboard` |
| `/stock` | Stock/Index | `stock` |
| `/stock/{id}` | Stock/Show | `stock.show` |
| **Communs** | | |
| `/rapports` | Dashboard/Reports/Index | `reports` |
| `/audit-logs` | Dashboard/AuditLogs/Index | `audit-logs` |
| `/notifications` | Dashboard/Notifications/Index | `notifications` |
| `/parametres` | Dashboard/Settings/Index | `settings` |
| `/profil` | Profile/Index | `profile` |

### Routes role-scopes

Chaque rôle possède des routes préfixées par son dashboard :

```
/dashboard-super-admin/utilisateurs
/dashboard-admin-local/demandes
/dashboard-admin-local/stock
/dashboard-administrative/rapports
/dashboard-commercial/notifications
/dashboard-stock/stock
...
```

**Route ordering** : les routes statiques (`/creer`, `/modifier`, `/demandes`) doivent être **AVANT** les routes dynamiques (`/{id}`) dans `web.php`.

---

## Rôles et navigation

### Les 5 rôles

| Rôle | Nom complet | Dashboard |
|---|---|---|
| Super Admin | Super Admin | `/dashboard-super-admin` |
| Administrateur Local | Administrateur Local | `/dashboard-admin-local` |
| Gestion Administrative | Gestion Administrative | `/dashboard-administrative` |
| Responsable Commercial | Responsable Commercial | `/dashboard-commercial` |
| Responsable Stock | Responsable Stock | `/dashboard-stock` |

### Sidebar dynamique

Le `Sidebar.jsx` lit `sidebarMenus[user.role]` depuis `Data/sidebarMenus.js`.

**Règle absolue** : Pour ajouter/supprimer une page, modifier **uniquement** `sidebarMenus.js`. Ne jamais toucher au `Sidebar.jsx`.

Le Sidebar génère automatiquement les links préfixés par le dashboard base path (ex: `/dashboard-admin-local/stock`).

### Menu par rôle

**Super Admin :**
```
Principal
  └─ Dashboard
Gestion
  ├─ Utilisateurs
  ├─ Rôles & Permissions
  └─ Agences
Système
  ├─ Rapports & Analytics
  ├─ Notifications
  ├─ Audit Logs
  └─ Paramètres
```

**Administrateur Local :**
```
Principal
  └─ Dashboard
Gestion
  ├─ Demandes
  └─ Stock
Suivi
  ├─ Rapports
  ├─ Notifications
  └─ Historique
```

**Gestion Administrative :**
```
Principal
  └─ Dashboard
Documents
  ├─ Documents à traiter
  ├─ Notes de service
  └─ Contrats
Suivi
  ├─ Rapports financiers
  ├─ Notifications
  └─ Paramètres
```

**Responsable Commercial :**
```
Principal
  └─ Dashboard
Commercial
  ├─ Devis
  ├─ Clients
  └─ Pipeline
Suivi
  ├─ Rapports commerciaux
  └─ Notifications
```

**Responsable Stock :**
```
Principal
  └─ Dashboard
Gestion
  ├─ Stock
  ├─ Entrées de stock
  ├─ Sorties de stock
  ├─ Alertes stock
  └─ Inventaire
Suivi
  ├─ Commandes
  ├─ Rapports
  └─ Notifications
```

---

## Dashboard par rôle

Chaque dashboard possède :

| Élément | Emplacement |
|---|---|
| Page principale | `Pages/Dashboard/{Role}/Index.jsx` |
| Composants spécifiques | `Components/{Role}/*.jsx` |
| Mock data | `Mocks/{role}Dashboard.js` |
| Hook dédié | `Hooks/use{Role}Dashboard.js` |

### DashboardLayout

Toutes les pages dashboard passent par `DashboardLayout` :

```jsx
<DashboardLayout title="..." breadcrumbs={[...]} user={user}>
  {content}
</DashboardLayout>
```

Props : `title`, `breadcrumbs`, `user`.

Le `DashboardLayout` est **totalement générique** — aucune condition `if(role === "...")` ne doit y apparaître.

### Utilisateur mock (mockAuth)

La simulation d'authentification utilise `localStorage` :

```js
import { getCurrentUser, setCurrentUser, getDashboardPath } from "@/lib/mockAuth";

// Lire l'utilisateur courant
const user = getCurrentUser();

// Sauvegarder (appelé par chaque dashboard au montage)
setCurrentUser(user);

// Obtenir le path du dashboard pour un rôle
getDashboardPath("Administrateur Local"); // → "/dashboard-admin-local"
```

Chaque page dashboard écrit l'utilisateur dans `localStorage` via `useEffect` au montage. Les pages partagées (Stock, Demandes, Reports, etc.) lisent via `getCurrentUser()`.

---

## Système de design

### Path Alias

`@/*` → `resources/js/*` (via `jsconfig.json` + Vite).

```js
// Toujours utiliser :
import { Button } from "@/Components/UI/Button"
import { getCurrentUser } from "@/lib/mockAuth"
```

### Design Tokens (CSS Variables)

Définis dans `resources/css/app.css` — mode light + dark :

| Token | Valeur (light) | Usage |
|---|---|---|
| `--primary` | `221 83% 53%` | Boutons, links, accents |
| `--destructive` | `0 84.2% 60.2%` | Erreurs, suppressions |
| `--success` | `142 76% 36%` | Validations, badges verts |
| `--warning` | `38 92% 50%` | Alertes, badges jaunes |
| `--info` | `217 91% 60%` | Info, badges bleus |
| `--border` | `214.3 31.8% 91.4%` | Bordures |
| `--radius` | `0.5rem` | Border radius |

### Règles de style

- **Toujours** utiliser les composants `@/Components/UI/` — jamais dupliquer
- **Pas de `space-x-*` / `space-y-*`** → utiliser `flex gap-*` / `flex flex-col gap-*`
- **`cn()`** pour les classes conditionnelles
- **`size-*`** pour dimensions égales w/h
- **Font** : Inter (configuré dans `tailwind.config.js`)
- **Background dashboard** : `bg-[#f8fafc]` (slate-50)
- **`Separator` n'existe PAS** dans `Components/UI/` — utiliser `<hr className="border-slate-100" />`

### Animations (Framer Motion)

Subtiles uniquement :

```jsx
// Fade up (entrée de page)
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.35 }}

// Hover (cartes)
whileHover={{ y: -2 }}

// Stagger (liste)
transition={{ duration: 0.35, delay: i * 0.05 }}
```

### Responsive

Desktop First. Breakpoints :
- `sm: 640px`
- `lg: 1024px`
- `xl: 1280px`
- `2xl: 1536px`

Le Sidebar devient Drawer sur mobile (gestion dans `Sidebar.jsx`).

---

## Catalogue des composants

### Composants UI (27) — `Components/UI/`

| Composant | Description |
|---|---|
| `Alert` | Alerte inline (info, warning, error, success) |
| `Avatar` | Avatar avec image ou fallback initiales |
| `Badge` | Badge de statut (variants: default, secondary, destructive, success, warning, info) |
| `Breadcrumb` | Fil d'Ariane (Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator) |
| `Button` | Bouton (variants: default, destructive, outline, secondary, ghost, link + sizes) |
| `Card` | Carte (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) |
| `Checkbox` | Case à cocher |
| `DataTable` | Tableau de données avec props `columns`, `data`, `emptyMessage`, `isLoading` |
| `Dialog` | Modale (Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose) |
| `Drawer` | Panneau latéral |
| `DropdownMenu` | Menu déroulant |
| `EmptyState` | État vide avec icône + message + action |
| `Input` | Champ de texte |
| `Label` | Label de formulaire |
| `PageHeader` | En-tête de page |
| `Pagination` | Pagination |
| `SearchInput` | Champ de recherche avec icône |
| `Select` | Sélecteur (Select, SelectTrigger, SelectValue, SelectContent, SelectItem) |
| `Skeleton` | Placeholder de chargement |
| `Spinner` | Indicateur de chargement |
| `Switch` | Interrupteur toggle |
| `Table` | Table HTML basique (Table, TableHeader, TableBody, TableRow, TableHead, TableCell) |
| `TablePagination` | Pagination de tableau |
| `Tabs` | Onglets (Tabs, TabsList, TabsTrigger, TabsContent) |
| `Textarea` | Zone de texte |
| `Toast` | Notification toast (useToast hook) |
| `Tooltip` | Infobulle (Tooltip, TooltipTrigger, TooltipContent, TooltipProvider) |

### Composants Layout (13) — `Components/Layout/`

| Composant | Description |
|---|---|
| `Breadcrumbs` | Fil d'Ariane dynamique (lit `getCurrentUser()` pour le lien Accueil) |
| `Header` | En-tête de page avec breadcrumbs + actions |
| `NotificationDropdown` | Dropdown de notifications dans le header |
| `PageContainer` | Conteneur de page avec padding |
| `PageTitle` | Titre + description de page |
| `QuickActions` | Actions rapides |
| `SearchBar` | Barre de recherche globale |
| `Sidebar` | Sidebar principale (desktop + mobile drawer) |
| `SidebarCollapse` | Bouton de réduction de sidebar |
| `SidebarFooter` | Pied de sidebar (info utilisateur) |
| `SidebarGroup` | Groupe d'items dans la sidebar |
| `SidebarItem` | Item individuel de la sidebar (avec détection active state) |
| `UserDropdown` | Menu utilisateur dans le header |

### Composants Charts (7) — `Components/Charts/`

| Composant | Description |
|---|---|
| `AreaChart` | Graphique en aires |
| `BarChart` | Graphique en barres |
| `ChartCard` | Carte conteneur pour graphiques |
| `ChartContainer` | Conteneur responsive pour graphiques |
| `KpiCard` | Carte KPI (valeur + tendance + icône) |
| `LineChart` | Graphique en lignes |
| `PieChart` | Graphique en secteurs |

### Composants Auth (9) — `Components/Auth/`

| Composant | Description |
|---|---|
| `AuthCard` | Carte conteneur pour pages auth |
| `AuthFooter` | Pied de page auth |
| `AuthHeader` | En-tête auth (titre + sous-titre) |
| `AuthIllustration` | Illustration côté droit |
| `AuthInput` | Champ de formulaire auth |
| `AuthLogo` | Logo sur page auth |
| `BackButton` | Bouton retour |
| `FloatingElements` | Éléments décoratifs animés |
| `PasswordInput` | Champ mot de passe avec toggle visibilité |

### Composants par domaine

| Module | Composants | Fichier(s) |
|---|---|---|
| **Users** (21) | UsersTable, UsersFilters, UsersStats, CreateUserForm, UserCard, UserSummaryCard, UserInformationCard, UserPermissionsCard, UserPermissionsSelector, UserPersonalInformation, UserProfessionalInformation, UserProfileCard, UserSecurityCard, UserSystemCard, UserActivityTimeline, UserStatsCards, UserStatusBadge, RoleBadge, AgencyBadge, DeleteUserDialog, ToggleStatusDialog | `Components/Users/` |
| **Demandes** (6) | DemandeTable, DemandeFilters, DemandeStats, DemandeCard, ValidateDemandeDialog, RefuseDemandeDialog | `Components/Demandes/` |
| **Stock** (14) | StockTable, StockFilters, StockStats, StockCard, StockDetails, StockMovementHistory, StockStatusBadge, DashboardHeader, KpiCards, DashboardCharts, LowStockAlertsCard, NotificationsCard, QuickActionsCard, RecentMovementsCard | `Components/Stock/` |
| **Roles** (3) | RolesTable, RolesStats, RoleDetailDialog | `Components/Roles/` |
| **Agences** (3) | AgencesTable, AgencesStats, AgenceDetailDialog | `Components/Agences/` |
| **Profile** (7) | ProfileHeader, ProfileAvatar, ProfileInformationForm, ChangePasswordForm, ProfileActivity, ProfileStatistics, SessionList | `Components/Profile/` |
| **Landing** (11) | Navbar, Hero, Features, Benefits, Modules, Statistics, Workflow, DashboardPreview, CTA, FAQ, Footer | `Components/Landing/` |

---

## Stratégie Mock Data

### Principe

Pendant toute la phase Frontend :
- Utiliser **uniquement** des Mock Data
- **Ne jamais** appeler une API
- **Ne jamais** connecter Laravel
- **Ne jamais** créer de logique métier réelle

### Organisation

Chaque module possède ses propres Mock Data dans `Mocks/` :

| Fichier | Contenu |
|---|---|
| `stock.js` | 41 produits across 5 agences (Casablanca, Rabat, Tanger, Fès, Marrakech) |
| `stockMovements.js` | Mouvements de stock par produit ID |
| `stockDashboard.js` | Données dashboard Stock |
| `demandes.js` | Demandes d'achat |
| `agencies.js` | Agences SUPDATA |
| `roles.js` | Rôles et permissions |
| `notificationsList.js` | Notifications (20 entrées) |
| `auditLogs.js` | Journaux d'audit |
| `reports.js` | Données de rapports |
| `charts.js` | Données pour tous les graphiques |
| `analytics.js` | Données analytiques |
| `activities.js` | Activités récentes |
| `profile.js` | Données profil utilisateur |
| `settings.js` | Paramètres système |
| `sessions.js` | Sessions actives |
| `loginHistory.js` | Historique de connexions |
| `systemInfo.js` | Info système |
| `localAdminDashboard.js` | Données dashboard Admin Local |
| `administrativeDashboard.js` | Données dashboard Admin Gestion |
| `commercialDashboard.js` | Données dashboard Commercial |

### Règles

1. **Les composants ne doivent jamais contenir de données codées en dur**
2. **Toutes les données doivent être passées via des Props** (facilite l'intégration future avec Laravel + Inertia)
3. **Créer un Hook dédié** pour chaque module dans `Hooks/`
4. Les hooks acceptent des params avec mock defaults pour fonctionner avec ou sans Inertia props

---

## Hooks

| Hook | Fichier | Utilité |
|---|---|---|
| `useStock` | `Hooks/useStock.js` | Données + filtres + pagination stock |
| `useStockDashboard` | `Hooks/useStockDashboard.js` | KPIs + charts dashboard Stock |
| `useDemandes` | `Hooks/useDemandes.js` | Données + filtres + validation/refus demandes |
| `useNotifications` | `Hooks/useNotifications.js` | Notifications + filtres + pagination |
| `useProfile` | `Hooks/useProfile.js` | Données profil + mise à jour |
| `useSettings` | `Hooks/useSettings.js` | Formulaire paramètres (useSettingsForm) |
| `usePermissions` | `Hooks/usePermissions.js` | Permissions par rôle |
| `useAgencies` | `Hooks/useAgencies.js` | Données agences |
| `useLocalAdminDashboard` | `Hooks/useLocalAdminDashboard.js` | KPIs dashboard Admin Local |
| `useAdministrativeDashboard` | `Hooks/useAdministrativeDashboard.js` | KPIs dashboard Admin Gestion |
| `useCommercialDashboard` | `Hooks/useCommercialDashboard.js` | KPIs dashboard Commercial |
| `useLoading` | `Hooks/useLoading.js` | État de chargement |
| `useUnsavedChanges` | `Hooks/useUnsavedChanges.js` | Détection modifications non sauvegardées |

---

## Conventions de code

### Structure d'un composant

```jsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

export default function MaPage() {
    const user = useMemo(() => getCurrentUser(), []);

    return (
        <DashboardLayout
            title="Titre de la page"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Ma Page" },
            ]}
            user={user}
        >
            {/* Contenu */}
        </DashboardLayout>
    );
}
```

### Structure d'un nouveau module CRUD

1. `Pages/{Module}/Index.jsx` — liste avec tableau + filtres + pagination
2. `Pages/{Module}/Show.jsx` — détail
3. `Pages/{Module}/Create.jsx` — formulaire création
4. `Pages/{Module}/Edit.jsx` — formulaire modification (réutilise le form de Create)
5. `Components/{Module}/*.jsx` — composants spécifiques au module

**Edit doit réutiliser le formulaire de Create** via props `initialValues` et `mode="edit"`. Ne jamais dupliquer le formulaire.

### Imports

```js
// Toujours utiliser le path alias @/*
import { Button } from "@/Components/UI/Button"
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth"
import { cn } from "@/lib/utils"

// Jamais de require() — ESM uniquement
// module: "type": "module" dans package.json
```

### Composants fonctionnels uniquement

```jsx
// ✅ Bon
export default function MonComposant({ title, items }) {
    return <div>{title}</div>;
}

// ❌ Mauvais — pas de class components
class MonComposant extends React.Component { ... }
```

### Props destructurées

```jsx
// ✅ Bon
function MonComposant({ title, items, onSelect }) { ... }

// ❌ Mauvais
function MonComposant(props) { ... }
```

### Langue

Toutes les chaînes de caractères en **français**.

### Accessibilité

```jsx
// Formulaires
<input aria-label="Nom" aria-required="true" aria-invalid={!!error} />

// Navigation
<Link aria-current={isActive ? "page" : undefined}>...</Link>
```

### DataTable

```jsx
<DataTable
    columns={columns}
    data={data}
    emptyMessage="Aucun résultat trouvé"
    isLoading={loading}
/>
```

---

## Gotchas et pièges courants

| Piège | Solution |
|---|---|
| `@tailwindcss/forms` est dans devDeps mais le plugin est chargé dans `tailwind.config.js` | Ne pas retirer le plugin |
| Dark mode configuré (`darkMode: "class"`) mais pas activé côté UI | Ne pas activer sans demande explicite |
| Auth controllers sont des stubs (pas de logique) | Phase Frontend uniquement |
| `lib/animations.js` existe mais n'est importé nulle part | Dead code — ne pas supprimer |
| Pas de barrel files (index.js) dans `resources/js/` | Importer directement le fichier |
| `Separator` n'existe pas dans `Components/UI/` | Utiliser `<hr className="border-slate-100" />` |
| `Drawer` existe dans `Components/UI/Drawer.jsx` | L'utiliser pour les panneaux latéraux mobile |
| Les hooks acceptent des params avec mock defaults | Pour fonctionner avec ou sans Inertia props |
| Les routes dans `web.php` sont frontend-only | Pas de logique Backend pour l'instant |
| Le Sidebar est entièrement généré depuis `sidebarMenus.js` | Aucun composant ne doit construire un menu manuellement |
| L'ajout/suppression d'une page se fait dans `sidebarMenus.js` | Ne jamais toucher au `Sidebar.jsx` pour ça |
| Le Sidebar ne contient jamais de `if(role === "...")` | Chaque rôle possède sa propre config dans `sidebarMenus.js` |
| `Separator` n'existe pas — ne pas l'importer | Utiliser `<hr>` ou `border-t` |
| `DashboardLayout` ne doit jamais contenir de condition de rôle | La logique métier va dans `Pages/Dashboard/{Role}/` |

---

## Fichiers de configuration

### `tailwind.config.js`

- Dark mode : `"class"` (configuré, pas activé)
- Font : Inter
- Plugins : `@tailwindcss/forms`
- Tokens : CSS variables via `hsl(var(--token))`

### `vite.config.js`

- Entry : `resources/js/app.jsx`
- Server : `127.0.0.1:5173` (strict port, CORS)
- Plugins : `laravel-vite-plugin` + `@vitejs/plugin-react`

### `jsconfig.json`

- Path alias : `@/*` → `resources/js/*`
- Ziggy alias : `ziggy-js` → `./vendor/tightenco/ziggy`

### `postcss.config.js`

- Plugins : `tailwindcss` + `autoprefixer`

---

## Métriques du projet

| Catégorie | Nombre |
|---|---|
| Composants total | 127 |
| Composants UI | 27 |
| Composants Layout | 13 |
| Composants Auth | 9 |
| Composants Charts | 7 |
| Composants Dashboard | 45 (10 SA + 7 LA + 7 Admin + 7 Commercial + 14 Stock) |
| Composants métier | 26 (21 Users + 6 Demandes + 3 Roles + 3 Agences) |
| Pages | 34 |
| Hooks | 13 |
| Fichiers Mock | 30 |
| Routes | ~55 |
| Rôles | 5 |
| Agences mock | 5 (Casablanca, Rabat, Tanger, Fès, Marrakech) |
| Produits mock | 41 |

---

## Intégration future (Backend)

Quand la phase Backend commencera :

1. **Remplacer les Hooks** : Chaque hook (`useStock`, `useDemandes`, etc.) sera modifié pour appeler des routes Inertia au lieu de retourner des mock data
2. **Supprimer les Mocks** : Les fichiers dans `Mocks/` seront progressivement remplacés par des API calls
3. **Connecter les controllers** : Les stubs dans `app/Http/Controllers/` seront implémentés
4. **Ajouter la validation** : Les formulaires utiliseront la validation Zod côté client + Laravel côté serveur
5. **Gérer les permissions** : Le système de permissions existant (`permissions.js`, `rolePermissions.js`) sera connecté à Laravel

> Grâce à l'architecture actuelle (données passées via Props, hooks abstraits), cette transition sera minimale : modifier les hooks, pas les composants.
