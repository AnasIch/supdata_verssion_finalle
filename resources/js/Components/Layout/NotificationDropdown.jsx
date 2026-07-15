import { Bell, Check, CheckCheck } from "lucide-react";
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

const notifications = [
    {
        id: 1,
        title: "Nouvelle demande d'achat",
        description: "Demande #2847 en attente de validation",
        time: "Il y a 5 min",
        read: false,
    },
    {
        id: 2,
        title: "Stock mis à jour",
        description: "Agence Lyon — inventaire terminé",
        time: "Il y a 20 min",
        read: false,
    },
    {
        id: 3,
        title: "Utilisateur créé",
        description: "marie.dupont@supdata.fr ajouté",
        time: "Il y a 1h",
        read: true,
    },
];

export default function NotificationDropdown() {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="relative flex size-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ""}`}
                >
                    <Bell className="size-[1.15rem]" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[0.6rem] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl border-slate-200/80 p-0 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between px-4 py-3">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold text-slate-900">
                        Notifications
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                            {unreadCount} non lues
                        </span>
                    )}
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                        <DropdownMenuItem
                            key={notif.id}
                            className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-none px-4 py-3 focus:bg-slate-50",
                                !notif.read && "bg-blue-50/30"
                            )}
                        >
                            <div className={cn(
                                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                                notif.read ? "bg-slate-100" : "bg-blue-100"
                            )}>
                                {notif.read ? (
                                    <CheckCheck className="size-4 text-slate-400" />
                                ) : (
                                    <Check className="size-4 text-blue-600" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={cn("text-sm", notif.read ? "text-slate-600" : "font-medium text-slate-900")}>
                                    {notif.title}
                                </p>
                                <p className="text-xs text-slate-500">{notif.description}</p>
                                <p className="mt-1 text-[0.65rem] text-slate-400">{notif.time}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator className="m-0" />
                <div className="px-2 py-2">
                    <button
                        className="w-full rounded-xl py-2 text-center text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => window.location.href = "/notifications"}
                    >
                        Voir toutes les notifications
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
