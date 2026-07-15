import { useState, useCallback } from "react";
import {
    administrativeUser,
    kpiData,
    documentsEvolutionData,
    conformityData,
    pendingDocuments,
    recentActivities,
    importantNotifications,
    quickActions,
} from "@/Mocks/administrativeDashboard";

export function useAdministrativeDashboard() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    }, []);

    return {
        user: administrativeUser,
        kpiData,
        documentsEvolutionData,
        conformityData,
        pendingDocuments,
        recentActivities,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    };
}
