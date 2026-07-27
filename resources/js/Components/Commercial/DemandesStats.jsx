import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { key: "total", label: "Total des demandes", icon: ClipboardList, color: "bg-blue-50 text-blue-600" },
    { key: "submitted", label: "En attente", icon: Clock, color: "bg-amber-50 text-amber-600" },
    { key: "accepted", label: "Acceptées", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    { key: "refused", label: "Refusées", icon: XCircle, color: "bg-red-50 text-red-500" },
];

export default function DemandesStats({ data }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 }}
                        whileHover={{ y: -2, transition: { duration: 0.15 } }}
                        className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)]"
                    >
                        <div className="flex items-center justify-between">
                            <div className={cn("flex size-11 items-center justify-center rounded-xl", stat.color)}>
                                <Icon className="size-5" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                {data[stat.key]}
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">{stat.label}</p>
                    </motion.div>
                );
            })}
        </div>
    );
}
