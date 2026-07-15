import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import WelcomeBanner from "@/Components/Dashboard/WelcomeBanner";
import DashboardStats from "@/Components/Dashboard/DashboardStats";
import DashboardCharts from "@/Components/Dashboard/DashboardCharts";
import SystemOverview from "@/Components/Dashboard/SystemOverview";
import RecentActivity from "@/Components/Dashboard/RecentActivity";
import RecentUsers from "@/Components/Dashboard/RecentUsers";
import RecentPurchaseRequests from "@/Components/Dashboard/RecentPurchaseRequests";
import AgencyStatus from "@/Components/Dashboard/AgencyStatus";
import QuickActionsCard from "@/Components/Dashboard/QuickActionsCard";

export default function Dashboard({ user }) {
    return (
        <DashboardLayout
            title="Dashboard"
            breadcrumbs={[{ label: "Dashboard" }]}
            user={user}
        >
            <Head title="Dashboard — SUPDATA" />
            <div className="flex flex-col gap-6">
                <WelcomeBanner />

                <DashboardStats />

                <DashboardCharts />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RecentUsers />
                    </div>
                    <QuickActionsCard />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RecentPurchaseRequests />
                    </div>
                    <AgencyStatus />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RecentActivity />
                    <SystemOverview />
                </div>
            </div>
        </DashboardLayout>
    );
}
