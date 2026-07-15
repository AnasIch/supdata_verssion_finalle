import { useState } from "react";
import { Head } from "@inertiajs/react";
import { TooltipProvider } from "@/Components/UI/Tooltip";
import Sidebar from "@/Components/Layout/Sidebar";
import Header from "@/Components/Layout/Header";
import PageContainer from "@/Components/Layout/PageContainer";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children, title, breadcrumbs = [], user }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <TooltipProvider>
            <Head title={title ? `${title} — SUPDATA ERP` : "SUPDATA ERP"} />

            <div className="relative flex min-h-screen bg-[#f5f4f0]">
                <Sidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed(!collapsed)}
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                    user={user}
                />

                <div
                    className={cn(
                        "flex flex-1 flex-col transition-all duration-300",
                        collapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"
                    )}
                >
                    <Header
                        breadcrumbs={breadcrumbs}
                        user={user}
                        onMobileMenuOpen={() => setMobileOpen(true)}
                    />
                    <PageContainer>
                        {children}
                    </PageContainer>
                </div>
            </div>
        </TooltipProvider>
    );
}
