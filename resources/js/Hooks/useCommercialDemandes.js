import { useState, useMemo } from "react";
import { commercialDemandes } from "@/Mocks/commercialDemandes";

export function useCommercialDemandes() {
    const [demandes, setDemandes] = useState(commercialDemandes);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        priority: "all",
    });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({ search: "", status: "all", priority: "all" });
    };

    const filtered = useMemo(() => {
        return demandes.filter((d) => {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (
                    !d.id.toLowerCase().includes(q) &&
                    !d.product.toLowerCase().includes(q)
                ) {
                    return false;
                }
            }
            if (filters.status !== "all" && d.status !== filters.status) return false;
            if (filters.priority !== "all" && d.priority !== filters.priority) return false;
            return true;
        });
    }, [demandes, filters]);

    const stats = useMemo(() => ({
        total: demandes.length,
        pending: demandes.filter((d) => d.status === "pending").length,
        accepted: demandes.filter((d) => d.status === "accepted").length,
        refused: demandes.filter((d) => d.status === "refused").length,
    }), [demandes]);

    return {
        demandes: filtered,
        stats,
        filters,
        updateFilter,
        resetFilters,
    };
}
