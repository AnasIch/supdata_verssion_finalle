import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import StockOperationsPanel from "@/Components/Stock/StockOperationsPanel";
import { useStockOperations } from "@/Hooks/useStockOperations";

export default function StockOperations({ section, initialItems, initialPagination, products, categories, agencies, user }) {
    const operations = useStockOperations(section, initialItems, initialPagination, { products, categories, agencies });
    return <DashboardLayout title={operations.config.titre} breadcrumbs={[{ label: "Dashboard", href: "/dashboard-stock" }, { label: operations.config.titre }]} user={user} showNotifications={false}><Head title={`${operations.config.titre} — SUPDATA`}/><StockOperationsPanel operations={operations}/></DashboardLayout>;
}
