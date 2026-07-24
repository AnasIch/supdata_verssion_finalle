import { motion } from "framer-motion";
import { ShieldOff } from "lucide-react";

export default function UserPermissionsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Permissions</h3>
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <ShieldOff className="size-6" />
                </div>
                <p className="text-sm text-slate-500">Aucun système de permissions configuré.</p>
                <p className="text-xs text-slate-400">Les permissions seront disponibles prochainement.</p>
            </div>
        </motion.div>
    );
}
