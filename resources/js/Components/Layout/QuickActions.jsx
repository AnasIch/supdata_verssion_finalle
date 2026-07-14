import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function QuickActions({ children, className = "" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
                "flex flex-wrap items-center gap-2",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
