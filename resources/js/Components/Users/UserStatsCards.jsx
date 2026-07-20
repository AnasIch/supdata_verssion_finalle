import { motion } from "framer-motion";
import { Clock, CalendarDays } from "lucide-react";

function formatRelativeTime(isoString) {
    if (!isoString) return "—";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);
    const diffM = Math.floor(diffD / 30);
    const diffY = Math.floor(diffD / 365);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    if (diffD < 30) return `Il y a ${diffD}j`;
    if (diffM < 12) return `Il y a ${diffM} mois`;
    return `Il y a ${diffY} an${diffY > 1 ? "s" : ""}`;
}

export default function UserStatsCards({ user }) {
    const items = [
        {
            icon: Clock,
            title: "Dernière connexion",
            value: formatRelativeTime(user?.lastLoginRaw),
            color: "bg-blue-50 text-blue-600",
        },
        {
            icon: CalendarDays,
            title: "Ancienneté",
            value: formatRelativeTime(user?.createdAtRaw),
            color: "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {items.map((s, i) => (
                <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)] transition-shadow hover:shadow-[0_6px_20px_rgb(0,0,0,0.06)]"
                >
                    <div className={`flex size-10 items-center justify-center rounded-xl ${s.color}`}>
                        <s.icon className="size-5" />
                    </div>
                    <div className="mt-3">
                        <p className="text-xl font-bold tracking-tight text-slate-900">{s.value}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{s.title}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
