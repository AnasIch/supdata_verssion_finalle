import { motion } from "framer-motion";
import { UserPlus, Building2, ShieldCheck, ArrowUpRight } from "lucide-react";

const actions = [
    { label: "Nouvel utilisateur", icon: UserPlus, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "Nouvelle agence", icon: Building2, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
    { label: "Consulter les audits", icon: ShieldCheck, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
];

export default function QuickActionsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.6 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Actions rapides</h3>
                <p className="text-xs text-slate-500">Raccourcis fréquents</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((a) => (
                    <button
                        key={a.label}
                        type="button"
                        className={`group flex items-center gap-3 rounded-xl p-3 text-left text-sm font-medium transition-colors duration-150 ${a.color}`}
                    >
                        <a.icon className="size-4 shrink-0" />
                        <span className="flex-1">{a.label}</span>
                        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
