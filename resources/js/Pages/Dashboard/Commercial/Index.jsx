import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { setCurrentUser } from "@/lib/mockAuth";
import { useCommercialDashboard } from "@/Hooks/useCommercialDashboard";
import DashboardHeader from "@/Components/Commercial/DashboardHeader";
import KpiCards from "@/Components/Commercial/KpiCards";
import DashboardCharts from "@/Components/Commercial/DashboardCharts";
import PendingQuotesCard from "@/Components/Commercial/PendingQuotesCard";
import RecentActivityCard from "@/Components/Commercial/RecentActivityCard";
import NotificationsCard from "@/Components/Commercial/NotificationsCard";
import QuickActionsCard from "@/Components/Commercial/QuickActionsCard";

export default function CommercialDashboard({ user }) {
    const {
        user: commercialUser,
        kpiData,
        revenueEvolutionData,
        performanceData,
        pendingQuotes,
        recentActivities,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    } = useCommercialDashboard();

    useEffect(() => { setCurrentUser(user || commercialUser); }, []);

    return (
        <DashboardLayout
            title="Dashboard Responsable Commercial"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-super-admin" },
                { label: "Responsable Commercial" },
            ]}
            user={user || commercialUser}
        >
            <Head title="Dashboard Responsable Commercial — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={commercialUser} isRefreshing={isRefreshing} onRefresh={refresh} />

                <KpiCards data={kpiData} />

                <DashboardCharts revenueData={revenueEvolutionData} performanceData={performanceData} />

                <PendingQuotesCard data={pendingQuotes} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RecentActivityCard data={recentActivities} />
                    <NotificationsCard data={importantNotifications} />
                </div>

                <QuickActionsCard data={quickActions} />
            </div>
        </DashboardLayout>
    );
}
