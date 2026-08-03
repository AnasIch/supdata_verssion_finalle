import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useLocalAdminDashboard } from "@/Hooks/useLocalAdminDashboard";
import { getDashboardPath } from "@/lib/mockAuth";
import DashboardHeader from "@/Components/LocalAdmin/DashboardHeader";
import KpiCards from "@/Components/LocalAdmin/KpiCards";
import LastDemandesCard from "@/Components/LocalAdmin/LastDemandesCard";
import DashboardCharts from "@/Components/LocalAdmin/DashboardCharts";
import NotificationsCard from "@/Components/LocalAdmin/NotificationsCard";
import QuickActionsCard from "@/Components/LocalAdmin/QuickActionsCard";

export default function LocalAdminDashboard({
    user,
    stats,
    evolutionData,
    decisionsData,
    lastDemandes,
    recentNotifications,
    unreadNotifications,
    quickActions,
}) {
    const basePath = getDashboardPath(user?.role);

    const {
        kpiData,
        evolutionData: chartEvolution,
        decisionsData: chartDecisions,
        lastDemandes: tableDemandes,
        isRefreshing,
        refresh,
    } = useLocalAdminDashboard({
        stats,
        evolutionData,
        decisionsData,
        lastDemandes,
        recentNotifications,
        unreadNotifications,
    });

    return (
        <DashboardLayout
            title="Dashboard Administrateur Local"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-admin-local" },
                { label: "Administrateur Local" },
            ]}
            user={user}
        >
            <Head title="Dashboard Administrateur Local — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={user} isRefreshing={isRefreshing} onRefresh={refresh} />

                <KpiCards data={kpiData} />

                <LastDemandesCard data={tableDemandes} basePath={basePath} />

                <DashboardCharts evolutionData={chartEvolution} decisionsData={chartDecisions} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <NotificationsCard data={recentNotifications} basePath={basePath} />
                    <QuickActionsCard data={quickActions} />
                </div>
            </div>
        </DashboardLayout>
    );
}
