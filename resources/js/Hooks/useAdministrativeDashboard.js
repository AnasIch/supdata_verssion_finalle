import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { administrativeUser } from "@/Mocks/administrativeDashboard";

export function useAdministrativeDashboard(initial = {}) {
    const [agency, setAgency] = useState("Toutes");
    const [query, setQuery] = useState("");
    const requests = useMemo(() => (initial.requests || []).filter((item) =>
        (agency === "Toutes" || item.agency === agency || item.agency?.includes(agency))
        && Object.values(item).filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase())
    ), [agency, initial.requests, query]);

    const updateRequest = (id, status, reason = "") => {
        if (status === "Rejetée" && reason.trim().length < 5) return { ok: false, message: "Ajoutez un motif de rejet précis." };
        router.post(`/dashboard-administrative/demandes/${id}/decision`, {
            decision: status === "Validée" ? "approved" : "rejected", reason,
        }, { preserveScroll: true });
        return { ok: true };
    };

    return {
        user: administrativeUser, stats: initial.stats || [], requests,
        flow: initial.flow || [], trend: initial.trend || [],
        approvedRequests: initial.approvedRequests || [], notifications: initial.notifications || [],
        agency, setAgency, query, setQuery, updateRequest,
        resetDashboard: () => router.reload(),
    };
}
