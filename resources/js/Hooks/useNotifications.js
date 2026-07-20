import { useState, useCallback, useMemo } from "react";
import { router } from "@inertiajs/react";

export function useNotifications({
    initialNotifications = [],
    initialFilters = {},
    initialPagination = { currentPage: 1, lastPage: 1, total: 0 },
} = {}) {
    const [search, setSearch] = useState(initialFilters.search || "");
    const [sourceFilter, setSourceFilter] = useState(initialFilters.source || "all");
    const [typeFilter, setTypeFilter] = useState(initialFilters.type || "all");
    const [readFilter, setReadFilter] = useState(initialFilters.read || "all");
    const [currentPage, setCurrentPage] = useState(initialPagination.currentPage || 1);

    const buildParams = useCallback((overrides = {}) => {
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : search;
        const src = overrides.source !== undefined ? overrides.source : sourceFilter;
        const type = overrides.type !== undefined ? overrides.type : typeFilter;
        const read = overrides.read !== undefined ? overrides.read : readFilter;
        const page = overrides.page !== undefined ? overrides.page : currentPage;

        if (s) params.search = s;
        if (src && src !== "all") params.source = src;
        if (type && type !== "all") params.type = type;
        if (read && read !== "all") params.read = read;
        if (page > 1) params.page = page;

        return params;
    }, [search, sourceFilter, typeFilter, readFilter, currentPage]);

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

    const handleSourceChange = useCallback((value) => {
        setSourceFilter(value);
        navigate({ source: value, page: 1 });
    }, [navigate]);

    const handleTypeChange = useCallback((value) => {
        setTypeFilter(value);
        navigate({ type: value, page: 1 });
    }, [navigate]);

    const handleReadChange = useCallback((value) => {
        setReadFilter(value);
        navigate({ read: value, page: 1 });
    }, [navigate]);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        navigate({ page });
    }, [navigate]);

    const markAsRead = useCallback((id) => {
        router.patch(`/dashboard-super-admin/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const markAllAsRead = useCallback(() => {
        router.patch("/dashboard-super-admin/notifications/read-all", {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const deleteNotification = useCallback((id) => {
        router.delete(`/dashboard-super-admin/notifications/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const deleteAllRead = useCallback(() => {
        router.delete("/dashboard-super-admin/notifications/read", {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const resetFilters = useCallback(() => {
        setSearch("");
        setSourceFilter("all");
        setTypeFilter("all");
        setReadFilter("all");
        setCurrentPage(1);
        navigate({ search: "", source: "all", type: "all", read: "all", page: 1 });
    }, [navigate]);

    const hasFilters = search || sourceFilter !== "all" || typeFilter !== "all" || readFilter !== "all";

    return {
        notifications: initialNotifications,
        search,
        setSearch: handleSearch,
        sourceFilter,
        setSourceFilter: handleSourceChange,
        typeFilter,
        setTypeFilter: handleTypeChange,
        readFilter,
        setReadFilter: handleReadChange,
        currentPage,
        setCurrentPage: handlePageChange,
        totalPages: initialPagination.lastPage,
        filteredCount: initialPagination.total,
        hasFilters,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        resetFilters,
    };
}
