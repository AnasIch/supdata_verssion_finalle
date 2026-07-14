import { motion } from "framer-motion";
import { User, Mail, Phone, Briefcase, Building2, BadgeCheck } from "lucide-react";

const fields = [
    { label: "Nom", key: "lastName", icon: User },
    { label: "Prénom", key: "firstName", icon: User },
    { label: "Email", key: "email", icon: Mail },
    { label: "Téléphone", key: "phone", icon: Phone },
    { label: "Fonction", key: "position", icon: Briefcase },
    { label: "Agence", key: "agency", icon: Building2 },
    { label: "Statut", key: "statusLabel", icon: BadgeCheck },
];

export default function UserInformationCard({ user }) {
    const info = {
        lastName: user.name.split(" ").slice(-1)[0],
        firstName: user.name.split(" ").slice(0, -1).join(" "),
        email: user.email,
        phone: user.phone,
        position: user.position,
        agency: user.agency,
        statusLabel: user.status === "active" ? "Actif" : user.status === "suspended" ? "Suspendu" : "Inactif",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Informations personnelles</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                    <div key={f.key} className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                            <f.icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-slate-500">{f.label}</p>
                            <p className="truncate text-sm font-medium text-slate-900">{info[f.key]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
