import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Bell, Check, CheckCheck, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/UI/DropdownMenu";
import { cn } from "@/lib/utils";

const typeIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: XCircle,
};

const typeColors = {
    info: "bg-blue-100",
    success: "bg-emerald-100",
    warning: "bg-amber-100",
    error: "bg-red-100",
};

const typeTextColors = {
    info: "text-blue-600",
    success: "text-emerald-600",
    warning: "text-amber-600",
    error: "text-red-600",
};

export default function NotificationDropdown() {
    const { unreadCount, recentNotifications } = usePage().props;
    const count = unreadCount || 0;
    const notifications = recentNotifications || [];
    const [open, setOpen] = useState(false);

    const getBasePath = () => {
        return window.location.pathname.match(
            /^\/dashboard-(super-admin|admin-local|administrative|commercial|stock)/
        )?.[0] || "/dashboard-super-admin";
    };

    const handleMarkAllRead = (e) => {
        e.stopPropagation();
        const base = getBasePath();
        router.patch(`${base}/notifications/read-all`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["unreadCount", "recentNotifications"] });
            },
        });
    };

    const handleNotificationClick = (notif) => {
        setOpen(false);
        const base = getBasePath();

        if (!notif.read) {
            router.patch(`${base}/notifications/${notif.id}/read`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ["unreadCount", "recentNotifications"] });
                },
            });
        }

        if (notif.action_url) {
            window.location.href = `${base}/${notif.action_url}`;
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="relative flex size-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    aria-label={`Notifications${count > 0 ? ` (${count} non lues)` : ""}`}
                >
                    <Bell className="size-[1.15rem]" />
                    {count > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[0.6rem] font-bold text-white">
                            {count > 99 ? "99+" : count}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl border-slate-200/80 p-0 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between px-4 py-3">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold text-slate-900">
                        Notifications
                    </DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                        {count > 0 && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                {count} non lues
                            </span>
                        )}
                        {count > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="rounded-md p-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Tout marquer comme lu"
                            >
                                <CheckCheck size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Bell size={24} className="text-slate-300" />
                            <p className="mt-2 text-xs text-slate-500">Aucune notification</p>
                        </div>
                    ) : (
                        notifications.map((notif) => {
                            const Icon = typeIcons[notif.type] || Bell;
                            return (
                                <DropdownMenuItem
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={cn(
                                        "flex cursor-pointer items-start gap-3 rounded-none px-4 py-3 focus:bg-slate-50",
                                        !notif.read && "bg-blue-50/30"
                                    )}
                                >
                                    <div className={cn(
                                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                                        notif.read ? "bg-slate-100" : typeColors[notif.type] || "bg-blue-100"
                                    )}>
                                        {notif.read ? (
                                            <CheckCheck className="size-4 text-slate-400" />
                                        ) : (
                                            <Icon className={cn("size-4", typeTextColors[notif.type] || "text-blue-600")} />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={cn("text-sm leading-tight", notif.read ? "text-slate-600" : "font-medium text-slate-900")}>
                                            {notif.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{notif.description}</p>
                                        <p className="mt-1 text-[0.65rem] text-slate-400">{notif.time}</p>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })
                    )}
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="px-2 py-2">
                    <button
                        className="w-full rounded-xl py-2 text-center text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => {
                            setOpen(false);
                            const base = getBasePath();
                            window.location.href = `${base}/notifications`;
                        }}
                    >
                        Voir toutes les notifications
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
