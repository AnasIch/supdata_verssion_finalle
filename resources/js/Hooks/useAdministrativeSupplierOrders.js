import { useMemo, useState } from "react";
import { demandes as initialDemandes } from "@/Mocks/demandes";

const REQUESTS_STORAGE_KEY = "supdata_demandes";

const readApprovedRequests = () => {
    if (typeof window === "undefined") return initialDemandes.filter((item) => item.status === "validated");
    try {
        const saved = JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || "null") || initialDemandes;
        return saved.filter((item) => item.status === "validated");
    } catch {
        return initialDemandes.filter((item) => item.status === "validated");
    }
};

export function useAdministrativeSupplierOrders() {
    const [approvedRequests, setApprovedRequests] = useState(readApprovedRequests);
    const [search, setSearch] = useState("");

    const refresh = () => setApprovedRequests(readApprovedRequests());
    const reset = () => {
        localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(initialDemandes));
        setApprovedRequests(initialDemandes.filter((item) => item.status === "validated"));
    };

    const query = search.trim().toLowerCase();
    const filteredRequests = useMemo(() => approvedRequests.filter((item) =>
        Object.values(item).filter(Boolean).join(" ").toLowerCase().includes(query)
    ), [approvedRequests, query]);

    const stats = useMemo(() => ({
        approved: approvedRequests.length,
        casablanca: approvedRequests.filter((item) => item.agency === "Casablanca").length,
        marrakech: approvedRequests.filter((item) => item.agency === "Marrakech").length,
    }), [approvedRequests]);

    return {
        approvals: filteredRequests,
        search,
        setSearch,
        stats,
        refresh,
        reset,
    };
}
