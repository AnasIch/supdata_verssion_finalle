import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { setCurrentUser } from "@/lib/mockAuth";
import { useStockDashboard } from "@/Hooks/useStockDashboard";
import DashboardHeader from "@/Components/Stock/DashboardHeader";
import KpiCards from "@/Components/Stock/KpiCards";
import DashboardCharts from "@/Components/Stock/DashboardCharts";
import LowStockAlertsCard from "@/Components/Stock/LowStockAlertsCard";
import RecentMovementsCard from "@/Components/Stock/RecentMovementsCard";
import NotificationsCard from "@/Components/Stock/NotificationsCard";
import QuickActionsCard from "@/Components/Stock/QuickActionsCard";

export default function StockDashboard({ user }) {
    const {
        user: stockUser,
        kpiData,
        stockEvolutionData,
        categoryData,
        lowStockAlerts,
        recentMovements,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    } = useStockDashboard();

    useEffect(() => { setCurrentUser(user || stockUser); }, []);

    return (
        <DashboardLayout
            title="Dashboard Responsable Stock"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-super-admin" },
                { label: "Responsable Stock" },
            ]}
            user={user || stockUser}
        >
            <Head title="Dashboard Responsable Stock — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={stockUser} isRefreshing={isRefreshing} onRefresh={refresh} />

                <KpiCards data={kpiData} />

                <DashboardCharts evolutionData={stockEvolutionData} categoryData={categoryData} />

                <LowStockAlertsCard data={lowStockAlerts} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RecentMovementsCard data={recentMovements} />
                    <NotificationsCard data={importantNotifications} />
                </div>

                <QuickActionsCard data={quickActions} />
            </div>
        </DashboardLayout>
    );
}
