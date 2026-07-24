import { useState, useCallback, useMemo } from "react";
import {
    commercialNotifications as initialNotifications,
    commercialNotificationCategories,
} from "@/Mocks/commercialNotifications";

export function useCommercialNotifications() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [readFilter, setReadFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filteredNotifications = useMemo(() => {
        return notifications.filter((n) => {
            if (categoryFilter !== "all" && n.category !== categoryFilter) return false;
            if (readFilter === "unread" && n.read) return false;
            if (readFilter === "read" && !n.read) return false;
            if (search) {
                const q = search.toLowerCase();
                return (
                    n.title.toLowerCase().includes(q) ||
                    n.description.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [notifications, categoryFilter, readFilter, search]);

    const stats = useMemo(() => {
        const now = new Date();
        const todayStr = now.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return {
            total: notifications.length,
            unread: notifications.filter((n) => !n.read).length,
            today: notifications.filter((n) => n.date === todayStr || n.date === "16 juil. 2026").length,
            thisWeek: notifications.filter((n) => {
                const parts = n.date.split(" ");
                const d = new Date(`${parts[0]} ${parts[1]} ${parts[2]}`);
                return d >= weekAgo;
            }).length,
        };
    }, [notifications]);

    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const resetFilters = useCallback(() => {
        setCategoryFilter("all");
        setReadFilter("all");
        setSearch("");
    }, []);

    const hasFilters = categoryFilter !== "all" || readFilter !== "all" || search !== "";

    return {
        notifications: filteredNotifications,
        allNotifications: notifications,
        stats,
        categoryFilter,
        setCategoryFilter,
        readFilter,
        setReadFilter,
        search,
        setSearch,
        markAsRead,
        markAllAsRead,
        resetFilters,
        hasFilters,
        categories: commercialNotificationCategories,
    };
}
