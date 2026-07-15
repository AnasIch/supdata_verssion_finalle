import { motion } from "framer-motion";
import { LogIn, Clock, Activity, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultStats = [
    {
        label: "Connexions",
        value: "347",
        icon: LogIn,
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        label: "Dernière connexion",
        value: "09:45",
        sublabel: "Aujourd'hui",
        icon: Clock,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        label: "Temps moyen",
        value: "42 min",
        sublabel: "par session",
        icon: Activity,
        color: "text-violet-600",
        bg: "bg-violet-50",
    },
    {
        label: "Dernière activité",
        value: "12 min",
        sublabel: "il y a",
        icon: Clock3,
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProfileStatistics({ profileStats }) {
    const stats = profileStats
        ? [
              { ...defaultStats[0], value: String(profileStats.totalLogins) },
              { ...defaultStats[1], value: profileStats.lastLogin?.split(" ")[1] || "09:45" },
              { ...defaultStats[2], value: profileStats.avgSessionDuration },
              { ...defaultStats[3], value: profileStats.lastActivity?.replace("Il y a ", "") || "12 min" },
          ]
        : defaultStats;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
            {stats.map((stat) => (
                <motion.div
                    key={stat.label}
                    variants={item}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                    <div
                        className={cn(
                            "flex size-11 items-center justify-center rounded-xl",
                            stat.bg
                        )}
                    >
                        <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                        <p className="text-lg font-bold text-slate-900">
                            {stat.value}
                        </p>
                        {stat.sublabel && (
                            <p className="text-[10px] text-slate-400">
                                {stat.sublabel}
                            </p>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
