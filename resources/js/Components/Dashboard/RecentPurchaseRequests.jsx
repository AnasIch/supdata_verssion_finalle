import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const requests = [
    { ref: "DA-2024-001", agency: "Casablanca", date: "14 juil. 2026", status: "pending" },
    { ref: "DA-2024-002", agency: "Marrakech", date: "13 juil. 2026", status: "approved" },
    { ref: "DA-2024-003", agency: "Rabat", date: "12 juil. 2026", status: "rejected" },
    { ref: "DA-2024-004", agency: "Tanger", date: "12 juil. 2026", status: "pending" },
    { ref: "DA-2024-005", agency: "Fès", date: "11 juil. 2026", status: "approved" },
];

const statusConfig = {
    pending: { label: "En attente", style: "bg-amber-50 text-amber-700" },
    approved: { label: "Approuvée", style: "bg-emerald-50 text-emerald-700" },
    rejected: { label: "Rejetée", style: "bg-red-50 text-red-600" },
};

export default function RecentPurchaseRequests() {
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
                            <th className="pb-2 pr-4 font-medium text-slate-500">Référence</th>
                            <th className="pb-2 pr-4 font-medium text-slate-500">Agence</th>
                            <th className="pb-2 pr-4 font-medium text-slate-500">Date</th>
                            <th className="pb-2 font-medium text-slate-500">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((r) => {
                            const s = statusConfig[r.status];
                            return (
                                <tr key={r.ref} className="border-b border-slate-50 last:border-0">
                                    <td className="py-2.5 pr-4 font-mono text-xs font-medium text-slate-900">{r.ref}</td>
                                    <td className="py-2.5 pr-4 text-slate-600">{r.agency}</td>
                                    <td className="py-2.5 pr-4 text-slate-500">{r.date}</td>
                                    <td className="py-2.5">
                                        <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", s.style)}>
                                            {s.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
