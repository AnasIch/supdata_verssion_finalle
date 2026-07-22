import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { setCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useLocalAdminDashboard } from "@/Hooks/useLocalAdminDashboard";
import DashboardHeader from "@/Components/LocalAdmin/DashboardHeader";
import KpiCards from "@/Components/LocalAdmin/KpiCards";
import DashboardCharts from "@/Components/LocalAdmin/DashboardCharts";
import PendingRequestsCard from "@/Components/LocalAdmin/PendingRequestsCard";
import RecentActivityCard from "@/Components/LocalAdmin/RecentActivityCard";
import NotificationsCard from "@/Components/LocalAdmin/NotificationsCard";
import QuickActionsCard from "@/Components/LocalAdmin/QuickActionsCard";

export default function LocalAdminDashboard({
    user,
    stats,
    evolutionData,
    decisionsData,
    pendingDemandes,
    recentActivity,
    importantNotifications,
    unreadNotifications,
}) {
    const {
        kpiData,
        evolutionData: chartEvolution,
        decisionsData: chartDecisions,
        pendingDemandes: tablePending,
        recentActivity: activity,
        importantNotifications: notifications,
        quickActions,
        isRefreshing,
        refresh,
    } = useLocalAdminDashboard({
        stats: { ...stats, unreadNotifications },
        evolutionData,
        decisionsData,
        pendingDemandes,
        recentActivity,
        importantNotifications,
    });

    useEffect(() => { setCurrentUser(user); }, []);

    return (
        <DashboardLayout
            title="Dashboard Administrateur Local"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user?.role || "admin_local") },
                { label: "Administrateur Local" },
            ]}
            user={user}
        >
            <Head title="Dashboard Administrateur Local — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={user} isRefreshing={isRefreshing} onRefresh={refresh} />

                <KpiCards data={kpiData} />

                <DashboardCharts evolutionData={chartEvolution} decisionsData={chartDecisions} />

                <PendingRequestsCard data={tablePending} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RecentActivityCard data={activity} />
                    <NotificationsCard data={notifications} />
                </div>

                <QuickActionsCard data={quickActions} />
            </div>
        </DashboardLayout>
    );
}
