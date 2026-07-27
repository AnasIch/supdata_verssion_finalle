import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import StockOperationsPanel from "@/Components/Stock/StockOperationsPanel";
import { useStockOperations } from "@/Hooks/useStockOperations";
import { stockUser } from "@/Mocks/stockDashboard";

export default function StockOperations({ section, initialItems, products, categories, agencies, user: routeUser }) {
    const operations = useStockOperations(section, initialItems, { products, categories, agencies });
    const user = routeUser || stockUser;
    return <DashboardLayout title={operations.config.titre} breadcrumbs={[{ label: "Dashboard", href: "/dashboard-stock" }, { label: operations.config.titre }]} user={user} showNotifications={false}><Head title={`${operations.config.titre} — SUPDATA`}/><StockOperationsPanel operations={operations}/></DashboardLayout>;
}
