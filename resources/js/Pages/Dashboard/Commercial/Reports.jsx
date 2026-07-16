import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { RefreshCw, ShoppingCart, Package, BarChart3, Clock } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useCommercialReports } from "@/Hooks/useCommercialReports";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import KpiCard from "@/Components/Charts/KpiCard";
import ChartCard from "@/Components/Charts/ChartCard";
import AreaChart from "@/Components/Charts/AreaChart";
import BarChart from "@/Components/Charts/BarChart";
import PieChart from "@/Components/Charts/PieChart";
const typeStyles = {
    demande: "bg-blue-50 text-blue-600",
    reservation: "bg-violet-50 text-violet-600",
    validation: "bg-emerald-50 text-emerald-600",
    refus: "bg-red-50 text-red-600",
};

const kpiIcons = {
    totalDemandes: ShoppingCart,
    validated: Package,
    totalReservations: Package,
    pending: Clock,
    rejected: Package,
    avgProcessing: Clock,
};

export default function CommercialReports() {
    const user = getCurrentUser();
    const {
        kpis,
        demandesEvolution,
        reservationsByMonth,
        demandesByAgency,
        topProducts,
        recentActivities,
        periodOptions,
        period,
        setPeriod,
        isRefreshing,
        refresh,
    } = useCommercialReports();

    return (
        <DashboardLayout
            title="Rapports Commerciaux"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Rapports" },
            ]}
            user={user}
        >
            <Head title="Rapports Commerciaux — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Rapports Commerciaux
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Suivi des demandes d'achat, réservations et activités commerciales
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
                            Actualiser
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {kpis.map((kpi, i) => (
                        <KpiCard
                            key={kpi.id}
                            icon={kpiIcons[kpi.id] || ShoppingCart}
                            label={kpi.label}
                            value={kpi.value}
                            unit={kpi.unit}
                            trend={kpi.trend}
                            trendUp={kpi.trendUp}
                            description={kpi.description}
                            color={kpi.color}
                            delay={i * 0.05}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="flex flex-wrap gap-2"
                >
                    {periodOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setPeriod(opt.value)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                period === opt.value
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <ChartCard
                            title="Évolution mensuelle des demandes"
                            description="Demandes créées, validées et refusées"
                            delay={0.2}
                        >
                            <AreaChart
                                data={demandesEvolution}
                                xKey="mois"
                                areas={[
                                    { dataKey: "demandes", color: "#3b82f6", name: "Demandes" },
                                    { dataKey: "validees", color: "#10b981", name: "Validées" },
                                    { dataKey: "refusees", color: "#ef4444", name: "Refusées" },
                                ]}
                                height={280}
                            />
                        </ChartCard>
                    </div>
                    <ChartCard
                        title="Répartition par agence"
                        description="Demandes par agence"
                        delay={0.25}
                    >
                        <PieChart
                            data={demandesByAgency}
                            height={280}
                            innerRadius={50}
                            outerRadius={80}
                        />
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <ChartCard
                        title="Évolution des réservations"
                        description="Réservations créées et confirmées"
                        delay={0.3}
                    >
                        <AreaChart
                            data={reservationsByMonth}
                            xKey="mois"
                            areas={[
                                { dataKey: "reservations", color: "#8b5cf6", name: "Réservations" },
                                { dataKey: "confirmées", color: "#10b981", name: "Confirmées" },
                            ]}
                            height={260}
                        />
                    </ChartCard>
                    <ChartCard
                        title="Produits les plus demandés"
                        description="Top 6 des produits demandés"
                        delay={0.35}
                    >
                        <BarChart
                            data={topProducts}
                            dataKey="count"
                            xKey="name"
                            colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899"]}
                            height={260}
                        />
                    </ChartCard>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-900">
                                Dernières activités commerciales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                                <div className="flex flex-col gap-4">
                                    {recentActivities.map((item) => (
                                        <div key={item.id} className="relative flex items-start gap-3">
                                            <div
                                                className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${
                                                    typeStyles[item.type] || "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                <span className="text-xs font-bold">
                                                    {item.type.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 pt-0.5">
                                                <p className="text-sm font-medium text-slate-900">{item.text}</p>
                                                <p className="text-xs text-slate-500">{item.detail}</p>
                                            </div>
                                            <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
