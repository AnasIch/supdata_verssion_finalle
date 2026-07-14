import { motion } from "framer-motion";
import { Badge } from "@/Components/UI/Badge";
import { cn } from "@/lib/utils";

const users = [
    { name: "Youssef Alami", role: "Admin", agency: "Casablanca", status: "active", initials: "YA" },
    { name: "Fatima Zahra", role: "Gestionnaire", agency: "Marrakech", status: "active", initials: "FZ" },
    { name: "Omar Benani", role: "Technicien", agency: "Rabat", status: "active", initials: "OB" },
    { name: "Sara Idrissi", role: "Gestionnaire", agency: "Tanger", status: "inactive", initials: "SI" },
    { name: "Karim Tazi", role: "Admin", agency: "Fès", status: "active", initials: "KT" },
];

const statusStyles = {
    active: "bg-emerald-50 text-emerald-700",
    inactive: "bg-slate-100 text-slate-500",
};

export default function RecentUsers() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.45 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Derniers utilisateurs</h3>
                <p className="text-xs text-slate-500">5 utilisateurs récents</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-2 pr-4 font-medium text-slate-500">Nom</th>
                            <th className="pb-2 pr-4 font-medium text-slate-500">Rôle</th>
                            <th className="pb-2 pr-4 font-medium text-slate-500">Agence</th>
                            <th className="pb-2 font-medium text-slate-500">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.name} className="border-b border-slate-50 last:border-0">
                                <td className="py-2.5 pr-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                            {u.initials}
                                        </div>
                                        <span className="font-medium text-slate-900">{u.name}</span>
                                    </div>
                                </td>
                                <td className="py-2.5 pr-4 text-slate-600">{u.role}</td>
                                <td className="py-2.5 pr-4 text-slate-600">{u.agency}</td>
                                <td className="py-2.5">
                                    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", statusStyles[u.status])}>
                                        {u.status === "active" ? "Actif" : "Inactif"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
