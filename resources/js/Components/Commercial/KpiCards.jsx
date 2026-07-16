import { motion } from "framer-motion";
import {
    ClipboardList,
    Clock,
    Package,
    Bell,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
    created: ClipboardList,
    pending: Clock,
    reserved: Package,
    notifications: Bell,
};

export default function KpiCards({ data }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((kpi, i) => {
                const Icon = iconMap[kpi.id] || ClipboardList;
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
                            {kpi.trend && (
                                <div
                                    className={cn(
                                        "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                                        kpi.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                    )}
                                >
                                    {kpi.trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                    {kpi.trend}
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <div className="flex items-baseline gap-1.5">
                                <p className="text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
                                {kpi.unit && <p className="text-sm font-medium text-slate-500">{kpi.unit}</p>}
                            </div>
                            <p className="mt-0.5 text-sm text-slate-500">{kpi.label}</p>
                            {kpi.description && <p className="mt-1 text-xs text-slate-400">{kpi.description}</p>}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
