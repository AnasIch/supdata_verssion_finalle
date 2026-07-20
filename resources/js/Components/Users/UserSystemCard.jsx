import { motion } from "framer-motion";
import { Hash, Shield, Building2, Calendar, Clock, BadgeCheck } from "lucide-react";

export default function UserSystemCard({ user }) {
    const items = [
        { label: "Identifiant", value: `ID-${String(user?.id ?? 0).padStart(5, "0")}`, icon: Hash },
        { label: "Rôle", value: user?.role ?? "—", icon: Shield },
        { label: "Agence", value: user?.agency ?? "—", icon: Building2 },
        { label: "Compte créé le", value: user?.createdAt ?? "—", icon: Calendar },
        { label: "Dernière connexion", value: user?.lastLogin ?? "—", icon: Clock },
        { label: "Statut", value: user?.status === "active" ? "Actif" : "Inactif", icon: BadgeCheck, badge: user?.status === "active" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Informations système</h3>
            <div className="flex flex-col gap-3">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                    >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                            <item.icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="text-sm font-medium text-slate-900">{item.value}</p>
                        </div>
                        {item.badge && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                <span className="size-1.5 rounded-full bg-emerald-400" />
                                En ligne
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}