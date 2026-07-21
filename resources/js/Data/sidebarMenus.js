import {
    LayoutDashboard,
    Users,
    BarChart3,
    FileText,
    Settings,
    Bell,
    Package,
    ClipboardList,
    FileSignature,
    Warehouse,
    AlertTriangle,
    ArrowUpDown,
    ShoppingCart,
    Bookmark,
} from "lucide-react";

const sidebarMenus = {
    "Super Admin": {
        groups: [
            {
                title: "Principal",
                items: [
                    { title: "Dashboard", href: ".", icon: LayoutDashboard, exact: true },
                ],
            },
            {
                title: "Gestion",
                items: [
                    { title: "Utilisateurs", href: "utilisateurs", icon: Users },
                ],
            },
            {
                title: "Système",
                items: [
                    { title: "Notifications", href: "notifications", icon: Bell },
                    { title: "Audit Logs", href: "audit-logs", icon: FileText },
                ],
            },
        ],
    },

    "Administrateur Local": {
        groups: [
            {
                title: "Principal",
                items: [
                    { title: "Dashboard", href: ".", icon: LayoutDashboard, exact: true },
                ],
            },
            {
                title: "Gestion",
                items: [
                    { title: "Demandes", href: "demandes", icon: ClipboardList },
                    { title: "Stock", href: "stock", icon: Package },
                ],
            },
            {
                title: "Suivi",
                items: [
                    { title: "Rapports", href: "rapports", icon: BarChart3 },
                    { title: "Notifications", href: "notifications", icon: Bell },
                    { title: "Historique", href: "historique", icon: FileText },
                    { title: "Paramètres", href: "parametres", icon: Settings },
                ],
            },
        ],
    },

    "Gestion Administrative": {
        groups: [
            {
                title: "Principal",
                items: [
                    { title: "Dashboard", href: ".", icon: LayoutDashboard, exact: true },
                ],
            },
            {
                title: "Documents",
                items: [
                    { title: "Documents à traiter", href: "documents", icon: FileSignature },
                    { title: "Notes de service", href: "notes-service", icon: ClipboardList },
                    { title: "Contrats", href: "contrats", icon: FileText },
                ],
            },
            {
                title: "Suivi",
                items: [
                    { title: "Rapports financiers", href: "rapports", icon: BarChart3 },
                    { title: "Notifications", href: "notifications", icon: Bell },
                    { title: "Paramètres", href: "parametres", icon: Settings },
                ],
            },
        ],
    },

    "Responsable Commercial": {
        groups: [
            {
                title: "Principal",
                items: [
                    { title: "Dashboard", href: ".", icon: LayoutDashboard, exact: true },
                ],
            },
            {
                title: "Commercial",
                items: [
                    { title: "Demandes d'achat", href: "demandes", icon: ClipboardList },
                    { title: "Stock disponible", href: "stock", icon: Package },
                    { title: "Réservation de stock", href: "reservations", icon: Bookmark },
                ],
            },
            {
                title: "Suivi",
                items: [
                    { title: "Notifications", href: "notifications", icon: Bell },
                ],
            },
        ],
    },

    "Responsable Stock": {
        groups: [
            {
                title: "Principal",
                items: [
                    { title: "Dashboard", href: ".", icon: LayoutDashboard, exact: true },
                ],
            },
            {
                title: "Gestion",
                items: [
                    { title: "Stock", href: "stock", icon: Package, exact: true },
                    { title: "Entrées de stock", href: "stock/entrees", icon: ArrowUpDown },
                    { title: "Sorties de stock", href: "stock/sorties", icon: Package },
                    { title: "Alertes stock", href: "stock/alertes", icon: AlertTriangle },
                    { title: "Inventaire", href: "stock/inventaire", icon: Warehouse },
                ],
            },
            {
                title: "Suivi",
                items: [
                    { title: "Commandes", href: "commandes", icon: ShoppingCart },
                    { title: "Rapports", href: "rapports", icon: BarChart3 },
                    { title: "Notifications", href: "notifications", icon: Bell },
                ],
            },
        ],
    },
};

export default sidebarMenus;
