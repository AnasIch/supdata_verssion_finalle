import { motion } from "framer-motion";
import { UserPlus, Building2, ShieldCheck, LogIn, ClipboardList, Settings } from "lucide-react";

const actionIcons = {
    "Création": UserPlus,
    "Modification": Settings,
    "Suppression": ShieldCheck,
    "Connexion": LogIn,
    "Déconnexion": LogIn,
    "Export": ClipboardList,
    "Statut": Building2,
};

const actionColors = {
    "Création": "bg-blue-50 text-blue-600",
    "Modification": "bg-amber-50 text-amber-600",
    "Suppression": "bg-red-50 text-red-600",
    "Connexion": "bg-emerald-50 text-emerald-600",
    "Déconnexion": "bg-slate-100 text-slate-500",
    "Export": "bg-violet-50 text-violet-600",
    "Statut": "bg-indigo-50 text-indigo-600",
};

export default function RecentActivity({ activity = [] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.4 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Activité récente</h3>
                <p className="text-xs text-slate-500">Dernières actions enregistrées</p>
            </div>
            <div className="relative">
                {activity.length > 0 && (
                    <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                )}
                <div className="flex flex-col gap-4">
                    {activity.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-400">
                            Aucune activité pour le moment
                        </div>
                    ) : (
                        activity.map((a) => {
                            const Icon = actionIcons[a.action] || ClipboardList;
                            const color = actionColors[a.action] || "bg-slate-100 text-slate-500";
                            return (
                                <div key={a.id} className="relative flex items-start gap-3">
                                    <div className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${color}`}>
                                        <Icon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-slate-900">{a.description}</p>
                                        <p className="text-xs text-slate-500">
                                            {a.user} — {a.module}
                                            {a.target ? ` — ${a.target}` : ""}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-slate-400">{a.created_at}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </motion.div>
    );
}
