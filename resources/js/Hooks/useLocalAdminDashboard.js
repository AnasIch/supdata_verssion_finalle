import { useState, useCallback } from "react";
import { router } from "@inertiajs/react";

export function useLocalAdminDashboard({
    stats = {},
    evolutionData = [],
    decisionsData = [],
    lastDemandes = [],
    unreadNotifications = 0,
} = {}) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const kpiData = [
        {
            id: "pending",
            label: "Demandes à traiter",
            value: String(stats.pendingLocalAdmin ?? 0),
            description: "En attente de décision",
            trend: "",
            trendUp: true,
            color: "bg-amber-50 text-amber-600",
        },
        {
            id: "validated",
            label: "Confirmées",
            value: String(stats.confirmedLocalAdmin ?? 0),
            description: "Transmises au RS",
            trend: "",
            trendUp: true,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            id: "rejected",
            label: "Rejetées",
            value: String(stats.rejectedLocalAdmin ?? 0),
            description: "Avec motif enregistré",
            trend: "",
            trendUp: false,
            color: "bg-red-50 text-red-600",
        },
        {
            id: "total",
            label: "Total traitées",
            value: String(stats.totalProcessed ?? 0),
            description: "Confirmées + Rejetées",
            trend: "",
            trendUp: false,
            color: "bg-blue-50 text-blue-600",
        },
        {
            id: "notifications",
            label: "Notifications non lues",
            value: String(unreadNotifications ?? 0),
            description: "À consulter",
            trend: "",
            trendUp: false,
            color: "bg-violet-50 text-violet-600",
        },
    ];

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        router.reload({
            only: ["stats", "evolutionData", "decisionsData", "lastDemandes", "unreadNotifications"],
            onFinish: () => setIsRefreshing(false),
        });
    }, []);

    return {
        kpiData,
        evolutionData,
        decisionsData,
        lastDemandes,
        isRefreshing,
        refresh,
    };
}
