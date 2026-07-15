import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useLocalAdminReports } from "@/Hooks/useLocalAdminReports";
import ReportsHeader from "@/Components/LocalAdmin/Reports/ReportsHeader";
import ReportKpis from "@/Components/LocalAdmin/Reports/ReportKpis";
import PeriodFilter from "@/Components/LocalAdmin/Reports/PeriodFilter";
import ExportButtons from "@/Components/LocalAdmin/Reports/ExportButtons";
import DemandesEvolutionChart from "@/Components/LocalAdmin/Reports/DemandesEvolutionChart";
import DecisionsChart from "@/Components/LocalAdmin/Reports/DecisionsChart";
import StockByCategoryChart from "@/Components/LocalAdmin/Reports/StockByCategoryChart";
import StockStatusChart from "@/Components/LocalAdmin/Reports/StockStatusChart";

export default function LocalAdminReports() {
    const user = getCurrentUser();
    const {
        kpis,
        demandesEvolution,
        decisionsBreakdown,
        stockByCategory,
        stockStatusBreakdown,
        periodOptions,
        period,
        setPeriod,
        isRefreshing,
        refresh,
    } = useLocalAdminReports();

    return (
        <DashboardLayout
            title="Rapports — Agence"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Rapports" },
            ]}
            user={user}
        >
            <Head title="Rapports — Agence Casablanca — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ReportsHeader isRefreshing={isRefreshing} onRefresh={refresh} />
                </motion.div>

                <ReportKpis data={kpis} />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PeriodFilter
                        options={periodOptions}
                        value={period}
                        onChange={setPeriod}
                    />
                    <ExportButtons />
                </motion.div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <DemandesEvolutionChart data={demandesEvolution} />
                    </div>
                    <DecisionsChart data={decisionsBreakdown} />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <StockByCategoryChart data={stockByCategory} />
                    <StockStatusChart data={stockStatusBreakdown} />
                </div>
            </div>
        </DashboardLayout>
    );
}
