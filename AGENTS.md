# AGENTS.md

## Project

SUPDATA ERP — ERP interne pour la gestion des achats, stock, clients et agences SUPDATA.

**Phase actuelle : Frontend uniquement.** Pas de logique métier, pas d'API, pas de CRUD backend pour l'instant. Toutes les données sont des Mock Data.

---

## Stack

| Layer | Tech | Version |
|---|---|---|
| Frontend | React 18 + Inertia.js 2 | — |
| UI | shadcn/ui (Radix primitives) + Tailwind CSS **v3** | `^3.2.1` |
| Animations | Framer Motion | `^12.42` |
| Charts | Recharts | `^3.9` |
| Icons | Lucide React (unique — jamais d'autre biblio) | — |
| Build | Vite 7 + laravel-vite-plugin | — |
| Backend | Laravel 12 / PHP 8.3+ | — |
| DB | MySQL | — |

---

## Commands

```bash
npm run dev       # Vite dev server (127.0.0.1:5173)
npm run build     # Production build — DOIT passer avant chaque fin de tâche
php artisan serve # Laravel dev server (127.0.0.1:8000)
```

**Pas de `npm run lint`, pas de `npm run test`.** Seul `npm run build` vérifie la compilation.

---

## Path Alias

`@/*` → `resources/js/*` (via `jsconfig.json` + Vite).

Toujours utiliser : `import { Button } from "@/Components/UI/Button"`

---

## Module System

`"type": "module"` dans package.json — imports ESM partout (`import/export`, jamais `require`).

---

## Routes

| URL | Page | Route name |
|---|---|---|
| `/` | Landing/Index | `home` |
| `/ui-showcase` | Development/UIShowcase | `ui-showcase` |
| `/dashboard-super-admin` | Dashboard/SuperAdmin/Index | `super-admin.dashboard` |
| `/dashboard-admin-local` | Dashboard/LocalAdmin/Index | `local-admin.dashboard` |
| `/dashboard-administrative` | Dashboard/Administrative/Index | `administrative.dashboard` |
| `/dashboard-commercial` | Dashboard/Commercial/Index | `commercial.dashboard` |
| `/dashboard-stock` | Dashboard/Stock/Index | `stock.dashboard` |
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
| `/rapports` | Dashboard/Reports/Index | `reports` |
| `/audit-logs` | Dashboard/AuditLogs/Index | `audit-logs` |
| `/notifications` | Dashboard/Notifications/Index | `notifications` |
| `/parametres` | Dashboard/Settings/Index | `settings` |
| `/demandes` | Demandes/Index | `demandes` |
| `/demandes/{id}` | Demandes/Show | `demandes.show` |
| `/profil` | Profile/Index | `profile` |

Routes auth : `routes/auth.php` (stubs, controllers vides).
Routes web : `routes/web.php` (closures Inertia).

**Route ordering** : les routes statiques (`/creer`, `/modifier`, `/demandes`) doivent être AVANT les routes dynamiques (`/{id}`).

---




## Route Isolation

Chaque Dashboard possède ses propres routes.

Les routes communes sont autorisées uniquement pour :

- Profil
- Notifications
- Paramètres personnels

Toutes les autres routes appartiennent exclusivement au rôle concerné.

Exemple :

Super Admin
/dashboard-super-admin
/utilisateurs
/agences

Administrateur Local
/dashboard-admin-local
/demandes
/stock

Gestion Administrative
/dashboard-administrative
/documents

Responsable Commercial
/dashboard-commercial
/clients
/devis

Responsable Stock
/dashboard-stock
/inventaire
/entrees
/sorties

Une route ne doit jamais être affichée dans le Sidebar d'un autre rôle.


## Folder Structure

```
resources/js/
├── Components/
│   ├── UI/          # 27 composants réutilisables (shadcn/ui)
│   ├── Layout/      # Sidebar, Header, Breadcrumbs, SidebarGroup, SidebarItem, etc.
│   ├── Dashboard/   # WelcomeBanner, StatCard, DashboardCharts, etc.
│   ├── Users/       # UsersTable, UserStatusBadge, CreateUserForm, etc.
│   ├── Auth/        # AuthCard, AuthInput, PasswordInput, etc.
│   ├── Landing/     # Navbar, Footer, Hero, etc.
│   ├── Common/      # SupdataLogo
│   ├── Charts/      # ChartCard, LineChart, BarChart, PieChart, AreaChart, KpiCard
│   ├── Demandes/    # DemandeStats, DemandeFilters, DemandeTable, etc.
│   ├── Profile/     # ProfileHeader, ProfileAvatar, ChangePasswordForm, etc.
│   ├── LocalAdmin/  # DashboardHeader, KpiCards, DashboardCharts, etc.
│   ├── Stock/       # DashboardHeader, KpiCards, etc.
│   ├── Commercial/  # DashboardHeader, KpiCards, etc.
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
│   ├── Demandes/{Index,Show}.jsx
│   ├── Profile/Index.jsx
│   ├── Auth/{Login,ForgotPassword,ResetPassword,VerifyEmail}.jsx
│   ├── Landing/Index.jsx
│   └── Errors/{403,404,500}.jsx
├── Data/
│   ├── sidebarMenus.js    # Config navigation par rôle
│   └── mockUsers.js       # Mock users par rôle
├── Mocks/                  # Données simulées par module
├── Hooks/                  # Hooks par module (useDemandes, useProfile, etc.)
└── lib/
    ├── utils.js           # cn() = clsx + tailwind-merge
    └── animations.js      # Config animations Framer Motion (non importé)
```

---

## Design System Rules

- **Toujours** utiliser les composants `@/Components/UI/` — jamais dupliquer
- **Pas de `space-x-*` / `space-y-*`** → utiliser `flex gap-*` / `flex flex-col gap-*`
- **`cn()`** pour les classes conditionnelles
- **`size-*`** pour dimensions égales w/h
- **Tokens** : CSS variables dans `resources/css/app.css` (light + dark mode)
- **Font** : Inter (configuré dans tailwind.config.js)
- **Background** : `bg-[#f8fafc]` (slate-50) pour le dashboard
- **`Separator`** n'existe PAS dans `Components/UI/` — utiliser `<hr className="border-slate-100" />`

---

## Dashboard Layout

Toutes les pages dashboard须 passer par `DashboardLayout` :

```jsx
<DashboardLayout title="..." breadcrumbs={[...]} user={user}>
  {content}
</DashboardLayout>
```

Props : `title`, `breadcrumbs`, `user`.
Sidebar collapse géré en interne (`useState`).

---

## Dashboard

5 rôles, 5 dashboards indépendants. Chaque rôle a :
- sa propre page : `Pages/Dashboard/{Role}/Index.jsx`
- ses propres composants : `Components/{Role}/*.jsx`
- ses propres mock data : `Mocks/{role}Dashboard.js`
- son propre hook : `Hooks/use{Role}Dashboard.js`

**Sidebar dynamique** : `Sidebar.jsx` lit `sidebarMenus[user.role]` depuis `Data/sidebarMenus.js`. Pour ajouter une page à un rôle, modifier `sidebarMenus.js` — ne jamais toucher au `Sidebar.jsx`.

**Isolation** : les composants métier d'un rôle ne doivent jamais être réutilisés par un autre. Seuls les composants UI génériques (`@/Components/UI/`, `Layout/`, `Charts/`) peuvent être partagés.

---








## Dashboard Architecture

Tous les Dashboards utilisent le même DashboardLayout.

Le DashboardLayout ne contient aucune logique métier.

Il reçoit uniquement les informations suivantes :

- utilisateur connecté
- rôle
- menu du Sidebar
- breadcrumbs
- contenu de la page

Le DashboardLayout doit rester totalement générique.

Toute logique spécifique à un rôle doit être implémentée dans :

Pages/Dashboard/{Role}/

ou

Components/{Role}/

Le DashboardLayout ne doit jamais contenir de condition du type :

if(role === "...")

Le choix du Dashboard est effectué avant le rendu du Layout.





## CRUD Pages Convention

Pour chaque nouveau module :

1. `Pages/{Module}/Index.jsx` — liste avec tableau + filtres + pagination
2. `Pages/{Module}/Show.jsx` — détail
3. `Pages/{Module}/Create.jsx` — formulaire création
4. `Pages/{Module}/Edit.jsx` — formulaire modification (réutilise le form de Create)
5. `Components/{Module}/*.jsx` — composants spécifiques au module

**Edit doit réutiliser le formulaire de Create** via props `initialValues` et `mode="edit"`. Ne jamais dupliquer le formulaire.

---

## Mock Data Strategy

Pendant toute la phase Frontend :

- utiliser uniquement des Mock Data ;
- ne jamais appeler une API ;
- ne jamais connecter Laravel ;
- ne jamais créer de logique métier réelle.

Toutes les données simulées doivent être placées dans `resources/js/Mocks/`.
Chaque module possède ses propres Mock Data.

Créer un Hook dédié pour chaque module dans `resources/js/Hooks/`.

Les composants ne doivent jamais contenir de données codées en dur.
Toutes les données doivent être passées via des Props afin de faciliter l'intégration future avec Laravel + Inertia.js.

---

## Animations

Framer Motion — subtil uniquement :
- `initial={{ opacity: 0, y: 12 }}` + `animate={{ opacity: 1, y: 0 }}`
- `whileHover={{ y: -2 }}` pour les cartes
- `transition={{ duration: 0.35, delay: i * 0.05 }}` pour le stagger

---

## Responsive

Desktop First. Breakpoints : `sm:640` → `lg:1024` → `xl:1280` → `2xl:1536`.

Le Sidebar devient Drawer sur mobile (gestion dans `Sidebar.jsx`).

---

## Code Style

- Functional components uniquement
- Props destructurées
- `React.forwardRef` pour les composants UI bas niveau
- Pas de CSS inline
- Toutes les chaînes en **français**
- `aria-label`, `aria-required`, `aria-invalid` sur les formulaires
- `DataTable` : props `columns` + `data` + `emptyMessage` + `isLoading` (voir `Components/UI/DataTable.jsx`)
- Hooks : accepter des params avec mock defaults pour faciliter l'intégration Inertia

---

## Gotchas

- `@tailwindcss/forms` est dans devDeps mais le plugin est chargé dans `tailwind.config.js`
- Dark mode configuré (`darkMode: "class"`) mais pas encore activé côté UI
- Auth controllers sont des stubs (pas de logique)
- `lib/animations.js` existe mais n'est importé nulle part (dead code)
- Pas de barrel files (index.js/index.jsx) dans `resources/js/`
- `Separator` n'existe pas — ne pas l'importer
- `Drawer` existe dans `Components/UI/Drawer.jsx`
- Les hooks acceptent des params avec mock defaults (ex: `useDemandes()`) pour fonctionner avec ou sans Inertia props
- Les routes dans `web.php` sont frontend-only — pas de logique Backend pour l'instant
- Le Sidebar est entièrement généré depuis Data/sidebarMenus.js.
- Aucun composant ne doit construire un menu manuellement.
- L'ajout ou la suppression d'une page se fait uniquement dans sidebarMenus.js.
- Le Sidebar ne contient jamais de if(role === "...").
- Chaque rôle possède sa propre configuration de navigation.
