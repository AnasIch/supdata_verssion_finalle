import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export function useStockDashboard(initial = {}) {
    const { url } = usePage();
    const basePath = url.split("?")[0];
    const initialAgency = new URLSearchParams(url.split("?")[1] || "").get("agency") || "Toutes";
    const [agency, setAgency] = useState(initialAgency);

    const handleAgencyChange = (value) => {
        setAgency(value);
        router.reload({
            data: { agency: value },
            only: ["dashboardData"],
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const addMovement = (movement) => router.post("/dashboard-stock/mouvement", movement, { preserveScroll: true });
    const resolveAlert = (id) => {
        router.patch(`/dashboard-stock/alertes/${id}/traiter`, {}, { preserveScroll: true });
        return { ok: true };
    };
    const validateReception = (id) => {
        router.patch(`/dashboard-stock/receptions/${id}/valider`, {}, { preserveScroll: true });
        return { ok: true };
    };

    return {
        user: initial.user || null,
        stats: initial.stats || [],
        health: initial.health || [],
        trend: initial.trend || [],
        alerts: initial.alerts || [],
        receptions: initial.receptions || [],
        inventories: initial.inventories || [],
        activity: initial.activity || [],
        products: initial.products || [],
        agencies: initial.agencies || [],
        agency, setAgency: handleAgencyChange, addMovement, resolveAlert, validateReception,
        resetDashboard: () => router.get(basePath, {}, { preserveScroll: true }),
    };
}
