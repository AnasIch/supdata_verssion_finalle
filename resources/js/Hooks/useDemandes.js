import { useState, useCallback } from "react";
import { demandes as initialDemandes, demandeStats } from "@/Mocks/demandes";

const STORAGE_KEY = "supdata_demandes";

const readDemandes = () => {
    if (typeof window === "undefined") return initialDemandes;
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || initialDemandes;
    } catch {
        return initialDemandes;
    }
};

export function useDemandes() {
    const [demandes, setDemandes] = useState(readDemandes);
    const [filters, setFilters] = useState({
        search: "",
        type: "all",
        priority: "all",
        status: "all",
    });

    const updateFilter = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ search: "", type: "all", priority: "all", status: "all" });
    }, []);

    const filtered = demandes.filter((d) => {
        if (filters.search) {
            const q = filters.search.toLowerCase();
            if (
                !d.id.toLowerCase().includes(q) &&
                !d.title.toLowerCase().includes(q) &&
                !d.requester.toLowerCase().includes(q)
            )
                return false;
        }
        if (filters.type !== "all" && d.type !== filters.type) return false;
        if (filters.priority !== "all" && d.priority !== filters.priority) return false;
        if (filters.status !== "all" && d.status !== filters.status) return false;
        return true;
    });

    const handleValidate = useCallback((demandeId) => {
        setDemandes((prev) => {
            const next = prev.map((d) =>
                d.id === demandeId
                    ? { ...d, status: "validated", validator: "Youssef Benali", validatedAt: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) + " — " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }
                    : d
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const handleRefuse = useCallback((demandeId, reason) => {
        setDemandes((prev) => {
            const next = prev.map((d) =>
                d.id === demandeId
                    ? { ...d, status: "rejected", validator: "Youssef Benali", rejectReason: reason }
                    : d
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return {
        demandes: filtered,
        stats: {
            total: demandes.length,
            pending: demandes.filter((d) => d.status === "submitted").length,
            validated: demandes.filter((d) => d.status === "validated").length,
            rejected: demandes.filter((d) => d.status === "rejected").length,
            cancelled: demandes.filter((d) => d.status === "cancelled").length,
        },
        filters,
        updateFilter,
        resetFilters,
        handleValidate,
        handleRefuse,
    };
}
