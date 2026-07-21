import { useMemo, useState } from "react";
import {
    administrativeUser,
    administrativeStats,
    administrativeRequests,
    administrativeFlow,
    administrativeTrend,
    approvedRequests,
    administrativeNotifications,
} from "@/Mocks/administrativeDashboard";

const STORAGE_KEY = "supdata_administrative_dashboard";

const readSavedRequests = () => {
    if (typeof window === "undefined") return null;
    try {
        const requests = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")?.requests || null;
        return requests?.map((item) => item.status === "Validée"
            ? { ...item, status: "Validée et transmise", commercialNotified: true }
            : item);
    } catch {
        return null;
    }
};

export function useAdministrativeDashboard() {
    const [agency, setAgency] = useState("Toutes");
    const [query, setQuery] = useState("");
    const [requestItems, setRequestItems] = useState(readSavedRequests() || administrativeRequests);

    const persist = (requests) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ requests }));

    const updateRequest = (id, status, reason = "") => {
        const request = requestItems.find((item) => item.id === id);
        if (!request) return { ok: false, message: "Demande introuvable." };
        if (status === "Validée" && request.completeness !== 100) {
            return { ok: false, message: "Cette demande est incomplète et ne peut pas être validée." };
        }
        if (status === "Rejetée" && reason.trim().length < 5) {
            return { ok: false, message: "Ajoutez un motif de rejet précis." };
        }

        const finalStatus = status === "Validée" ? "Validée et transmise" : "Rejetée";
        const next = requestItems.map((item) => item.id === id ? {
            ...item,
            status: finalStatus,
            rejectionReason: reason.trim(),
            processedAt: new Date().toLocaleString("fr-FR"),
            commercialNotified: true,
        } : item);

        setRequestItems(next);
        persist(next);
        return { ok: true };
    };

    const resetDashboard = () => {
        setRequestItems(administrativeRequests);
        persist(administrativeRequests);
    };

    const requests = useMemo(() => requestItems.filter((item) =>
        (agency === "Toutes" || item.agency === agency)
        && `${item.id} ${item.requester} ${item.client}`.toLowerCase().includes(query.toLowerCase())
    ), [agency, query, requestItems]);

    return {
        user: administrativeUser,
        stats: administrativeStats,
        requests,
        flow: administrativeFlow,
        trend: administrativeTrend,
        approvedRequests,
        notifications: administrativeNotifications,
        agency,
        setAgency,
        query,
        setQuery,
        updateRequest,
        resetDashboard,
    };
}
