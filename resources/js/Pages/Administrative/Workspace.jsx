import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import AdministrativeOperationsPanel from "@/Components/Administrative/AdministrativeOperationsPanel";
import { useAdministrativeOperations } from "@/Hooks/useAdministrativeOperations";
import { administrativeUser } from "@/Mocks/administrativeDashboard";

export default function AdministrativeWorkspacePage({ section }) {
    const operations = useAdministrativeOperations(section);
    const user = administrativeUser;
    return <DashboardLayout title={operations.config.titre} breadcrumbs={[{ label: "Dashboard", href: "/dashboard-administrative" }, { label: operations.config.titre }]} user={user} showNotifications={false}><Head title={`${operations.config.titre} — SUPDATA`}/><AdministrativeOperationsPanel operations={operations}/></DashboardLayout>;
}
