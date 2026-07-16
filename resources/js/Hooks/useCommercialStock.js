import { useState, useMemo, useEffect } from "react";
import { commercialStockProducts } from "@/Mocks/commercialStock";

let stockListeners = [];

export const stockStore = {
    products: commercialStockProducts.map((p) => ({ ...p })),
    version: 0,
    subscribe(fn) {
        stockListeners.push(fn);
        return () => {
            stockListeners = stockListeners.filter((l) => l !== fn);
        };
    },
    notify() {
        this.version++;
        stockListeners.forEach((fn) => fn());
    },
};

export function useCommercialStock() {
    const [products, setProducts] = useState(() => stockStore.products.map((p) => ({ ...p })));
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        agency: "all",
    });

    useEffect(() => {
        const unsub = stockStore.subscribe(() => {
            setProducts(stockStore.products.map((p) => ({ ...p })));
        });
        return unsub;
    }, []);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({ search: "", category: "all", agency: "all" });
    };

    const filtered = useMemo(() => {
        return products.filter((p) => {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (
                    !p.name.toLowerCase().includes(q) &&
                    !p.reference.toLowerCase().includes(q)
                ) {
                    return false;
                }
            }
            if (filters.category !== "all" && p.category !== filters.category) return false;
            if (filters.agency !== "all" && p.agency !== filters.agency) return false;
            return true;
        });
    }, [products, filters]);

    const stats = useMemo(() => ({
        total: filtered.length,
        available: filtered.filter((p) => p.status === "available").length,
        low: filtered.filter((p) => p.status === "low").length,
        outOfStock: filtered.filter((p) => p.status === "out_of_stock").length,
    }), [filtered]);

    return {
        products: filtered,
        allProducts: products,
        stats,
        filters,
        updateFilter,
        resetFilters,
    };
}
