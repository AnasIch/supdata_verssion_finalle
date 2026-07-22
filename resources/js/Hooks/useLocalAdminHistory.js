import { useCallback } from "react";
import { router } from "@inertiajs/react";

export function useLocalAdminHistory({
    initialLogs = [],
    initialFilters = {},
    initialPagination = { currentPage: 1, lastPage: 1, total: 0 },
    initialStats = {},
    initialActions = [],
} = {}) {
    const buildParams = useCallback((overrides = {}) => {
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : initialFilters.search;
        const action = overrides.action !== undefined ? overrides.action : initialFilters.action;
        const period = overrides.period !== undefined ? overrides.period : initialFilters.period;
        const page = overrides.page !== undefined ? overrides.page : initialPagination.currentPage;

        if (s) params.search = s;
        if (action && action !== "all") params.action = action;
        if (period && period !== "all") params.period = period;
        if (page > 1) params.page = page;

        return params;
    }, [initialFilters, initialPagination]);

    const navigate = useCallback((overrides = {}) => {
        const params = buildParams(overrides);
        router.get(route("al.history"), params, {
            preserveState: true,
            replace: true,
        });
    }, [buildParams]);

    const handleSearch = useCallback((value) => {
        navigate({ search: value, page: 1 });
    }, [navigate]);

    const handleActionChange = useCallback((value) => {
        navigate({ action: value, page: 1 });
    }, [navigate]);

    const handlePeriodChange = useCallback((value) => {
        navigate({ period: value, page: 1 });
    }, [navigate]);

    const handlePageChange = useCallback((page) => {
        navigate({ page });
    }, [navigate]);

    const resetFilters = useCallback(() => {
        navigate({ search: "", action: "all", period: "all", page: 1 });
    }, [navigate]);

    return {
        logs: initialLogs,
        search: initialFilters.search || "",
        setSearch: handleSearch,
        actionFilter: initialFilters.action || "all",
        setActionFilter: handleActionChange,
        periodFilter: initialFilters.period || "all",
        setPeriodFilter: handlePeriodChange,
        actions: initialActions,
        currentPage: initialPagination.currentPage || 1,
        setCurrentPage: handlePageChange,
        totalPages: initialPagination.lastPage || 1,
        filteredCount: initialPagination.total || 0,
        stats: initialStats,
        resetFilters,
    };
}
