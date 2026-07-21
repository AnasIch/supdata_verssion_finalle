import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import AdministrativeWorkspace from "@/Components/Administrative/AdministrativeWorkspace";
import { useAdministrativeDashboard } from "@/Hooks/useAdministrativeDashboard";
import { setCurrentUser } from "@/lib/mockAuth";

export default function AdministrativeDashboard({ user }) {
    const dashboard = useAdministrativeDashboard();
    const currentUser = user || dashboard.user;
    useEffect(() => { setCurrentUser(currentUser); }, [currentUser]);
    return <DashboardLayout title="Gestion administrative" breadcrumbs={[{ label: "Gestion administrative" }, { label: "Vue d’ensemble" }]} user={currentUser} showNotifications={false}><Head title="Gestion administrative — SUPDATA"/><AdministrativeWorkspace dashboard={{ ...dashboard, user: currentUser }}/></DashboardLayout>;
}
