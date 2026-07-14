import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    return (
        <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            type="button"
            onClick={() => window.history.back()}
            className="fixed left-6 top-6 z-50 inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 sm:left-8 sm:top-8"
        >
            <ArrowLeft className="size-4" />
            Retour
        </motion.button>
    );
}
