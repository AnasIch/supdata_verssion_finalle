import { motion } from "framer-motion";
import { LogIn, Clock, ShieldCheck, CalendarDays } from "lucide-react";

const stats = [
    { icon: LogIn, title: "Connexions", value: "1 247", color: "bg-blue-50 text-blue-600" },
    { icon: Clock, title: "Dernière activité", value: "Il y a 2h", color: "bg-amber-50 text-amber-600" },
    { icon: ShieldCheck, title: "Permissions", value: "8 / 12", color: "bg-purple-50 text-purple-600" },
    { icon: CalendarDays, title: "Ancienneté", value: "2 ans 6 mois", color: "bg-emerald-50 text-emerald-600" },
];

export default function UserStatsCards() {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
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
