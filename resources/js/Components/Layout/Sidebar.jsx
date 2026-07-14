import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Shield,
    Building2,
    BarChart3,
    FileText,
    Settings,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SupdataLogo from "@/Components/Common/SupdataLogo";
import SidebarGroup from "./SidebarGroup";
import SidebarFooter from "./SidebarFooter";

const mainNav = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

const managementNav = [
    { title: "Utilisateurs", href: "/utilisateurs", icon: Users },
    { title: "Rôles & Permissions", href: "/roles-permissions", icon: Shield },
    { title: "Agences", href: "/agences", icon: Building2 },
];

const systemNav = [
    { title: "Rapports & Analytics", href: "/rapports", icon: BarChart3 },
    { title: "Audit Logs", href: "/audit-logs", icon: FileText },
    { title: "Paramètres", href: "/parametres", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, user }) {
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const sidebarContent = (
        <div className="flex h-full flex-col">
            <div className={cn("flex items-center border-b border-slate-100 px-4 py-4", collapsed && "justify-center px-2")}>
                {collapsed ? (
                    <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 shadow-lg shadow-slate-900/20">
                        <svg viewBox="0 0 32 32" fill="none" className="size-4.5">
                            <rect x="6" y="6" width="9" height="9" rx="2" fill="white" opacity="0.9" />
                            <rect x="17" y="6" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                            <rect x="6" y="17" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                            <rect x="17" y="17" width="9" height="9" rx="2" fill="white" opacity="0.4" />
                        </svg>
                    </div>
                ) : (
                    <SupdataLogo size="xs" variant="dark" />
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-3">
                <SidebarGroup title="Principal" items={mainNav} collapsed={collapsed} startIndex={0} />
                <div className="my-2 border-t border-slate-100" />
                <SidebarGroup title="Gestion" items={managementNav} collapsed={collapsed} startIndex={mainNav.length} />
                <div className="my-2 border-t border-slate-100" />
                <SidebarGroup title="Système" items={systemNav} collapsed={collapsed} startIndex={mainNav.length + managementNav.length} />
            </nav>

            <SidebarFooter collapsed={collapsed} onToggle={onToggle} user={user} />
        </div>
    );

    return (
        <>
            <aside
                className={cn(
                    "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:bg-white lg:border-r lg:border-slate-200/80 lg:shadow-[2px_0_12px_rgb(0,0,0,0.03)] lg:transition-all lg:duration-300",
                    collapsed ? "lg:w-[80px]" : "lg:w-[280px]"
                )}
            >
                {sidebarContent}
            </aside>

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                            onClick={onMobileClose}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 350, damping: 35 }}
                            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl lg:hidden"
                        >
                            <button
                                onClick={onMobileClose}
                                className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                aria-label="Fermer le menu"
                            >
                                <X className="size-5" />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
