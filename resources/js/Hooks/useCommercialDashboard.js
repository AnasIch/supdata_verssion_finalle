import { useState, useCallback } from "react";
import {
    commercialUser,
    kpiData,
    demandesEvolutionData,
    recentActivities,
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
        demandesEvolutionData,
        recentActivities,
        quickActions,
        isRefreshing,
        refresh,
    };
}
