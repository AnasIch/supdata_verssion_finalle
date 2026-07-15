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
    const isActive = item.exact ? url === item.href : url === item.href || url.startsWith(item.href + "/");
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
                    "group relative flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                    isActive
                        ? "border-blue-700 bg-slate-100 text-slate-950"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                    collapsed && "justify-center border-l-0 px-0 py-2.5"
                )}
                aria-current={isActive ? "page" : undefined}
            >
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-md bg-slate-100"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                )}
                <Icon
                    className={cn(
                        "relative z-10 size-[1.15rem] shrink-0 transition-colors duration-200",
                        isActive ? "text-blue-700" : "text-slate-400 group-hover:text-slate-700"
                    )}
                />
                {!collapsed && (
                    <span className="relative z-10 truncate">{item.title}</span>
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
