import { motion } from "framer-motion";

export default function AuthHeader({ title, description }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mb-8 mt-6"
        >
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                {title}
            </h1>
            {description && (
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-500">
                    {description}
                </p>
            )}
        </motion.div>
    );
}
