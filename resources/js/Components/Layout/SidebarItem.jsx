import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/Components/UI/Tooltip";

export default function SidebarItem({ item, collapsed, index = 0 }) {
    const { url } = usePage();
    const isActive = url === item.href || url.startsWith(item.href + "/");
    const Icon = item.icon;

    const content = (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
        >
            <Link
                href={item.href}
                className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/5"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    collapsed && "justify-center px-0 py-2.5"
                )}
                aria-current={isActive ? "page" : undefined}
            >
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-blue-50 shadow-sm shadow-blue-500/5"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                )}
                <Icon
                    className={cn(
                        "relative z-10 size-[1.15rem] shrink-0 transition-colors duration-200",
                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    )}
                />
                {!collapsed && (
                    <span className="relative z-10 truncate">{item.title}</span>
                )}
                {isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-600" />
                )}
            </Link>
        </motion.div>
    );

    if (collapsed) {
        return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                        {item.title}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return content;
}
