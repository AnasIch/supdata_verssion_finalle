import { useState, useCallback, useMemo } from "react";
import {
    initialNotifications as defaultNotifications,
    categoryOptions,
} from "@/Mocks/localAdminNotifications";

export function useLocalAdminNotifications() {
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const PAGE_SIZE = 8;

    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const deleteNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const filtered = useMemo(() => {
        let result = [...notifications];

        if (categoryFilter === "unread") {
            result = result.filter((n) => !n.read);
        } else if (categoryFilter === "read") {
            result = result.filter((n) => n.read);
        } else if (categoryFilter === "alertes") {
            result = result.filter((n) => n.type === "warning" || n.type === "error");
        } else if (categoryFilter === "demandes") {
            result = result.filter((n) => n.category === "demandes");
        } else if (categoryFilter === "stock") {
            result = result.filter((n) => n.category === "stock");
        } else if (categoryFilter === "system") {
            result = result.filter((n) => n.category === "system");
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
    }, [notifications, categoryFilter, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const todayCount = useMemo(() => {
        const today = new Date().toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        return notifications.filter((n) => n.timestamp.startsWith(today.replace(/\//g, "/"))).length;
    }, [notifications]);

    const thisWeekCount = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return notifications.filter((n) => {
            const parts = n.timestamp.split(" ")[0].split("/");
            if (parts.length < 3) return false;
            const d = new Date(parts[2], parts[1] - 1, parts[0]);
            return d >= weekAgo;
        }).length;
    }, [notifications]);

    const criticalCount = useMemo(
        () => notifications.filter((n) => n.type === "warning" || n.type === "error").length,
        [notifications]
    );

    const stats = useMemo(
        () => ({
            total: notifications.length,
            unread: unreadCount,
            today: todayCount,
            thisWeek: thisWeekCount,
            critical: criticalCount,
        }),
        [notifications, unreadCount, todayCount, thisWeekCount, criticalCount]
    );

    return {
        notifications: paged,
        search,
        setSearch,
        categoryFilter,
        setCategoryFilter,
        categoryOptions,
        currentPage,
        setCurrentPage,
        totalPages,
        filteredCount: filtered.length,
        unreadCount,
        stats,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        resetFilters: () => {
            setSearch("");
            setCategoryFilter("all");
            setCurrentPage(1);
        },
    };
}
