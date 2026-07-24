# README — Collaborateur

## État actuel du projet

Le projet est en **phase Backend + Frontend**. Le Dashboard **Responsable Commercial** est **entièrement terminé** (Backend + Frontend). Les autres Dashboards sont en **Frontend uniquement** (Mock Data).

---

## Dashboards — Statut détaillé

### Terminés (Backend + Frontend)

| Dashboard | Routes | Controller | Service | Frontend | Notifications |
|---|---|---|---|---|---|
| **Super Admin** | Auth group | UserController, DashboardController, AuditLogController | — | Complet | Système (generic) |
| **Responsable Commercial** | Auth group | DemandeController, ReservationController, CommercialStockController, NotificationController | DemandeService, ReservationService, NotificationService, StockService, AuditLogService | Complet | **Email SMTP + DB** |

### En attente (Mock Data uniquement)

| Dashboard | Statut | Ce qui reste |
|---|---|---|
| **Administrateur Local** | Frontend Mock | Créer Backend complet |
| **Gestion Administrative** | Frontend Mock | Créer Backend complet |
| **Responsable Stock** | Frontend Mock | Créer Backend complet |

---

## Fonctionnalités du Responsable Commercial

Chaque fonctionnalité est **connectée au backend** avec de vraies données MySQL.

### Demandes d'achat

| Fonctionnalité | Statut | Détails |
|---|---|---|
| Liste paginée | Terminé | Filtres search/status/priority, pagination Laravel |
| Création | Terminé | Validation `DemandeFormRequest`, DB transaction |
| Détail | Terminé | Produits liés, statut, priorité |
| Archivage | Terminé | SoftDeletes, notification auto |
| Notification créateur | Terminé | Reçoit "Demande créée" quand il soumet |
| Notification Gestion Admin | Terminé | Email + notification DB pour les GA |
| Audit log | Terminé | Chaque action est logguée |

### Stock disponible

| Fonctionnalité | Statut | Détails |
|---|---|---|
| Liste paginée | Terminé | Filtres search/category/agency/disponibilite |
| Stats | Terminé | Total, disponible, stock faible, rupture |
| Affichage réservé | Terminé | Colonne `reserved_quantity` calculée |

### Réservations de stock

| Fonctionnalité | Statut | Détails |
|---|---|---|
| Liste paginée | Terminé | Filtres search/status, pagination Laravel |
| Création | Terminé | Check stock, DB transaction, increment reserved_quantity |
| Modification | Terminé | Ajuste reserved_quantity (delta), check stock |
| Suppression | Terminé | Libère reserved_quantity |
| Notification créateur | Terminé | "Réservation créée/modifiée/supprimée" |
| Notification RS | Terminé | Email détaillé + notification DB pour le Responsable Stock |
| Audit log | Terminé | Chaque action est logguée |

### Notifications

| Fonctionnalité | Statut | Détails |
|---|---|---|
| Liste paginée | Terminé | Vraies données Laravel `notifications` table |
| Stats | Terminé | Total, non lues, aujourd'hui, cette semaine |
| Filtres | Terminé | Toutes / Non lues / Lues + Recherche |
| Marquer comme lue | Terminé | PATCH → read_at |
| Tout marquer comme lu | Terminé | PATCH bulk |
| Suppression | Terminé | DELETE single |
| Badge sidebar | Terminé | `unreadCount` partagé via Inertia middleware |
| Email SMTP | Terminé | Notifications email via Gmail SMTP (SystemNotification) |

---

## Routes du Responsable Commercial

Toutes les routes sont dans le group `auth` middleware.

```php
// Dashboard
GET  /dashboard-commercial                  → commercial.dashboard

// Demandes d'achat
GET  /dashboard-commercial/demandes         → rc.demandes
GET  /dashboard-commercial/demandes/creer   → rc.demandes.create
POST /dashboard-commercial/demandes         → rc.demandes.store
GET  /dashboard-commercial/demandes/{id}    → rc.demandes.show
POST /dashboard-commercial/demandes/{id}/archiver → rc.demandes.archive

// Stock
GET  /dashboard-commercial/stock            → rc.stock

// Réservations
GET    /dashboard-commercial/reservations              → rc.reservations
POST   /dashboard-commercial/reservations              → rc.reservations.store
PUT    /dashboard-commercial/reservations/{id}         → rc.reservations.update
DELETE /dashboard-commercial/reservations/{id}         → rc.reservations.destroy

// Notifications
GET    /dashboard-commercial/notifications             → rc.notifications
PATCH  /dashboard-commercial/notifications/read-all    → rc.notifications.read-all
PATCH  /dashboard-commercial/notifications/{id}/read   → rc.notifications.read
DELETE /dashboard-commercial/notifications/{id}        → rc.notifications.destroy
DELETE /dashboard-commercial/notifications/read        → rc.notifications.destroy-all-read
```

