import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { setCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import DashboardHeader from "@/Components/Commercial/DashboardHeader";
import KpiCards from "@/Components/Commercial/KpiCards";
import DashboardCharts from "@/Components/Commercial/DashboardCharts";
import RecentActivityCard from "@/Components/Commercial/RecentActivityCard";
import QuickActionsCard from "@/Components/Commercial/QuickActionsCard";

export default function CommercialDashboard({ user, stats, evolution, activity }) {
    useEffect(() => { setCurrentUser(user); }, [user]);

    return (
        <DashboardLayout
            title="Dashboard Responsable Commercial"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user?.role || "Responsable Commercial") },
                { label: "Responsable Commercial" },
            ]}
            user={user}
        >
            <Head title="Dashboard Responsable Commercial — SUPDATA" />
            <div className="flex flex-col gap-6">
                <DashboardHeader user={user} />

                <KpiCards stats={stats} />

                <DashboardCharts evolutionData={evolution} />

                <RecentActivityCard data={activity} />

                <QuickActionsCard />
            </div>
        </DashboardLayout>
    );
}
