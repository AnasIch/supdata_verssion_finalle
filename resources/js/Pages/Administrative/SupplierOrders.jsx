import { Head } from "@inertiajs/react";
import SupplierOrdersPanel from "@/Components/Administrative/SupplierOrdersPanel";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useAdministrativeSupplierOrders } from "@/Hooks/useAdministrativeSupplierOrders";
import { administrativeUser } from "@/Mocks/administrativeDashboard";

export default function AdministrativeApprovedRequestsPage({ approvedRequests, initialPagination, user: routeUser }) {
    const operations = useAdministrativeSupplierOrders(approvedRequests, initialPagination);

    return <DashboardLayout
        title="Demandes acceptées"
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard-administrative" },
            { label: "Demandes acceptées" },
        ]}
        user={routeUser || administrativeUser}
        showNotifications={false}
    >
        <Head title="Demandes acceptées — SUPDATA" />
        <SupplierOrdersPanel operations={operations} />
    </DashboardLayout>;
}
