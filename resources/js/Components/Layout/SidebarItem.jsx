import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/Components/UI/Tooltip";

function isItemActive(url, item) {
    if (!item.slug) {
        return url === item.href;
    }
    if (item.exact) {
        return url === item.href || url === `/${item.slug}`;
    }
    return (
        url === item.href ||
        url.startsWith(item.href + "/") ||
        url === `/${item.slug}` ||
        url.startsWith(`/${item.slug}/`)
    );
}

export default function SidebarItem({ item, collapsed, index = 0 }) {
    const { url } = usePage();
    const isActive = isItemActive(url, item);
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
                    "group relative flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2 text-[13px] transition-all duration-200",
                    isActive
                        ? "border-blue-600 bg-blue-50/80 font-semibold text-blue-700"
                        : "border-transparent font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                    collapsed && "justify-center border-l-0 px-0 py-2.5"
                )}
                aria-current={isActive ? "page" : undefined}
            >
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-blue-50/80"
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
