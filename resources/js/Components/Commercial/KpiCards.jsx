import { motion } from "framer-motion";
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const defaultStats = {
    totalDemandes: 0,
    pendingDemandes: 0,
    approvedDemandes: 0,
    unreadNotifications: 0,
};

const kpiConfig = [
    {
        id: "created",
        key: "totalDemandes",
        label: "Demandes d'achat créées",
        description: "Total",
        icon: ClipboardList,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "pending",
        key: "pendingDemandes",
        label: "Demandes en attente",
        description: "En cours de traitement",
        icon: Clock,
        color: "bg-amber-50 text-amber-600",
    },
    {
        id: "approved",
        key: "approvedDemandes",
        label: "Demandes approuvées",
        description: "Validées",
        icon: CheckCircle2,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "notifications",
        key: "unreadNotifications",
        label: "Notifications non lues",
        description: "À traiter",
        icon: Bell,
        color: "bg-violet-50 text-violet-600",
    },
];

export default function KpiCards({ stats = defaultStats }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiConfig.map((kpi, i) => {
                const Icon = kpi.icon;
                const value = stats[kpi.key] ?? 0;
                return (
                    <motion.div
                        key={kpi.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                        whileHover={{ y: -2, transition: { duration: 0.15 } }}
                        className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)]"
                    >
                        <div className="flex items-start justify-between">
                            <div className={cn("flex size-11 items-center justify-center rounded-xl", kpi.color)}>
                                <Icon className="size-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
                            <p className="mt-0.5 text-sm text-slate-500">{kpi.label}</p>
                            <p className="mt-1 text-xs text-slate-400">{kpi.description}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
