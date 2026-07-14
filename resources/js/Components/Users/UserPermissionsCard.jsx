import { motion } from "framer-motion";
import { Check } from "lucide-react";

const permissions = [
    "Créer utilisateur",
    "Modifier utilisateur",
    "Supprimer utilisateur",
    "Consulter rapports",
    "Gérer permissions",
    "Gérer agences",
    "Gérer les stocks",
    "Approuver demandes",
];

export default function UserPermissionsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Permissions</h3>
            <div className="flex flex-wrap gap-2">
                {permissions.map((perm, i) => (
                    <motion.span
                        key={perm}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: 0.3 + i * 0.04 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                    >
                        <Check className="size-3" />
                        {perm}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
}
