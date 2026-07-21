import {
    LayoutDashboard,
    Users,
    Shield,
    Building2,
    BarChart3,
    FileText,
    Settings,
    Bell,
    Package,
    ClipboardList,
    FileSignature,
    TrendingUp,
    Warehouse,
    AlertTriangle,
    ArrowUpDown,
    ShoppingCart,
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
                    { title: "Rôles & Permissions", href: "roles-permissions", icon: Shield },
                    { title: "Agences", href: "agences", icon: Building2 },
                ],
            },
            {
                title: "Système",
                items: [
                    { title: "Rapports & Analytics", href: "rapports", icon: BarChart3 },
                    { title: "Notifications", href: "notifications", icon: Bell },
                    { title: "Audit Logs", href: "audit-logs", icon: FileText },
                    { title: "Paramètres", href: "parametres", icon: Settings },
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
                    { title: "Devis", href: "devis", icon: FileSignature },
                    { title: "Clients", href: "clients", icon: Users },
                    { title: "Pipeline", href: "pipeline", icon: TrendingUp },
                ],
            },
            {
                title: "Suivi",
                items: [
                    { title: "Rapports commerciaux", href: "rapports", icon: BarChart3 },
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
                    { title: "Inventaires", href: "inventaires", icon: Warehouse },
                    { title: "Livraisons", href: "livraisons", icon: ShoppingCart },
                    { title: "Alertes de stock", href: "alertes", icon: AlertTriangle },
                ],
            },
        ],
    },
};

export default sidebarMenus;
