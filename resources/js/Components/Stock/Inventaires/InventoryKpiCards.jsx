import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardList, PackageX } from "lucide-react";

const iconMap = {
    in_progress: ClipboardList,
    completed: CheckCircle2,
    ecarts: AlertTriangle,
    manquants: PackageX,
    last: CalendarDays,
};

export default function InventoryKpiCards({ data }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                        <div className={`flex size-11 items-center justify-center rounded-xl ${kpi.color}`}>
                            <Icon className="size-5" />
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
                            <p className="mt-0.5 text-sm text-slate-500">{kpi.label}</p>
                            {kpi.detail && <p className="mt-1 text-xs text-slate-400">{kpi.detail}</p>}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
