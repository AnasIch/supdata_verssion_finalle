import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { setCurrentUser } from "@/lib/mockAuth";
import { useAdministrativeDashboard } from "@/Hooks/useAdministrativeDashboard";
import DashboardHeader from "@/Components/Administrative/DashboardHeader";
import KpiCards from "@/Components/Administrative/KpiCards";
import DashboardCharts from "@/Components/Administrative/DashboardCharts";
import PendingDocumentsCard from "@/Components/Administrative/PendingDocumentsCard";
import RecentActivityCard from "@/Components/Administrative/RecentActivityCard";
import NotificationsCard from "@/Components/Administrative/NotificationsCard";
import QuickActionsCard from "@/Components/Administrative/QuickActionsCard";

export default function AdministrativeDashboard({ user }) {
    const {
        user: adminUser,
        kpiData,
        documentsEvolutionData,
        conformityData,
        pendingDocuments,
        recentActivities,
        importantNotifications,
        quickActions,
        isRefreshing,
        refresh,
    } = useAdministrativeDashboard();

    useEffect(() => { setCurrentUser(user || adminUser); }, []);

    return (
        <DashboardLayout
            title="Dashboard Gestion Administrative"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-super-admin" },
                { label: "Gestion Administrative" },
            ]}
            user={user || adminUser}
        >
            <Head title="Dashboard Gestion Administrative — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={adminUser} isRefreshing={isRefreshing} onRefresh={refresh} />

                <KpiCards data={kpiData} />

                <DashboardCharts evolutionData={documentsEvolutionData} conformityData={conformityData} />

                <PendingDocumentsCard data={pendingDocuments} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RecentActivityCard data={recentActivities} />
                    <NotificationsCard data={importantNotifications} />
                </div>

                <QuickActionsCard data={quickActions} />
            </div>
        </DashboardLayout>
    );
}
