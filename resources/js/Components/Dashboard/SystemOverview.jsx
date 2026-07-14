import { motion } from "framer-motion";
import { Server, Database, Wifi, Clock, CheckCircle2, HardDrive } from "lucide-react";

const items = [
    { label: "Version", value: "SUPDATA ERP v1.0", icon: Server },
    { label: "Statut", value: "En ligne", icon: Wifi, badge: true },
    { label: "Base de données", value: "Connectée", icon: Database, badge: true },
    { label: "Dernière synchronisation", value: "Il y a 2 min", icon: Clock },
    { label: "Espace utilisé", value: "12.4 Go / 50 Go", icon: HardDrive },
    { label: "Uptime", value: "99.98%", icon: CheckCircle2, badge: true },
];

export default function SystemOverview() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Aperçu système</h3>
                <p className="text-xs text-slate-500">État de l'infrastructure</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                    >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <item.icon className="size-4 text-slate-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <div className="flex items-center gap-1.5">
                                <p className="truncate text-sm font-medium text-slate-900">{item.value}</p>
                                {item.badge && (
                                    <span className="inline-flex size-1.5 rounded-full bg-emerald-400" />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
