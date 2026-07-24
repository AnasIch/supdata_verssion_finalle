import { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Bell,
    BellRing,
    CheckCheck,
    Search,
    Trash2,
    X,
    XCircle,
    AlertTriangle,
    Clock,
    ChevronRight,
    ChevronLeft,
    RotateCcw,
    Settings,
    Mail,
    MailOpen,
    Building2,
    ShoppingCart,
    Users,
    Package,
    Shield,
    BarChart3,
    Info,
    CheckCircle2,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useNotifications } from "@/Hooks/useNotifications";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/UI/Dialog";

const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
};

const notificationTypes = {
    info: { color: "bg-blue-50 text-blue-600", icon: Info },
    success: { color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
    warning: { color: "bg-amber-50 text-amber-600", icon: AlertTriangle },
    error: { color: "bg-red-50 text-red-600", icon: XCircle },
};

const notificationSources = [
    { value: "all", label: "Toutes les sources" },
    { value: "system", label: "Système" },
    { value: "stock", label: "Stock" },
    { value: "achats", label: "Achats" },
    { value: "utilisateurs", label: "Utilisateurs" },
    { value: "agences", label: "Agences" },
    { value: "roles", label: "Rôles" },
    { value: "paramètres", label: "Paramètres" },
    { value: "rapports", label: "Rapports" },
];

const sourceIcons = {
    system: Settings,
    stock: Package,
    achats: ShoppingCart,
    utilisateurs: Users,
    agences: Building2,
    roles: Shield,
    paramètres: Settings,
    rapports: BarChart3,
};

function NotificationIcon({ type, size = 16 }) {
    const config = notificationTypes[type];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon size={size} />;
}

function SourceBadge({ source }) {
    const Icon = sourceIcons[source] || Bell;
    const label = notificationSources.find((s) => s.value === source)?.label || source;
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            <Icon size={12} />
            {label}
        </span>
    );
}

function EmptyState({ hasFilters, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 py-20">
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
                    : "Vous recevrez ici les alertes et notifications du système"}
            </p>
            {hasFilters && (
                <Button variant="outline" size="sm" className="mt-4" onClick={onReset}>
                    <RotateCcw size={14} className="mr-1.5" />
                    Réinitialiser les filtres
                </Button>
            )}
        </div>
    );
}

