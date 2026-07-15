import { useState, useCallback } from "react";
import {
    localAdminUser,
    kpiData,
    demandesEvolutionData,
    decisionsData,
    pendingRequests,
    recentActivities,
    importantNotifications,
    quickActions,
} from "@/Mocks/localAdminDashboard";

export function useLocalAdminDashboard() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    }, []);

    return {
        user: localAdminUser,
        kpiData,
        demandesEvolutionData,
        decisionsData,
        pendingRequests,
        recentActivities,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    };
}
