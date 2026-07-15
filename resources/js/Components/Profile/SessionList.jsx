import { useState } from "react";
import { motion } from "framer-motion";
import {
    Monitor,
    Smartphone,
    Globe,
    Clock,
    LogOut,
    Trash2,
} from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/UI/Dialog";
import { cn } from "@/lib/utils";

const sessionStatuses = {
    active: { label: "Active", color: "bg-emerald-50 text-emerald-600" },
    expired: { label: "Expirée", color: "bg-slate-100 text-slate-500" },
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

function getBrowserIcon(browser) {
    if (browser.toLowerCase().includes("chrome")) return Monitor;
    if (browser.toLowerCase().includes("safari")) return Monitor;
    if (browser.toLowerCase().includes("firefox")) return Monitor;
    if (browser.toLowerCase().includes("mobile")) return Smartphone;
    return Monitor;
}

export default function SessionList({
    sessions,
    onTerminate,
    onTerminateAll,
}) {
    const [confirmTerminate, setConfirmTerminate] = useState(null);
    const [confirmTerminateAll, setConfirmTerminateAll] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">
                        Sessions actives
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                        {sessions.length} session{sessions.length > 1 ? "s" : ""} active{sessions.length > 1 ? "s" : ""}
                    </p>
                </div>
                {sessions.filter((s) => !s.isCurrent).length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmTerminateAll(true)}
                    >
                        <Trash2 size={14} className="mr-1.5" />
                        Déconnecter les autres
                    </Button>
                )}
            </div>

            <hr className="my-5 border-slate-100" />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3"
            >
                {sessions.map((session) => {
                    const BrowserIcon = getBrowserIcon(session.browser);
                    const status = sessionStatuses[session.status];

                    return (
                        <motion.div
                            key={session.id}
                            variants={item}
                            className={cn(
                                "flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between",
                                session.isCurrent
                                    ? "border-blue-200 bg-blue-50/40"
                                    : "border-slate-100 bg-white"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        "flex size-10 items-center justify-center rounded-lg",
                                        session.isCurrent
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-slate-100 text-slate-500"
                                    )}
                                >
                                    <BrowserIcon size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900">
                                            {session.browser}
                                        </p>
                                        {session.isCurrent && (
                                            <Badge className="bg-blue-100 text-xs text-blue-700">
                                                Session actuelle
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {session.os}
                                    </p>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                        <span className="inline-flex items-center gap-1">
                                            <Globe size={12} />
                                            {session.ip}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock size={12} />
                                            {session.date}
                                        </span>
                                        <span>{session.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pl-13 sm:pl-0">
                                <Badge className={cn("text-xs", status.color)}>
                                    {status.label}
                                </Badge>
                                {!session.isCurrent && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={() => setConfirmTerminate(session.id)}
                                    >
                                        <LogOut size={14} />
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Confirm terminate single */}
            <Dialog
                open={confirmTerminate !== null}
                onOpenChange={() => setConfirmTerminate(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Déconnecter cette session ?</DialogTitle>
                        <DialogDescription>
                            La session sera déconnectée immédiatement.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmTerminate(null)}
                        >
                            Annuler
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                onTerminate(confirmTerminate);
                                setConfirmTerminate(null);
                            }}
                        >
                            <LogOut size={14} className="mr-1.5" />
                            Déconnecter
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm terminate all */}
            <Dialog
                open={confirmTerminateAll}
                onOpenChange={setConfirmTerminateAll}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Déconnecter toutes les autres sessions ?
                        </DialogTitle>
                        <DialogDescription>
                            Toutes les sessions sauf la session actuelle seront
                            déconnectées.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmTerminateAll(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                onTerminateAll();
                                setConfirmTerminateAll(false);
                            }}
                        >
                            <Trash2 size={14} className="mr-1.5" />
                            Déconnecter tout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
