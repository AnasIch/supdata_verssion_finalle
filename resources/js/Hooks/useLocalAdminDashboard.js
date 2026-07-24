import { useState, useCallback } from "react";
import { router } from "@inertiajs/react";

export function useLocalAdminDashboard({
    stats = {},
    evolutionData = [],
    decisionsData = [],
    pendingDemandes = [],
    recentActivity = [],
    importantNotifications = [],
} = {}) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const kpiData = [
        {
            id: "pending",
            label: "Demandes en attente",
            value: String(stats.pendingDemandes ?? 0),
            description: "À traiter",
            trend: "",
            trendUp: true,
            color: "bg-amber-50 text-amber-600",
        },
        {
            id: "validated",
            label: "Validées",
            value: String(stats.approvedDemandes ?? 0),
            description: "Demandes approuvées",
            trend: "",
            trendUp: true,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            id: "rejected",
            label: "Refusées",
            value: String(stats.rejectedDemandes ?? 0),
            description: "Demandes rejetées",
            trend: "",
            trendUp: false,
            color: "bg-red-50 text-red-600",
        },
        {
            id: "total",
            label: "Total demandes",
            value: String(stats.totalDemandes ?? 0),
            description: "Toutes les demandes",
            trend: "",
            trendUp: false,
            color: "bg-blue-50 text-blue-600",
        },
        {
            id: "critical",
            label: "Stock critique",
            value: String(stats.lowStockProducts ?? 0),
            description: "Produits sous le seuil",
            trend: "",
            trendUp: true,
            color: "bg-orange-50 text-orange-600",
        },
        {
            id: "notifications",
            label: "Notifications non lues",
            value: String(stats.unreadNotifications ?? 0),
            description: "À consulter",
            trend: "",
            trendUp: false,
            color: "bg-violet-50 text-violet-600",
        },
    ];

    const quickActions = [
        { label: "Voir les demandes", href: "/demandes", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
        { label: "Consulter le stock", href: "/stock", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
        { label: "Historique", href: "/historique", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
    ];

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        router.reload({
            only: ["stats", "evolutionData", "decisionsData", "pendingDemandes", "recentActivity", "importantNotifications", "unreadNotifications"],
            onFinish: () => setIsRefreshing(false),
        });
    }, []);

    return {
        kpiData,
        evolutionData,
        decisionsData,
        pendingDemandes,
        recentActivity,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    };
}
