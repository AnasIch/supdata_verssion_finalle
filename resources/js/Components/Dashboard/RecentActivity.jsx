import { motion } from "framer-motion";
import { UserPlus, Building2, ShieldCheck, LogIn } from "lucide-react";

const activities = [
    { icon: UserPlus, text: "Nouvel utilisateur ajouté", detail: "Youssef Alami — Agence Casablanca", time: "Il y a 12 min", color: "bg-blue-50 text-blue-600" },
    { icon: Building2, text: "Nouvelle agence créée", detail: "Agence Tanger", time: "Il y a 1h", color: "bg-indigo-50 text-indigo-600" },
    { icon: ShieldCheck, text: "Permission modifiée", detail: "Rôle « Gestionnaire » mis à jour", time: "Il y a 2h", color: "bg-amber-50 text-amber-600" },
    { icon: LogIn, text: "Connexion administrateur", detail: "admin@supdata.ma — IP 192.168.1.42", time: "Il y a 3h", color: "bg-emerald-50 text-emerald-600" },
    { icon: UserPlus, text: "Nouvel utilisateur ajouté", detail: "Fatima Zahra — Agence Marrakech", time: "Il y a 5h", color: "bg-blue-50 text-blue-600" },
    { icon: Building2, text: "Agence mise à jour", detail: "Responsable changé — Agence Rabat", time: "Hier", color: "bg-indigo-50 text-indigo-600" },
];

export default function RecentActivity() {
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
                <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                <div className="flex flex-col gap-4">
                    {activities.map((a, i) => (
                        <div key={i} className="relative flex items-start gap-3">
                            <div className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${a.color}`}>
                                <a.icon className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-slate-900">{a.text}</p>
                                <p className="text-xs text-slate-500">{a.detail}</p>
                            </div>
                            <span className="shrink-0 text-xs text-slate-400">{a.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
