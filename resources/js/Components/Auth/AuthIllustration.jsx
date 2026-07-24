import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AuthIllustration() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-xl"
        >
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)]"
            >
                <div className="flex h-[340px] items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 p-6 sm:p-8">
                    <div className="flex w-full max-w-[460px] items-center justify-center rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-8">
                        <img
                            src="/supdata-logo.png"
                            alt="Illustration Supdata"
                            className="max-h-[240px] w-full object-contain"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="absolute -bottom-4 -right-4 rounded-xl border border-slate-200/60 bg-white p-3 shadow-lg"
            >
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[0.7rem] font-semibold text-slate-800">ERP SUPDATA</p>
                        <p className="text-[0.55rem] text-slate-500">Gestion achats · stock · clients</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
