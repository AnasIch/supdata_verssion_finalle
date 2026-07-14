import { motion } from "framer-motion";
import { LogIn, UserCog, Shield, UserPlus, BadgeCheck, Key } from "lucide-react";

const activities = [
    { icon: LogIn, title: "Connexion au système", detail: "Connexion depuis 192.168.1.42 — Chrome / macOS", time: "Aujourd'hui, 09:32", color: "bg-blue-50 text-blue-600" },
    { icon: UserCog, title: "Modification du profil", detail: "Numéro de téléphone mis à jour", time: "12 juil. 2026, 14:15", color: "bg-amber-50 text-amber-600" },
    { icon: Shield, title: "Changement de rôle", detail: "Promu de Admin à Super Admin", time: "1 jul. 2026, 10:00", color: "bg-purple-50 text-purple-600" },
    { icon: UserPlus, title: "Création d'un utilisateur", detail: "Compte de Fatima Zahra Benani créé", time: "3 mar. 2026, 11:22", color: "bg-indigo-50 text-indigo-600" },
    { icon: BadgeCheck, title: "Activation du compte", detail: "Compte activé par l'administrateur", time: "12 jan. 2024, 08:45", color: "bg-emerald-50 text-emerald-600" },
    { icon: Key, title: "Réinitialisation du mot de passe", detail: "Mot de passe réinitialisé via email", time: "15 nov. 2025, 16:30", color: "bg-cyan-50 text-cyan-600" },
];

export default function UserActivityTimeline() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Activité récente</h3>
            <div className="relative">
                <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                <div className="flex flex-col gap-4">
                    {activities.map((a, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.35 + i * 0.06 }}
                            className="relative flex items-start gap-3"
                        >
                            <div className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${a.color}`}>
                                <a.icon className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-slate-900">{a.title}</p>
                                <p className="text-xs text-slate-500">{a.detail}</p>
                            </div>
                            <span className="shrink-0 text-xs text-slate-400">{a.time}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
