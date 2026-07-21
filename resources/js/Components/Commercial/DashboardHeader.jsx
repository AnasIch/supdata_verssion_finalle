import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function DashboardHeader({ user }) {
    const name = user?.name || "Responsable Commercial";
    const agency = user?.agency || "—";
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.15),transparent_60%)]" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-teal-500/10 blur-2xl" />

            <div className="relative z-10">
                <p className="text-sm font-medium text-slate-400">
                    Dashboard Responsable Commercial
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span>{agency}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        <span className="capitalize">{dateStr}</span>
                    </span>
                </div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                    Suivez vos performances commerciales, devis et pipeline depuis ce tableau de bord.
                </p>
            </div>
        </motion.div>
    );
}
