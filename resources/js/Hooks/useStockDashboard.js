import { useState, useCallback } from "react";
import {
    stockUser,
    kpiData,
    stockEvolutionData,
    categoryData,
    lowStockAlerts,
    recentMovements,
    importantNotifications,
    quickActions,
} from "@/Mocks/stockDashboard";

export function useStockDashboard() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    }, []);

    return {
        user: stockUser,
        kpiData,
        stockEvolutionData,
        categoryData,
        lowStockAlerts,
        recentMovements,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    };
}
