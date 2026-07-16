# SUPDATA ERP

ERP interne pour la gestion des achats, stock, agences et clients SUPDATA.

Développé avec **Laravel 12** + **React 18** + **Inertia.js**.

---

## Aperçu

SUPDATA ERP est une application web interne destinée à centraliser la gestion opérationnelle de SUPDATA. Le projet offre un tableau de bord dédié par rôle, une gestion complète des demandes d'achat, du stock et des agences, le tout avec une interface moderne et responsive.

---

## Fonctionnalités

- 🔐 Authentification
- 👥 Gestion des utilisateurs
- 🛡️ Gestion des rôles & permissions
- 🏢 Gestion des agences
- 📋 Demandes d'achat
- 📦 Gestion du stock
- 🔖 Réservation de stock
- 📊 Rapports
- 🔔 Notifications
- 📈 Dashboards par rôle

---

## Rôles

| Rôle | Description |
|---|---|
| Super Admin | Administration globale, utilisateurs, agences, audit |
| Administrateur Local | Gestion de l'agence, demandes, stock |
| Gestion Administrative | Documents, notes de service, contrats |
| Responsable Commercial | Demandes d'achat, réservations, stock disponible |
| Responsable Stock | Entrées, sorties, alertes, inventaire |

Chaque rôle possède son propre Dashboard et ses propres fonctionnalités.

---

## Stack Technique

| Layer | Tech |
|---|---|
| Backend | Laravel 12 / PHP 8.3+ |
| Frontend | React 18 + Inertia.js 2 |
| UI | shadcn/ui + Tailwind CSS v3 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Build | Vite 7 |
| Database | MySQL |

---

## Structure du projet

```
resources/js/
├── Components/     Composants réutilisables par module
├── Layouts/        DashboardLayout, AuthLayout
├── Pages/          Pages (une par route)
├── Mocks/          Données simulées par module
├── Hooks/          Hooks custom par module
├── Data/           Configuration navigation
└── lib/            Utilitaires (cn, mockAuth)
```

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/anas/supdata-erp.git
cd supdata-erp

# Installer les dépendances
composer install
npm install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Lancer le développement
npm run dev
php artisan serve
```

L'application est accessible sur `http://127.0.0.1:8000`.

---

## Build

```bash
npm run build
```

Le build doit toujours passer sans erreur avant de valider une tâche.

---

## État du projet

| Phase | Statut |
|---|---|
| Frontend | 🔄 En cours de développement |
| Mock Data | ✅ En place |
| Backend / API | ⏳ Phase ultérieure |

> Le Frontend est actuellement développé avec des Mock Data. Le Backend Laravel sera connecté dans une phase suivante.

---

## Captures d'écran

> *À venir*

---

## Auteur

Développé par **Anas** — Développeur Full Stack.

Projet SUPDATA ERP.
