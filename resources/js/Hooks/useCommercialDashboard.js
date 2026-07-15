import { useState, useCallback } from "react";
import {
    commercialUser,
    kpiData,
    revenueEvolutionData,
    performanceData,
    pendingQuotes,
    recentActivities,
    importantNotifications,
    quickActions,
} from "@/Mocks/commercialDashboard";

export function useCommercialDashboard() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    }, []);

    return {
        user: commercialUser,
        kpiData,
        revenueEvolutionData,
        performanceData,
        pendingQuotes,
        recentActivities,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    };
}
