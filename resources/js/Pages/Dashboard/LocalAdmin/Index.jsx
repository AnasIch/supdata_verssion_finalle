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

export default function LocalAdminDashboard({ user }) {
    const {
        user: localUser,
        kpiData,
        demandesEvolutionData,
        decisionsData,
        pendingRequests,
        recentActivities,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    } = useLocalAdminDashboard();

    useEffect(() => { setCurrentUser(user || localUser); }, []);

    return (
        <DashboardLayout
            title="Dashboard Administrateur Local"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user?.role || "Administrateur Local") },
                { label: "Administrateur Local" },
            ]}
            user={user || localUser}
        >
            <Head title="Dashboard Administrateur Local — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={localUser} isRefreshing={isRefreshing} onRefresh={refresh} />

                <KpiCards data={kpiData} />

                <DashboardCharts evolutionData={demandesEvolutionData} decisionsData={decisionsData} />

                <PendingRequestsCard data={pendingRequests} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RecentActivityCard data={recentActivities} />
                    <NotificationsCard data={importantNotifications} />
                </div>

                <QuickActionsCard data={quickActions} />
            </div>
        </DashboardLayout>
    );
}
