import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    BellRing,
    CheckCheck,
    Search,
    Info,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    Mail,
    MailOpen,
    X,
    RotateCcw,
    Trash2,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useToast } from "@/Components/UI/Toast";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Card, CardContent } from "@/Components/UI/Card";

const typeIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
};

const typeColors = {
    info: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    error: "bg-red-50 text-red-600",
};

const sourceLabels = {
    demandes: "Demandes",
    reservations: "Réservations",
    livraisons: "Livraisons",
    utilisateurs: "Utilisateurs",
    agences: "Agences",
    roles: "Rôles",
    parametres: "Paramètres",
    rapports: "Rapports",
    stock: "Stock",
    system: "Système",
};

function KpiBar({ stats }) {
    const items = [
        { label: "Total", value: stats.total, icon: Bell, bg: "bg-slate-50", color: "text-slate-600" },
        { label: "Non lues", value: stats.unread, icon: BellRing, bg: "bg-blue-50", color: "text-blue-600" },
        { label: "Aujourd'hui", value: stats.today, icon: Clock, bg: "bg-emerald-50", color: "text-emerald-600" },
        { label: "Cette semaine", value: stats.thisWeek, icon: CheckCircle2, bg: "bg-violet-50", color: "text-violet-600" },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4"
                >
                    <div className={cn("flex size-10 items-center justify-center rounded-lg", item.bg)}>
                        <item.icon size={20} className={item.color} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="text-xl font-bold text-slate-900">{item.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function NotificationRow({ notification, onMarkAsRead, onDelete }) {
    const TypeIcon = typeIcons[notification.type] || Bell;

    return (
        <div
            className={cn(
                "group flex items-start gap-3 rounded-xl border p-3 transition-all hover:shadow-sm sm:items-center sm:p-4",
                notification.read
                    ? "border-slate-100 bg-white"
                    : "border-blue-100 bg-blue-50/30"
            )}
        >
            <div
                className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10",
                    typeColors[notification.type] || "bg-slate-100 text-slate-500"
                )}
            >
                <TypeIcon size={18} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <p
                        className={cn(
                            "text-sm leading-tight",
                            notification.read
                                ? "font-medium text-slate-700"
                                : "font-semibold text-slate-900"
                        )}
                    >
                        {notification.title}
                    </p>
                    <span className="shrink-0 text-xs text-slate-400">
                        {notification.time}
                    </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {notification.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {notification.source && sourceLabels[notification.source] && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {sourceLabels[notification.source]}
                        </span>
                    )}
                    {notification.read ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                            <MailOpen size={12} />
                            Lu
                        </span>
                    ) : (
                        <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-200"
                        >
                            <Mail size={12} />
                            Non lu
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(notification.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-500 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            <span className="shrink-0 text-xs text-slate-400 hidden sm:block">
                {notification.timestamp}
            </span>
        </div>
    );
}

export default function CommercialNotifications({
    notifications,
    pagination,
    stats,
    unreadCount,
    filters,
}) {
    const { props } = usePage();
    const toast = useToast();
    const user = props.auth?.user;

    const [search, setSearch] = useState(filters?.search || "");
    const [readFilter, setReadFilter] = useState(filters?.read || "all");

    useEffect(() => {
        const flash = props.flash;
        if (flash?.success) toast(flash.success, "success");
        if (flash?.error) toast(flash.error, "error");
    }, [props.flash]);

    useEffect(() => {
        const errors = props.errors;
        if (errors) {
            const firstError = Object.values(errors)[0];
            if (firstError) toast(firstError, "error");
        }
    }, [props.errors]);

    const buildParams = (overrides = {}) => {
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : search;
        const r = overrides.read !== undefined ? overrides.read : readFilter;
        const page = overrides.page !== undefined ? overrides.page : 1;

        if (s) params.search = s;
        if (r && r !== "all") params.read = r;
        if (page > 1) params.page = page;

        return params;
    };

    const navigate = (overrides = {}) => {
        router.get(
            route("rc.notifications"),
            buildParams(overrides),
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (value) => {
        setSearch(value);
        navigate({ search: value, page: 1 });
    };

    const handleReadFilter = (value) => {
        setReadFilter(value);
        navigate({ read: value, page: 1 });
    };

    const handlePageChange = (page) => {
        navigate({ page });
    };

    const markAsRead = (id) => {
        router.patch(route("rc.notifications.read", id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    };

    const markAllAsRead = () => {
        router.patch(route("rc.notifications.read-all"), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    };

    const deleteNotification = (id) => {
        router.delete(route("rc.notifications.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["notifications", "unreadCount", "stats"] });
            },
        });
    };

    const resetFilters = () => {
        setSearch("");
        setReadFilter("all");
        navigate({ search: "", read: "all", page: 1 });
    };

    const hasFilters = search || readFilter !== "all";

    const breadcrumbs = [
        { label: "Dashboard", href: "/dashboard-commercial" },
        { label: "Notifications" },
    ];

    return (
        <DashboardLayout
            title="Notifications"
            breadcrumbs={breadcrumbs}
            user={user}
        >
            <Head title="Notifications — SUPDATA" />

            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Notifications
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Consultez toutes les notifications liées à vos demandes d'achat et à vos réservations.
                        </p>
                    </div>
                </motion.div>

                <KpiBar stats={stats} />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                >
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative flex-1">
                                        <Search
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <Input
                                            placeholder="Rechercher une notification…"
                                            value={search}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={readFilter}
                                            onChange={(e) => handleReadFilter(e.target.value)}
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="all">Toutes</option>
                                            <option value="unread">Non lues</option>
                                            <option value="read">Lues</option>
                                        </select>
                                    </div>
                                </div>
                                {hasFilters && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={resetFilters}
                                            className="text-xs text-slate-500 hover:text-slate-700"
                                        >
                                            <X size={12} className="mr-1" />
                                            Effacer les filtres
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {pagination.total} notification{pagination.total !== 1 ? "s" : ""}
                        {hasFilters && " (filtré)"}
                    </p>
                    <div className="flex gap-2">
                        {stats.unread > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                            >
                                <CheckCheck size={14} className="mr-1.5" />
                                Tout marquer lu
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 py-20"
                            >
                                <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
                                    <Bell size={32} className="text-slate-400" />
                                </div>
                                <p className="mt-4 text-sm font-medium text-slate-900">
                                    {hasFilters
                                        ? "Aucune notification ne correspond à vos filtres"
                                        : "Aucune notification pour le moment"}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {hasFilters
                                        ? "Essayez de modifier ou réinitialiser vos filtres"
                                        : "Vous recevrez ici les alertes liées à vos demandes et réservations"}
                                </p>
                                {hasFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={resetFilters}
                                    >
                                        <RotateCcw size={14} className="mr-1.5" />
                                        Réinitialiser les filtres
                                    </Button>
                                )}
                            </motion.div>
                        ) : (
                            notifications.map((n) => (
                                <motion.div
                                    key={n.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <NotificationRow
                                        notification={n}
                                        onMarkAsRead={markAsRead}
                                        onDelete={deleteNotification}
                                    />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {pagination.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                            disabled={pagination.currentPage === 1}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-3 text-sm text-slate-500">
                            Page {pagination.currentPage} / {pagination.lastPage}
                        </span>
                        <button
                            type="button"
                            onClick={() => handlePageChange(Math.min(pagination.lastPage, pagination.currentPage + 1))}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
