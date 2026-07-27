import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useLocalAdminDashboard } from "@/Hooks/useLocalAdminDashboard";
import DashboardHeader from "@/Components/LocalAdmin/DashboardHeader";
import KpiCards from "@/Components/LocalAdmin/KpiCards";
import DashboardCharts from "@/Components/LocalAdmin/DashboardCharts";
import LastDemandesCard from "@/Components/LocalAdmin/LastDemandesCard";

export default function LocalAdminDashboard({
    user,
    stats,
    evolutionData,
    decisionsData,
    lastDemandes,
    unreadNotifications,
}) {
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

                <DashboardCharts evolutionData={chartEvolution} decisionsData={chartDecisions} />

                <LastDemandesCard data={tableDemandes} />
            </div>
        </DashboardLayout>
    );
}
