import { motion } from "framer-motion";

export default function AuthCard({ children, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`w-full rounded-2xl border border-slate-200/70 bg-white p-8 pb-10 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)] sm:p-10 sm:pb-12 ${className}`}
        >
            {children}
        </motion.div>
    );
}
