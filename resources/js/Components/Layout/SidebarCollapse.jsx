import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SidebarCollapse({ collapsed, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700",
                collapsed && "justify-center px-0"
            )}
            aria-label={collapsed ? "Développer la sidebar" : "Réduire la sidebar"}
        >
            <motion.div
                animate={{ rotate: collapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <ChevronLeft className="size-[1.15rem] shrink-0" />
            </motion.div>
            {!collapsed && <span>Réduire</span>}
        </button>
    );
}