---

## Architecture Backend

### Services clés

| Service | Fichier | Rôle |
|---|---|---|
| `DemandeService` | `app/Services/DemandeService.php` | CRUD demandes + notifications + audit |
| `ReservationService` | `app/Services/ReservationService.php` | CRUD réservations + check stock + notifications email |
| `NotificationService` | `app/Services/NotificationService.php` | CRUD notifications + pagination + stats |
| `StockService` | `app/Services/StockService.php` | Consultation stock + filtres |
| `AuditLogService` | `app/Services/AuditLogService.php` | Logs d'audit |

### Modèles clés

| Model | Table | Relations |
|---|---|---|
| `Demande` | `demandes` | SoftDeletes, user(), agency() |
| `Reservation` | `reservations` | user(), product(), agency() |
| `Product` | `products` | agency(), `reserved_quantity` |
| `Notification` | `notifications` | Laravel default, `data` JSON |
| `User` | `users` | Notifiable, role(), agency() |

### Notifications

Le système utilise `SystemNotification` (Laravel Notification) avec deux channels :
- **database** : stocké dans la table `notifications`
- **mail** : envoyé via SMTP Gmail

Les emails contiennent les détails complets (référence, client, produit, quantité, agence, stock restant).

### Mails

| Mailable | Destinataire | Quand |
|---|---|---|
| `SystemNotification` (mail channel) | Responsable Stock | Réservation créée |
| `NouvelleDemandeMail` | Gestion Administrative | Demande créée |

---

## Ce qui reste à faire

### Dashboard Gestion Administrative

- [ ] Dashboard page (stats, graphiques)
- [ ] Module Documents (CRUD)
- [ ] Module Notes de service
- [ ] Module Contrats
- [ ] Backend complet (Controller, Service, Model, Migration, Seeder)
- [ ] Notifications
- [ ] Routes dans auth group

### Dashboard Responsable Stock

- [ ] Dashboard page (stats, graphiques)
- [ ] Module Entrées de stock
- [ ] Module Sorties de stock
- [ ] Module Inventaire
- [ ] Module Alertes stock
- [ ] Backend complet (Controller, Service, Model, Migration, Seeder)
- [ ] Notifications
- [ ] Routes dans auth group

### Améliorations transversales

- [ ] Dark mode (configuré mais pas activé)
- [ ] NotificationDropdown dynamique par rôle (le badge fonctionne, les actions aussi)
- [ ] Tests unitaires
- [ ] Seeders pour les données de démonstration

---

## Règles importantes

1. **Ne jamais casser un Dashboard terminé.** Super Admin et Responsable Commercial sont opérationnels.
2. **Respecter l'architecture existante.** Chaque Dashboard a ses propres Components, Services, Models.
3. **Toujours exécuter `npm run build`** avant de valider.
4. **Ne jamais partager de composants métier** entre les rôles. Seuls les composants UI (`Components/UI/`, `Layout/`, `Charts/`) sont partagés.
5. **Respecter `AGENTS.md`** — source de vérité pour le projet.
6. **Les routes doivent être dans le group `auth`** pour accéder à `$request->user()`.
7. **Utiliser `catch (\Throwable)`** au lieu de `catch (\Exception)` pour les erreurs PHP.

---

## Commandes utiles

```bash
npm run build          # Build production
npm run dev            # Dev server
php artisan serve      # Laravel server
php artisan route:list --name=rc  # Vérifier les routes RC
php artisan migrate    # Appliquer les migrations
php artisan db:seed    # Seed la base
```

---

## Base de données

Tables principales :
- `users` — Utilisateurs (role_id, agency_id, status)
- `roles` — Rôles (Super Admin, Admin Local, GA, RC, RS)
- `agences` — Agences (2 : Casablanca, Marrakech)
- `products` — Produits (13, avec reserved_quantity)
- `demandes` — Demandes d'achat (SoftDeletes)
- `reservations` — Réservations de stock
- `notifications` — Notifications Laravel
- `audit_logs` — Logs d'audit

---

Dernière mise à jour : Juillet 2026
