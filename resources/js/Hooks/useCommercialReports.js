import { useState, useCallback } from "react";
import {
    commercialReportKpis,
    demandesEvolution,
    reservationsByMonth,
    demandesByAgency,
    topProducts,
    recentCommercialActivities,
    periodOptions,
} from "@/Mocks/commercialReports";

export function useCommercialReports() {
    const [period, setPeriod] = useState("quarter");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = useCallback(() => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    }, []);

    return {
        kpis: commercialReportKpis,
        demandesEvolution,
        reservationsByMonth,
        demandesByAgency,
        topProducts,
        recentActivities: recentCommercialActivities,
        periodOptions,
        period,
        setPeriod,
        isRefreshing,
        refresh,
    };
}
