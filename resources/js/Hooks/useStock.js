import { useState, useCallback, useMemo } from "react";
import { stockProducts } from "@/Mocks/stock";

export function useStock() {
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        agency: "all",
        status: "all",
    });

    const updateFilter = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({ search: "", category: "all", agency: "all", status: "all" });
    }, []);

    const products = useMemo(() => {
        return stockProducts.filter((p) => {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (
                    !p.reference.toLowerCase().includes(q) &&
                    !p.name.toLowerCase().includes(q) &&
                    !p.id.toLowerCase().includes(q)
                )
                    return false;
            }
            if (filters.category !== "all" && p.category !== filters.category) return false;
            if (filters.agency !== "all" && p.agency !== filters.agency) return false;
            if (filters.status !== "all" && p.status !== filters.status) return false;
            return true;
        });
    }, [filters]);

    const stats = useMemo(() => ({
        total: stockProducts.length,
        critical: stockProducts.filter((p) => p.status === "low").length,
        outOfStock: stockProducts.filter((p) => p.status === "out_of_stock").length,
        totalValue: stockProducts.reduce((acc, p) => {
            const price = parseFloat(p.unitPrice.replace(/\s/g, ""));
            return acc + price * p.quantity;
        }, 0),
    }), []);

    return {
        products,
        stats,
        filters,
        updateFilter,
        resetFilters,
    };
}
