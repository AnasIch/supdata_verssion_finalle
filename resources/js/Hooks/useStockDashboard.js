import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { stockUser } from "@/Mocks/stockDashboard";

export function useStockDashboard(initial = {}) {
    const [agency, setAgency] = useState("Toutes");
    const filterAgency = (items = []) => items.filter((item) =>
        agency === "Toutes" || item.agency === agency || item.agency?.includes(agency)
    );

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
        user: stockUser,
        stats: initial.stats || [],
        health: initial.health || [],
        trend: initial.trend || [],
        alerts: useMemo(() => filterAgency(initial.alerts), [agency, initial.alerts]),
        receptions: useMemo(() => filterAgency(initial.receptions), [agency, initial.receptions]),
        inventories: initial.inventories || [],
        activity: initial.activity || [],
        products: initial.products || [],
        agencies: initial.agencies || [],
        agency, setAgency, addMovement, resolveAlert, validateReception,
        resetDashboard: () => router.reload(),
    };
}
