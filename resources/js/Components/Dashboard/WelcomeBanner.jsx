import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export default function WelcomeBanner() {
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.15),transparent_60%)]" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">
                        Bienvenue sur SUPDATA ERP
                    </p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Bonjour, Super Admin
                    </h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="size-3.5" />
                        <span className="capitalize">{dateStr}</span>
                    </div>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                        Voici un aperçu de votre système. Gérez vos agences, utilisateurs et opérations depuis ce tableau de bord.
                    </p>
                </div>

                <a
                    href="/rapports"
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:shadow-lg hover:shadow-white/5"
                >
                    Voir les rapports
                    <ArrowRight className="size-4" />
                </a>
            </div>
        </motion.div>
    );
}
