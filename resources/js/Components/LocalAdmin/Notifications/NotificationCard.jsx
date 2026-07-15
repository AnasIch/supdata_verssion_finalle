import { useState } from "react";
import { motion } from "framer-motion";
import {
    Info,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Mail,
    MailOpen,
    Eye,
    Trash2,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/UI/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/UI/Dialog";

const typeConfig = {
    info: { color: "bg-blue-50 text-blue-600", icon: Info, label: "Information" },
    success: { color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2, label: "Succès" },
    warning: { color: "bg-amber-50 text-amber-600", icon: AlertTriangle, label: "Avertissement" },
    error: { color: "bg-red-50 text-red-600", icon: XCircle, label: "Erreur" },
};

export default function NotificationCard({ notification, onMarkAsRead, onDelete, delay = 0 }) {
    const [openDetail, setOpenDetail] = useState(false);
    const config = typeConfig[notification.type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
                className={cn(
                    "group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm",
                    notification.read
                        ? "border-slate-100 bg-white"
                        : "border-blue-100 bg-blue-50/30"
                )}
            >
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", config.color)}>
                    <Icon size={18} />
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
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            <Clock size={12} />
                            {notification.timestamp}
                        </span>
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

                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => setOpenDetail(true)}
                    >
                        <Eye className="size-4 text-slate-400" />
                    </Button>
                    {!notification.read && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="size-8 p-0"
                            onClick={() => onMarkAsRead(notification.id)}
                        >
                            <MailOpen className="size-4 text-slate-400" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => onDelete(notification.id)}
                    >
                        <Trash2 className="size-4 text-slate-400 hover:text-red-500" />
                    </Button>
                </div>
            </motion.div>

            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-w-lg sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="pr-8">{notification.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2 text-xs">
                            <Clock size={12} />
                            {notification.timestamp}
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
                                    config.color
                                )}
                            >
                                <Icon size={12} />
                                {config.label}
                            </span>
                            <span className="text-xs text-slate-400">
                                {notification.read ? "Lue" : "Non lue"}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpenDetail(false)}
                        >
                            Fermer
                        </Button>
                        {!notification.read && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    onMarkAsRead(notification.id);
                                    setOpenDetail(false);
                                }}
                            >
                                <MailOpen size={14} className="mr-1.5" />
                                Marquer comme lu
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
