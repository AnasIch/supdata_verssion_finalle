import { motion } from "framer-motion";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/Components/UI/Badge";

const statusLabels = {
    pending: "En attente",
    validated: "Validée",
    rejected: "Refusée",
    cancelled: "Annulée",
};

const statusVariants = {
    pending: "warning",
    validated: "success",
    rejected: "destructive",
    cancelled: "secondary",
};

const priorityVariants = {
    Haute: "destructive",
    Moyenne: "warning",
    Basse: "secondary",
};

export default function DemandeCard({ demande, onView, onValidate, onRefuse, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">{demande.id}</span>
                        <Badge variant={statusVariants[demande.status] || "secondary"}>
                            {statusLabels[demande.status] || demande.status}
                        </Badge>
                    </div>
                    <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">{demande.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{demande.requester} · {demande.type}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <Badge variant={priorityVariants[demande.priority] || "secondary"}>
                            {demande.priority}
                        </Badge>
                        <span className="text-xs font-medium text-slate-700">{demande.budget} MAD</span>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                    type="button"
                    onClick={() => onView(demande)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                    <Eye className="size-3.5" />
                    Voir
                </button>
                {demande.status === "pending" && (
                    <>
                        <button
                            type="button"
                            onClick={() => onValidate(demande)}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
                        >
                            <CheckCircle2 className="size-3.5" />
                            Valider
                        </button>
                        <button
                            type="button"
                            onClick={() => onRefuse(demande)}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-100"
                        >
                            <XCircle className="size-3.5" />
                            Refuser
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
}
