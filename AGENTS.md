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
| `/dashboard` | Dashboard/Index | `dashboard` |
| `/utilisateurs` | Users/Index | `users` |
| `/utilisateurs/creer` | Users/Create | `users.create` |
| `/utilisateurs/{id}/modifier` | Users/Edit | `users.edit` |
| `/utilisateurs/{id}` | Users/Show | `users.show` |

Routes auth : `routes/auth.php` (stubs, controllers vides).
Routes web : `routes/web.php` (closures Inertia).

**Route ordering** : les routes statiques (`/creer`, `/modifier`) doivent être AVANT les routes dynamiques (`/{id}`).

---

## Folder Structure

```
resources/js/
├── Components/
│   ├── UI/          # 25 composants réutilisables (shadcn/ui)
│   ├── Layout/      # Sidebar, Header, Breadcrumbs, etc.
│   ├── Dashboard/   # StatCard, DashboardCharts, etc.
│   ├── Users/       # UsersTable, UserStatusBadge, CreateUserForm, etc.
│   ├── Auth/        # AuthCard, AuthInput, PasswordInput, etc.
│   ├── Landing/     # Navbar, Footer, Hero, etc.
│   └── Common/      # SupdataLogo
├── Layouts/
│   ├── DashboardLayout.jsx  # Layout principal dashboard
│   └── AuthLayout.jsx       # Layout auth (50/50 grid)
├── Pages/
│   ├── Dashboard/Index.jsx
│   ├── Users/{Index,Show,Create,Edit}.jsx
│   ├── Auth/{Login,ForgotPassword,ResetPassword,VerifyEmail}.jsx
│   ├── Landing/Index.jsx
│   └── Errors/{403,404,500}.jsx
├── lib/utils.js     # cn() = clsx + tailwind-merge
└── Hooks/
```

---

## Design System Rules

- **Toujours** utiliser les composants `@/Components/UI/` — jamais dupliquer
- **Pas de `space-x-*` / `space-y-*`** → utiliser `flex gap-*`
- **`cn()`** pour les classes conditionnelles
- **`size-*`** pour dimensions égales w/h
- **Tokens** : CSS variables dans `resources/css/app.css` (light + dark mode)
- **Font** : Inter (configuré dans tailwind.config.js)
- **Background** : `bg-[#f8fafc]` (slate-50) pour le dashboard

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

## CRUD Pages Convention

Pour chaque nouveau module :

1. `Pages/{Module}/Index.jsx` — liste avec tableau + filtres + pagination
2. `Pages/{Module}/Show.jsx` — détail
3. `Pages/{Module}/Create.jsx` — formulaire création
4. `Pages/{Module}/Edit.jsx` — formulaire modification (réutilise le form de Create)
5. `Components/{Module}/*.jsx` — composants spécifiques au module

**Edit doit réutiliser le formulaire de Create** via props `initialValues` et `mode="edit"`. Ne jamais dupliquer le formulaire.

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

---

## Gotchas

- Le nav du Sidebar est **hardcodé** dans `Sidebar.jsx` — pas encore dynamique par rôle
- `@tailwindcss/forms` est dans devDeps mais le plugin est chargé dans tailwind.config.js
- Dark mode configuré (`darkMode: "class"`) mais pas encore activé côté UI
- Auth controllers sont des stubs (pas de logique)
- CreateUserForm accepte `initialValues` + `mode` pour réutilisation Create/Edit
- UserSecurityCard accepte `isEdit` pour rendre le mot de passe optionnel en modification
