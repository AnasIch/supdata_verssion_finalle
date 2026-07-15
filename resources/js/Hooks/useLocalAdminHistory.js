import { useState, useMemo } from "react";
import { localAdminHistory, typeOptions } from "@/Mocks/localAdminHistory";

export function useLocalAdminHistory() {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const stats = useMemo(() => {
        const total = localAdminHistory.length;
        const validations = localAdminHistory.filter(
            (h) => h.action.toLowerCase().includes("validation")
        ).length;
        const refus = localAdminHistory.filter(
            (h) => h.action.toLowerCase().includes("refus")
        ).length;
        const stockConsults = localAdminHistory.filter(
            (h) => h.type === "stock"
        ).length;

        return { total, validations, refus, stockConsults };
    }, []);

    const filtered = useMemo(() => {
        let result = [...localAdminHistory];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (h) =>
                    h.action.toLowerCase().includes(q) ||
                    h.description.toLowerCase().includes(q) ||
                    h.user.toLowerCase().includes(q)
            );
        }

        if (typeFilter !== "all") {
            result = result.filter((h) => h.type === typeFilter);
        }

        return result;
    }, [search, typeFilter]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return {
        history: paginated,
        allHistory: filtered,
        search,
        setSearch,
        typeFilter,
        setTypeFilter,
        typeOptions,
        currentPage,
        setCurrentPage,
        totalPages,
        filteredCount: filtered.length,
        stats,
    };
}
