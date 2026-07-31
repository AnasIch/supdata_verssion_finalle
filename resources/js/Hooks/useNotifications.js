import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

const DEBOUNCE_MS = 300;
const PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function useNotifications({
    initialNotifications = [],
    initialFilters = {},
    initialPagination = { currentPage: 1, lastPage: 1, total: 0, perPage: 10 },
} = {}) {
    const { url } = usePage();
    const query = new URLSearchParams(url.split("?")[1] || "");
    const rawPerPage = parseInt(query.get("perPage") || initialPagination.perPage || "10", 10);

    const [search, setSearch] = useState(query.get("search") ?? (initialFilters.search || ""));
    const [sourceFilter, setSourceFilter] = useState(query.get("source") ?? (initialFilters.source || "all"));
    const [typeFilter, setTypeFilter] = useState(query.get("type") ?? (initialFilters.type || "all"));
    const [readFilter, setReadFilter] = useState(query.get("read") ?? (initialFilters.read || "all"));
    const [currentPage, setCurrentPage] = useState(Math.max(1, parseInt(query.get("page") || initialPagination.currentPage || "1", 10) || 1));
    const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS.includes(rawPerPage) ? rawPerPage : 10);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const buildParams = useCallback((overrides = {}) => {
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : search;
        const src = overrides.source !== undefined ? overrides.source : sourceFilter;
        const type = overrides.type !== undefined ? overrides.type : typeFilter;
        const read = overrides.read !== undefined ? overrides.read : readFilter;
        const page = overrides.page !== undefined ? overrides.page : currentPage;
        const pp = overrides.perPage !== undefined ? overrides.perPage : perPage;

        if (s) params.search = s;
        if (src && src !== "all") params.source = src;
        if (type && type !== "all") params.type = type;
        if (read && read !== "all") params.read = read;
        if (page > 1) params.page = page;
        if (pp && pp !== 10) params.perPage = pp;

        return params;
    }, [search, sourceFilter, typeFilter, readFilter, currentPage, perPage]);

    const navigate = useCallback((overrides = {}) => {
        const params = buildParams(overrides);
        router.get(window.location.pathname, params, {
            preserveState: true,
            replace: true,
        });
    }, [buildParams]);

    const handleSearch = useCallback((value) => {
        setSearch(value);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => navigate({ search: value, page: 1 }), DEBOUNCE_MS);
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

    const handlePerPageChange = useCallback((value) => {
        setPerPage(value);
        setCurrentPage(1);
        navigate({ perPage: value, page: 1 });
    }, [navigate]);

    const getBasePath = useCallback(() => {
        return window.location.pathname.match(
            /^\/dashboard-(super-admin|admin-local|administrative|commercial|stock)/
        )?.[0] || "/dashboard-super-admin";
    }, []);

    const markAsRead = useCallback((id) => {
        const base = getBasePath();
        router.patch(`${base}/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, [getBasePath]);

    const markAllAsRead = useCallback(() => {
        const base = getBasePath();
        router.patch(`${base}/notifications/read-all`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, [getBasePath]);

    const deleteNotification = useCallback((id) => {
        const base = getBasePath();
        router.delete(`${base}/notifications/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, [getBasePath]);

    const deleteAllRead = useCallback(() => {
        const base = getBasePath();
        router.delete(`${base}/notifications/read`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, [getBasePath]);

    const resetFilters = useCallback(() => {
        setSearch("");
        setSourceFilter("all");
        setTypeFilter("all");
        setReadFilter("all");
        setCurrentPage(1);
        setPerPage(10);
        navigate({ search: "", source: "all", type: "all", read: "all", page: 1, perPage: 10 });
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
        perPage,
        setPerPage: handlePerPageChange,
        hasFilters,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        resetFilters,
    };
}
