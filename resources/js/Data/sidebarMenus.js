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
                    { title: "Dashboard", href: ".", icon: LayoutDashboard },
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
                    { title: "Dashboard", href: ".", icon: LayoutDashboard },
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
                    { title: "Dashboard", href: ".", icon: LayoutDashboard },
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
                    { title: "Dashboard", href: ".", icon: LayoutDashboard },
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
                    { title: "Dashboard", href: ".", icon: LayoutDashboard },
                ],
            },
            {
                title: "Gestion",
                items: [
                    { title: "Stock", href: "stock", icon: Package },
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
