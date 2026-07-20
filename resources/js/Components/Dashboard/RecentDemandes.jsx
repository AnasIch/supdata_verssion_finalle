import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusConfig = {
    pending: { label: "En attente", style: "bg-amber-50 text-amber-700" },
    approved: { label: "Approuvée", style: "bg-emerald-50 text-emerald-700" },
    rejected: { label: "Rejetée", style: "bg-red-50 text-red-600" },
    in_progress: { label: "En cours", style: "bg-blue-50 text-blue-600" },
    completed: { label: "Terminée", style: "bg-slate-100 text-slate-600" },
};

const priorityConfig = {
    low: { label: "Basse", style: "bg-slate-50 text-slate-500" },
    medium: { label: "Moyenne", style: "bg-blue-50 text-blue-600" },
    high: { label: "Haute", style: "bg-orange-50 text-orange-600" },
    urgent: { label: "Urgente", style: "bg-red-50 text-red-600" },
};

export default function RecentDemandes({ demandes = [] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.5 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Dernières demandes</h3>
                <p className="text-xs text-slate-500">Demandes d'achat récentes</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-2 pr-4 font-medium text-slate-500">Titre</th>
                            <th className="pb-2 pr-4 font-medium text-slate-500">Agence</th>
                            <th className="pb-2 pr-4 font-medium text-slate-500">Date</th>
                            <th className="pb-2 pr-4 font-medium text-slate-500">Priorité</th>
                            <th className="pb-2 font-medium text-slate-500">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {demandes.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-sm text-slate-400">
                                    Aucune demande pour le moment
                                </td>
                            </tr>
                        ) : (
                            demandes.map((d) => {
                                const s = statusConfig[d.status] || statusConfig.pending;
                                const p = priorityConfig[d.priority] || priorityConfig.medium;
                                return (
                                    <tr key={d.id} className="border-b border-slate-50 last:border-0">
                                        <td className="py-2.5 pr-4">
                                            <div>
                                                <span className="font-medium text-slate-900">{d.title}</span>
                                                <p className="text-xs text-slate-400">{d.user}</p>
                                            </div>
                                        </td>
                                        <td className="py-2.5 pr-4 text-slate-600">{d.agency}</td>
                                        <td className="py-2.5 pr-4 text-slate-500">{d.created_at}</td>
                                        <td className="py-2.5 pr-4">
                                            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", p.style)}>
                                                {p.label}
                                            </span>
                                        </td>
                                        <td className="py-2.5">
                                            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", s.style)}>
                                                {s.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
