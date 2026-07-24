import { useCallback } from "react";
import { router } from "@inertiajs/react";

export function useLocalAdminNotifications({
    initialNotifications = [],
    initialFilters = {},
    initialPagination = { currentPage: 1, lastPage: 1, total: 0 },
    initialStats = {},
} = {}) {
    const buildParams = useCallback((overrides = {}) => {
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : initialFilters.search;
        const read = overrides.read !== undefined ? overrides.read : initialFilters.read;
        const page = overrides.page !== undefined ? overrides.page : initialPagination.currentPage;

        if (s) params.search = s;
        if (read && read !== "all") params.read = read;
        if (page > 1) params.page = page;

        return params;
    }, [initialFilters, initialPagination]);

    const navigate = useCallback((overrides = {}) => {
        const params = buildParams(overrides);
        router.get(route("al.notifications"), params, {
            preserveState: true,
            replace: true,
        });
    }, [buildParams]);

    const handleSearch = useCallback((value) => {
        navigate({ search: value, page: 1 });
    }, [navigate]);

    const handleReadChange = useCallback((value) => {
        navigate({ read: value, page: 1 });
    }, [navigate]);

    const handlePageChange = useCallback((page) => {
        navigate({ page });
    }, [navigate]);

    const markAsRead = useCallback((id) => {
        router.patch(route("al.notifications.read", id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const markAllAsRead = useCallback(() => {
        router.patch(route("al.notifications.read-all"), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const deleteNotification = useCallback((id) => {
        router.delete(route("al.notifications.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const deleteAllRead = useCallback(() => {
        router.delete(route("al.notifications.destroy-all-read"), {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    }, []);

    const resetFilters = useCallback(() => {
        navigate({ search: "", read: "all", page: 1 });
    }, [navigate]);

    return {
        notifications: initialNotifications,
        search: initialFilters.search || "",
        setSearch: handleSearch,
        readFilter: initialFilters.read || "all",
        setReadFilter: handleReadChange,
        currentPage: initialPagination.currentPage || 1,
        setCurrentPage: handlePageChange,
        totalPages: initialPagination.lastPage || 1,
        filteredCount: initialPagination.total || 0,
        stats: initialStats,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        resetFilters,
    };
}
