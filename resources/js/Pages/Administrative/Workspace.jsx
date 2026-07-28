import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import AdministrativeOperationsPanel from "@/Components/Administrative/AdministrativeOperationsPanel";
import { useAdministrativeOperations } from "@/Hooks/useAdministrativeOperations";
import { administrativeUser } from "@/Mocks/administrativeDashboard";

export default function AdministrativeWorkspacePage({ section, initialItems, initialPagination, user: routeUser }) {
    const operations = useAdministrativeOperations(section, initialItems, initialPagination);
    const user = routeUser || administrativeUser;
    return <DashboardLayout title={operations.config.titre} breadcrumbs={[{ label: "Dashboard", href: "/dashboard-administrative" }, { label: operations.config.titre }]} user={user} showNotifications={false}><Head title={`${operations.config.titre} — SUPDATA`}/><AdministrativeOperationsPanel operations={operations}/></DashboardLayout>;
}