function NotificationRow({ notification, onMarkAsRead, onDelete }) {
    const [openDetail, setOpenDetail] = useState(false);

    return (
        <div>
            <div
                onClick={() => {
                    setOpenDetail(true);
                    if (!notification.read) onMarkAsRead(notification.id);
                }}
                className={cn(
                    "group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all hover:shadow-sm sm:items-center sm:p-4",
                    notification.read
                        ? "border-slate-100 bg-white"
                        : "border-blue-100 bg-blue-50/30"
                )}
            >
                <div
                    className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10",
                        notificationTypes[notification.type]?.color || "bg-slate-100 text-slate-500"
                    )}
                >
                    <NotificationIcon type={notification.type} size={18} />
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
                    <div className="mt-2 flex items-center gap-2">
                        <SourceBadge source={notification.source} />
                        {notification.read ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                                <MailOpen size={12} />
                                Lu
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-600">
                                <Mail size={12} />
                                Non lu
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                    }}
                    className="hidden shrink-0 rounded-lg p-1.5 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    aria-label="Supprimer"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-w-lg sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="pr-8">{notification.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 text-xs">
                            <Clock size={12} />
                            {notification.timestamp} · <SourceBadge source={notification.source} />
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-2">
                        <div className="rounded-lg bg-slate-50 p-4">
                            <p className="text-sm leading-relaxed text-slate-700">
                                {notification.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                                    notificationTypes[notification.type]?.color || "bg-slate-100 text-slate-500"
                                )}
                            >
                                <NotificationIcon type={notification.type} size={12} />
                                {notification.type === "info" && "Information"}
                                {notification.type === "success" && "Succès"}
                                {notification.type === "warning" && "Avertissement"}
                                {notification.type === "error" && "Erreur"}
                            </span>
                            <span className="text-xs text-slate-400">
                                {notification.read ? "Lue" : "Non lue"}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" size="sm" onClick={() => setOpenDetail(false)}>
                            Fermer
                        </Button>
                        {notification.action_url && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    const base = window.location.pathname.match(
                                        /^\/dashboard-(super-admin|admin-local|administrative|commercial|stock)/
                                    )?.[0] || "/dashboard-super-admin";
                                    window.location.href = `${base}/${notification.action_url}`;
                                }}
                            >
                                Voir les détails
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function FilterBar({
    search,
    onSearchChange,
    sourceFilter,
    onSourceChange,
    typeFilter,
    onTypeChange,
    readFilter,
    onReadChange,
    onReset,
    hasFilters,
}) {
    return (
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
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={sourceFilter}
                        onChange={(e) => onSourceChange(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {notificationSources.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">Tous les types</option>
                        <option value="info">Information</option>
                        <option value="success">Succès</option>
                        <option value="warning">Avertissement</option>
                        <option value="error">Erreur</option>
                    </select>
                    <select
                        value={readFilter}
                        onChange={(e) => onReadChange(e.target.value)}
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
                        onClick={onReset}
                        className="text-xs text-slate-500 hover:text-slate-700"
                    >
                        <X size={12} className="mr-1" />
                        Effacer les filtres
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function NotificationsIndex({
    notifications: initialNotifications,
    pagination: initialPagination,
    stats: initialStats,
    unreadCount: initialUnreadCount,
    filters: initialFilters,
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const base = user?.role === "Super Admin" ? "/dashboard-super-admin"
        : user?.role === "Administrateur Local" ? "/dashboard-admin-local"
        : user?.role === "Gestion Administrative" ? "/dashboard-administrative"
        : user?.role === "Responsable Commercial" ? "/dashboard-commercial"
        : user?.role === "Responsable Stock" ? "/dashboard-stock"
        : "/dashboard-super-admin";

    const {
        notifications,
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
        filteredCount,
        hasFilters,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
        resetFilters,
    } = useNotifications({
        initialNotifications,
        initialFilters,
        initialPagination,
    });

    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

    const stats = initialStats || { total: 0, unread: 0, warning: 0, error: 0 };

    const kpiData = [
        { label: "Total", value: stats.total, icon: Bell, color: "text-slate-600", bg: "bg-slate-50" },
        { label: "Non lues", value: stats.unread, icon: BellRing, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Avertissements", value: stats.warning, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Erreurs", value: stats.error, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    ];

    return (
        <DashboardLayout
            title="Centre de notifications"
            breadcrumbs={[
                { label: "Dashboard", href: base },
                { label: "Notifications" },
            ]}
            user={user}
        >
            <Head title="Notifications — SUPDATA" />

            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpiData.map((kpi, i) => (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4"
                        >
                            <div className={cn("flex size-10 items-center justify-center rounded-lg", kpi.bg)}>
                                <kpi.icon size={20} className={kpi.color} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">{kpi.label}</p>
                                <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <FilterBar
                        search={search}
                        onSearchChange={setSearch}
                        sourceFilter={sourceFilter}
                        onSourceChange={setSourceFilter}
                        typeFilter={typeFilter}
                        onTypeChange={setTypeFilter}
                        readFilter={readFilter}
                        onReadChange={setReadFilter}
                        onReset={resetFilters}
                        hasFilters={hasFilters}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {filteredCount} notification{filteredCount > 1 ? "s" : ""}
                        {hasFilters && " (filtré)"}
                    </p>
                    <div className="flex gap-2">
                        {stats.unread > 0 && (
                            <Button variant="outline" size="sm" onClick={markAllAsRead}>
                                <CheckCheck size={14} className="mr-1.5" />
                                Tout marquer lu
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmDeleteAll(true)}
                        >
                            <Trash2 size={14} className="mr-1.5" />
                            Supprimer les lues
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {notifications.length === 0 ? (
                        <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
                    ) : (
                        <div className="flex flex-col gap-2">
                            {notifications.map((n) => (
                                <NotificationRow
                                    key={n.id}
                                    notification={n}
                                    onMarkAsRead={markAsRead}
                                    onDelete={deleteNotification}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
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
                            onClick={() => setCurrentPage(currentPage + 1)}
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
                                Cette action est irréversible. Toutes les notifications lues seront définitivement supprimées.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" size="sm" onClick={() => setConfirmDeleteAll(false)}>
                                Annuler
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    deleteAllRead();
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
