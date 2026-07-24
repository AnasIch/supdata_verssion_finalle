import { motion } from "framer-motion";
import {
    LogIn,
    UserCog,
    KeyRound,
    UserPlus,
    Building2,
    BarChart3,
    Settings,
} from "lucide-react";
import { Badge } from "@/Components/UI/Badge";
import { cn } from "@/lib/utils";

const iconMap = {
    login: LogIn,
    profile: UserCog,
    password: KeyRound,
    user: UserPlus,
    agency: Building2,
    report: BarChart3,
    settings: Settings,
};

const colorMap = {
    login: "bg-blue-50 text-blue-600 ring-blue-100",
    profile: "bg-violet-50 text-violet-600 ring-violet-100",
    password: "bg-amber-50 text-amber-600 ring-amber-100",
    user: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    agency: "bg-cyan-50 text-cyan-600 ring-cyan-100",
    report: "bg-rose-50 text-rose-600 ring-rose-100",
    settings: "bg-slate-100 text-slate-600 ring-slate-200",
};

const badgeVariant = {
    login: "info",
    profile: "default",
    password: "warning",
    user: "success",
    agency: "info",
    report: "default",
    settings: "secondary",
};

const typeLabel = {
    login: "Connexion",
    profile: "Profil",
    password: "Sécurité",
    user: "Utilisateur",
    agency: "Agence",
    report: "Rapport",
    settings: "Paramètres",
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function ProfileActivity({ activities }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6"
        >
            <h3 className="text-base font-semibold text-slate-900">
                Activité récente
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
                Historique de vos dernières actions
            </p>

            <div className="mt-6 relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100" />

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-0"
                >
                    {activities.map((activity, i) => {
                        const Icon = iconMap[activity.icon] || LogIn;
                        return (
                            <motion.div
                                key={activity.id}
                                variants={item}
                                className="relative flex gap-4 pb-6 pl-2"
                            >
                                <div
                                    className={cn(
                                        "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full ring-4",
                                        colorMap[activity.type] || "bg-slate-100 text-slate-500 ring-slate-100"
                                    )}
                                >
                                    <Icon size={16} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-slate-900">
                                                {activity.action}
                                            </p>
                                            <Badge
                                                variant={badgeVariant[activity.type] || "secondary"}
                                                className="text-[10px]"
                                            >
                                                {typeLabel[activity.type] || activity.type}
                                            </Badge>
                                        </div>
                                        <span className="shrink-0 text-xs text-slate-400">
                                            {activity.timestamp}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {activity.description}
                                    </p>
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        IP: {activity.ip}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
}
