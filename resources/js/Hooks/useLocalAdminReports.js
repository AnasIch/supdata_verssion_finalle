import { useState, useCallback } from "react";
import {
    localAdminReportKpis,
    demandesEvolution,
    decisionsBreakdown,
    stockByCategory,
    stockStatusBreakdown,
    periodOptions,
} from "@/Mocks/localAdminReports";

export function useLocalAdminReports() {
    const [period, setPeriod] = useState("year");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    }, []);

    return {
        kpis: localAdminReportKpis,
        demandesEvolution,
        decisionsBreakdown,
        stockByCategory,
        stockStatusBreakdown,
        periodOptions,
        period,
        setPeriod,
        isRefreshing,
        refresh,
    };
}
