import { useState, useCallback, useMemo } from "react";
import { initialNotifications as defaultNotifications } from "@/Mocks/notificationsList";

export function useNotifications({ notifications: initialData = defaultNotifications } = {}) {
    const [notifications, setNotifications] = useState(initialData);
    const [search, setSearch] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [readFilter, setReadFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const PAGE_SIZE = 10;

    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAsUnread = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: false } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const deleteNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const deleteAllRead = useCallback(() => {
        setNotifications((prev) => prev.filter((n) => !n.read));
    }, []);

    const filtered = useMemo(() => {
        let result = [...notifications];

        if (sourceFilter !== "all") {
            result = result.filter((n) => n.source === sourceFilter);
        }
        if (typeFilter !== "all") {
            result = result.filter((n) => n.type === typeFilter);
        }
        if (readFilter === "read") {
            result = result.filter((n) => n.read);
        } else if (readFilter === "unread") {
            result = result.filter((n) => !n.read);
        }
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (n) =>
                    n.title.toLowerCase().includes(q) ||
                    n.description.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => b.id - a.id);
        return result;
    }, [notifications, sourceFilter, typeFilter, readFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const totalCount = notifications.length;

    const stats = useMemo(() => ({
        total: notifications.length,
        unread: notifications.filter((n) => !n.read).length,
        info: notifications.filter((n) => n.type === "info").length,
        success: notifications.filter((n) => n.type === "success").length,
        warning: notifications.filter((n) => n.type === "warning").length,
        error: notifications.filter((n) => n.type === "error").length,
    }), [notifications]);

    return {
        notifications: paged,
        allNotifications: notifications,
        search,
        setSearch,
        sourceFilter,
        setSourceFilter,
        typeFilter,
        setTypeFilter,
        readFilter,
        setReadFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        filteredCount: filtered.length,
        unreadCount,
        totalCount,
        stats,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        resetFilters: () => {
            setSearch("");
            setSourceFilter("all");
            setTypeFilter("all");
            setReadFilter("all");
            setCurrentPage(1);
        },
    };
}
