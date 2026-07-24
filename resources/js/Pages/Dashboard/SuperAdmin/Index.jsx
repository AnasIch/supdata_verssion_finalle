import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { setCurrentUser } from "@/lib/mockAuth";
import WelcomeBanner from "@/Components/Dashboard/WelcomeBanner";
import DashboardStats from "@/Components/Dashboard/DashboardStats";
import DashboardCharts from "@/Components/Dashboard/DashboardCharts";
import SystemOverview from "@/Components/Dashboard/SystemOverview";
import RecentActivity from "@/Components/Dashboard/RecentActivity";
import RecentUsers from "@/Components/Dashboard/RecentUsers";
import RecentDemandes from "@/Components/Dashboard/RecentDemandes";
import AgencyStatus from "@/Components/Dashboard/AgencyStatus";
import QuickActionsCard from "@/Components/Dashboard/QuickActionsCard";

export default function Dashboard({ user, stats, recentUsers, recentDemandes, agencyStats, recentActivity, charts }) {
    useEffect(() => { setCurrentUser(user); }, [user]);
    return (
        <DashboardLayout
            title="Dashboard"
            breadcrumbs={[{ label: "Dashboard" }]}
            user={user}
        >
            <Head title="Dashboard — SUPDATA" />
            <div className="flex flex-col gap-6">
                <WelcomeBanner user={user} />

                <DashboardStats stats={stats} />

                <DashboardCharts charts={charts} agencyStats={agencyStats} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RecentUsers users={recentUsers} />
                    </div>
                    <QuickActionsCard />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <RecentDemandes demandes={recentDemandes} />
                    </div>
                    <AgencyStatus agencies={agencyStats} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <RecentActivity activity={recentActivity} />
                    <SystemOverview stats={stats} />
                </div>
            </div>
        </DashboardLayout>
    );
}
