import { motion } from "framer-motion";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/Components/UI/Badge";

const statusLabels = {
    submitted: "Soumise",
    pending_local_admin: "En attente de décision",
    confirmed_local_admin: "Confirmée",
    rejected_local_admin: "Rejetée",
};

const statusVariants = {
    submitted: "secondary",
    pending_local_admin: "warning",
    confirmed_local_admin: "success",
    rejected_local_admin: "destructive",
};

const priorityLabels = {
    urgent: "Urgente",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
};

const priorityVariants = {
    urgent: "destructive",
    high: "destructive",
    medium: "warning",
    low: "secondary",
};

export default function DemandeCard({ demande, onView, onConfirm, onReject, delay = 0 }) {
    const ref = `DEM-${new Date(demande.created_at).getFullYear()}-${String(demande.id).padStart(4, "0")}`;

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
                        <span className="text-xs font-medium text-slate-500">{ref}</span>
                        <Badge variant={statusVariants[demande.status] || "secondary"}>
                            {statusLabels[demande.status] || demande.status}
                        </Badge>
                    </div>
                    <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">{demande.product_name || demande.title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{demande.user?.name ?? "—"} · Qté {demande.quantity}</p>
                    <div className="mt-2">
                        <Badge variant={priorityVariants[demande.priority] || "secondary"}>
                            {priorityLabels[demande.priority] || demande.priority}
                        </Badge>
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
                {(demande.status === "submitted" || demande.status === "pending_local_admin") && (
                    <>
                        <button
                            type="button"
                            onClick={() => onConfirm(demande)}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
                        >
                            <CheckCircle2 className="size-3.5" />
                            Confirmer
                        </button>
                        <button
                            type="button"
                            onClick={() => onReject(demande)}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-100"
                        >
                            <XCircle className="size-3.5" />
                            Rejeter
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
}
