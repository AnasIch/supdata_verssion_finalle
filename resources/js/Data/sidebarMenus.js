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

    AlertTriangle,
    ArrowUpDown,
    ShoppingCart,
    Bookmark,
    Shield,
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
                    { title: "Notifications", href: "notifications", icon: Bell },
                    { title: "Historique", href: "historique", icon: FileText },
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
                title: "Traitement",
                items: [
                    { title: "Demandes reçues", href: "demandes", icon: ClipboardList },
                    { title: "Consulter le stock", href: "stock", icon: Package },
                    { title: "Suivi des validations", href: "validations", icon: Shield },
                    { title: "Demandes acceptées", href: "demandes-acceptees", icon: ShoppingCart },
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
                    { title: "Produits", href: "produits", icon: Package },
                    { title: "Catégories", href: "categories", icon: FileText },
                    { title: "Mouvements", href: "mouvements", icon: ArrowUpDown },
                    { title: "Réceptions", href: "receptions", icon: ClipboardList },
                    { title: "Livraisons", href: "livraisons", icon: ShoppingCart },
                    { title: "Alertes de stock", href: "alertes", icon: AlertTriangle },
                    { title: "Notifications", href: "notifications", icon: Bell },
                ],
            },
        ],
    },
};

export default sidebarMenus;
