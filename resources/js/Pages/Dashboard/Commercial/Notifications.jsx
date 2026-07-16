import { useState } from "react";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    BellRing,
    CheckCheck,
    Search,
    ShoppingCart,
    Package,
    Truck,
    Info,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Clock,
    Mail,
    MailOpen,
    X,
    RotateCcw,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useCommercialNotifications } from "@/Hooks/useCommercialNotifications";
import { commercialNotificationTypes } from "@/Mocks/commercialNotifications";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Badge } from "@/Components/UI/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

const categoryIcons = {
    demandes: ShoppingCart,
    reservations: Package,
    livraisons: Truck,
    informations: Info,
};

const typeIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
};

const priorityColors = {
    haute: "bg-red-50 text-red-600",
    moyenne: "bg-amber-50 text-amber-600",
    basse: "bg-slate-100 text-slate-500",
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

function NotificationRow({ notification, onMarkAsRead }) {
    const TypeIcon = typeIcons[notification.type] || Bell;
    const CatIcon = categoryIcons[notification.category] || Bell;
    const typeConfig = commercialNotificationTypes[notification.type];

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
                    typeConfig?.color || "bg-slate-100 text-slate-500"
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
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        <CatIcon size={12} />
                        {notification.category === "demandes" && "Demandes"}
                        {notification.category === "reservations" && "Réservations"}
                        {notification.category === "livraisons" && "Livraisons"}
                        {notification.category === "informations" && "Informations"}
                    </span>
                    <span className={cn("rounded-md px-1.5 py-0.5 text-xs font-medium", priorityColors[notification.priority])}>
                        {notification.priority === "haute" && "Haute"}
                        {notification.priority === "moyenne" && "Moyenne"}
                        {notification.priority === "basse" && "Basse"}
                    </span>
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
                </div>
            </div>

            <span className="shrink-0 text-xs text-slate-400 hidden sm:block">
                {notification.date}
            </span>
        </div>
    );
}

export default function CommercialNotifications() {
    const user = getCurrentUser();
    const {
        notifications,
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
        categories,
    } = useCommercialNotifications();

    return (
        <DashboardLayout
            title="Notifications"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Notifications" },
            ]}
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
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            {categories.map((c) => (
                                                <option key={c.value} value={c.value}>
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={readFilter}
                                            onChange={(e) => setReadFilter(e.target.value)}
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
                        {notifications.length} notification{notifications.length > 1 ? "s" : ""}
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
                                    />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
}
