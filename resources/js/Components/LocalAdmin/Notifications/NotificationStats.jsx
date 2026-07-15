import { motion } from "framer-motion";
import { Bell, BellRing, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const kpiConfig = [
    { key: "unread", label: "Non lues", icon: BellRing, color: "text-blue-600", bg: "bg-blue-50" },
    { key: "today", label: "Aujourd'hui", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
    { key: "thisWeek", label: "Cette semaine", icon: Bell, color: "text-violet-600", bg: "bg-violet-50" },
    { key: "critical", label: "Alertes critiques", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
];

export default function NotificationStats({ stats }) {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpiConfig.map((kpi, i) => (
                <motion.div
                    key={kpi.key}
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
                        <p className="text-xl font-bold text-slate-900">{stats[kpi.key]}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
