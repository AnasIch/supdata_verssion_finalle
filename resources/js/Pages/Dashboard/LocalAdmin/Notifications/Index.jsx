import { useState } from "react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useLocalAdminNotifications } from "@/Hooks/useLocalAdminNotifications";
import NotificationsHeader from "@/Components/LocalAdmin/Notifications/NotificationsHeader";
import NotificationStats from "@/Components/LocalAdmin/Notifications/NotificationStats";
import NotificationsFilter from "@/Components/LocalAdmin/Notifications/NotificationsFilter";
import NotificationCard from "@/Components/LocalAdmin/Notifications/NotificationCard";
import NotificationsEmpty from "@/Components/LocalAdmin/Notifications/NotificationsEmpty";
import { Button } from "@/Components/UI/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/UI/Dialog";

export default function LocalAdminNotifications() {
    const user = getCurrentUser();
    const {
        notifications,
        search,
        setSearch,
        categoryFilter,
        setCategoryFilter,
        categoryOptions,
        currentPage,
        setCurrentPage,
        totalPages,
        filteredCount,
        unreadCount,
        stats,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        resetFilters,
    } = useLocalAdminNotifications();

    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
    const hasFilters = search || categoryFilter !== "all";

    return (
        <DashboardLayout
            title="Notifications — Agence"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Notifications" },
            ]}
            user={user}
        >
            <Head title="Notifications — Agence Casablanca — SUPDATA" />

            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <NotificationsHeader
                        unreadCount={unreadCount}
                        onMarkAllRead={markAllAsRead}
                    />
                </motion.div>

                <NotificationStats stats={stats} />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-xl border border-slate-100 bg-white p-4"
                >
                    <NotificationsFilter
                        search={search}
                        onSearchChange={setSearch}
                        categoryFilter={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                        categoryOptions={categoryOptions}
                        onReset={resetFilters}
                        hasFilters={hasFilters}
                    />
                </motion.div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {filteredCount} notification{filteredCount !== 1 ? "s" : ""}
                        {hasFilters && " (filtré)"}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDeleteAll(true)}
                    >
                        <Trash2 size={14} className="mr-1.5" />
                        Supprimer les lues
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    {notifications.length === 0 ? (
                        <NotificationsEmpty hasFilters={hasFilters} onReset={resetFilters} />
                    ) : (
                        notifications.map((n, i) => (
                            <NotificationCard
                                key={n.id}
                                notification={n}
                                onMarkAsRead={markAsRead}
                                onDelete={deleteNotification}
                                delay={i * 0.03}
                            />
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            <ChevronLeft size={14} />
                        </Button>
                        <span className="px-3 text-sm text-slate-600">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                )}

                <Dialog open={confirmDeleteAll} onOpenChange={setConfirmDeleteAll}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Supprimer les notifications lues ?</DialogTitle>
                            <DialogDescription>
                                Cette action est irréversible. Toutes les
                                notifications lues seront définitivement
                                supprimées.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setConfirmDeleteAll(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    setConfirmDeleteAll(false);
                                }}
                            >
                                <Trash2 size={14} className="mr-1.5" />
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
