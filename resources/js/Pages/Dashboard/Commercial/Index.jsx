import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { setCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useCommercialDashboard } from "@/Hooks/useCommercialDashboard";
import DashboardHeader from "@/Components/Commercial/DashboardHeader";
import KpiCards from "@/Components/Commercial/KpiCards";
import DashboardCharts from "@/Components/Commercial/DashboardCharts";
import RecentActivityCard from "@/Components/Commercial/RecentActivityCard";
import QuickActionsCard from "@/Components/Commercial/QuickActionsCard";

export default function CommercialDashboard({ user }) {
    const {
        user: commercialUser,
        kpiData,
        demandesEvolutionData,
        recentActivities,
        quickActions,
        isRefreshing,
        refresh,
    } = useCommercialDashboard();

    useEffect(() => { setCurrentUser(user || commercialUser); }, []);

    return (
        <DashboardLayout
            title="Dashboard Responsable Commercial"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user?.role || "Responsable Commercial") },
                { label: "Responsable Commercial" },
            ]}
            user={user || commercialUser}
        >
            <Head title="Dashboard Responsable Commercial — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={commercialUser} isRefreshing={isRefreshing} onRefresh={refresh} />

                <KpiCards data={kpiData} />

                <DashboardCharts evolutionData={demandesEvolutionData} />

                <RecentActivityCard data={recentActivities} />

                <QuickActionsCard data={quickActions} />
            </div>
        </DashboardLayout>
    );
}
