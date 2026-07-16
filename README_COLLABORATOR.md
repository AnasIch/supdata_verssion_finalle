# SUPDATA ERP

ERP interne pour la gestion des achats, stock, agences et clients SUPDATA.

**Phase actuelle : Frontend uniquement.** Toutes les données sont des Mock Data. Pas d'API, pas de Backend.

---

## Stack technique

| Layer | Tech |
|---|---|
| Backend | Laravel 12 / PHP 8.3+ |
| Frontend | React 18 + Inertia.js 2 |
| UI | shadcn/ui (Radix) + Tailwind CSS v3 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Build | Vite 7 |

---

## Architecture

```
resources/js/
├── Components/     # Composants réutilisables par module
├── Layouts/        # DashboardLayout, AuthLayout
├── Pages/          # Pages (une par route)
├── Mocks/          # Données simulées par module
├── Hooks/          # Hooks custom par module
├── Data/           # Config navigation (sidebarMenus.js)
└── lib/            # Utils (cn), mockAuth
```

Chaque Dashboard possède **ses propres** Pages, Components, Hooks et Mock Data.

**Règle fondamentale :** les composants métier ne sont jamais partagés entre deux rôles. Seuls les composants UI génériques (`Components/UI/`, `Layout/`, `Charts/`) peuvent être réutilisés.

---

## Dashboards terminés

✅ Super Admin
✅ Administrateur Local
✅ Responsable Commercial

Ces Dashboards sont considérés comme terminés. Ne pas les modifier sauf correction de bug.

---

## Dashboards à développer

⏳ Gestion Administrative
⏳ Responsable Stock

Ces Dashboards doivent respecter exactement la même architecture que les Dashboards déjà terminés.

---

## Règles importantes

- Respecter `AGENTS.md` — source de vérité pour le projet.
- Ne jamais casser un Dashboard terminé.
- Ne jamais modifier un Dashboard terminé sans validation.
- Utiliser uniquement des Mock Data (`resources/js/Mocks/`).
- Aucune API. Aucun Backend.
- Aucun composant métier partagé entre les rôles.
- Toujours respecter l'architecture existante.
- Toujours exécuter `npm run build` avant de valider.

---

## Workflow recommandé

Pour chaque nouvelle fonctionnalité :

1. Créer les **Mock Data** (`Mocks/`)
2. Créer le **Hook** (`Hooks/`)
3. Créer les **composants** (`Components/`)
4. Créer les **Pages** (`Pages/`)
5. Ajouter les **routes** (`routes/web.php`)
6. Vérifier le responsive
7. Exécuter `npm run build`

---

## Répartition du projet

**Développeur 1 (Anas)**

✅ Dashboard Super Admin
✅ Dashboard Administrateur Local
✅ Dashboard Responsable Commercial

**Développeur 2**

⏳ Dashboard Gestion Administrative
⏳ Dashboard Responsable Stock

Les Dashboards déjà terminés ne doivent être modifiés qu'après validation ou pour corriger un bug.
