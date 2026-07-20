import { useState, useCallback } from "react";
import { router, usePage } from "@inertiajs/react";

export function useAuditLogs() {
    const page = usePage();
    const p = page.props || {};

    const initialLogs = p.logs || [];
    const initialFilters = p.filters || {};
    const initialPagination = p.pagination || {};
    const initialStats = p.stats || {};
    const initialModules = p.modules || [];
    const initialActions = p.actions || [];

    const [search, setSearch] = useState(String(initialFilters.search || ""));
    const [moduleFilter, setModuleFilter] = useState(String(initialFilters.module || "Tous"));
    const [actionFilter, setActionFilter] = useState(String(initialFilters.action || "Toutes"));
    const [period, setPeriod] = useState(String(initialFilters.period || "30days"));
    const [sortOrder, setSortOrder] = useState(String(initialFilters.sort || "desc"));
    const [currentPage, setCurrentPage] = useState(Number(initialPagination.currentPage) || 1);

    const buildParams = useCallback((overrides = {}) => {
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : search;
        const mod = overrides.module !== undefined ? overrides.module : moduleFilter;
        const act = overrides.action !== undefined ? overrides.action : actionFilter;
        const p = overrides.period !== undefined ? overrides.period : period;
        const sort = overrides.sort !== undefined ? overrides.sort : sortOrder;
        const pg = overrides.page !== undefined ? overrides.page : currentPage;

        if (s) params.search = s;
        if (mod && mod !== "Tous") params.module = mod;
        if (act && act !== "Toutes") params.action = act;
        if (p) params.period = p;
        if (sort) params.sort = sort;
        if (pg > 1) params.page = pg;

        return params;
    }, [search, moduleFilter, actionFilter, period, sortOrder, currentPage]);

    const navigate = useCallback((overrides = {}) => {
        const params = buildParams(overrides);
        router.get(window.location.pathname, params, {
            preserveState: true,
            replace: true,
        });
    }, [buildParams]);

    const handleSearch = useCallback((value) => {
        setSearch(value);
        navigate({ search: value, page: 1 });
    }, [navigate]);

    const handleModuleFilter = useCallback((value) => {
        setModuleFilter(value);
        navigate({ module: value, page: 1 });
    }, [navigate]);

    const handleActionFilter = useCallback((value) => {
        setActionFilter(value);
        navigate({ action: value, page: 1 });
    }, [navigate]);

    const handlePeriodChange = useCallback((value) => {
        setPeriod(value);
        navigate({ period: value, page: 1 });
    }, [navigate]);

    const handleSortToggle = useCallback(() => {
        const newSort = sortOrder === "desc" ? "asc" : "desc";
        setSortOrder(newSort);
        navigate({ sort: newSort, page: 1 });
    }, [sortOrder, navigate]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        navigate({ page });
    }, [navigate]);

    return {
        logs: initialLogs,
        search,
        setSearch: handleSearch,
        moduleFilter,
        setModuleFilter: handleModuleFilter,
        actionFilter,
        setActionFilter: handleActionFilter,
        period,
        setPeriod: handlePeriodChange,
        sortOrder,
        toggleSort: handleSortToggle,
        currentPage,
        setCurrentPage: handlePageChange,
        pagination: initialPagination,
        stats: initialStats,
        modules: initialModules,
        actions: initialActions,
    };
}
