import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Download,
    FileText,
    FileSpreadsheet,
    FileDown,
    Clock,
    AlertTriangle,
    TrendingUp,
    Building2,
    Activity,
    User,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Skeleton } from "@/Components/UI/Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { useToast } from "@/Components/UI/Toast";
import KpiCard from "@/Components/Charts/KpiCard";
import StatsCard from "@/Components/Charts/StatsCard";
import ChartCard from "@/Components/Charts/ChartCard";
import LineChart from "@/Components/Charts/LineChart";
import BarChart from "@/Components/Charts/BarChart";
import PieChart from "@/Components/Charts/PieChart";
import AreaChart from "@/Components/Charts/AreaChart";
import { kpiData } from "@/Mocks/reports";
import { analyticsOverview, periodLabels } from "@/Mocks/analytics";
import {
    stockEvolution,
    productsByCategory,
    usersByRole,
    monthlyActivity,
    productsByAgency,
    requestsEvolution,
} from "@/Mocks/charts";
import { recentActivities, getIconComponent, activityStatusConfig } from "@/Mocks/activities";
import { loginHistory } from "@/Mocks/loginHistory";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

const periodOptions = [
    { value: "today", label: "Aujourd'hui" },
    { value: "7days", label: "7 derniers jours" },
    { value: "30days", label: "30 derniers jours" },
    { value: "year", label: "Cette année" },
    { value: "custom", label: "Personnalisé" },
];

function LoadingSkeleton() {
    return (
        <DashboardLayout title="Rapports & Analytics" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Rapports & Analytics" }]}>
            <div className="flex flex-col gap-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-[340px] rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[340px] rounded-2xl" />)}
                </div>
            </div>
        </DashboardLayout>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
                <FileText className="size-8 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucun rapport disponible</h3>
            <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
                Il n'y a pas de données pour la période sélectionnée. Essayez de changer de filtre.
            </p>
        </div>
    );
}

function ErrorState({ onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="size-8 text-red-500" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Erreur de chargement</h3>
            <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
                Une erreur est survenue lors du chargement des rapports. Veuillez réessayer.
            </p>
            {onRetry && (
                <Button variant="outline" className="mt-4" onClick={onRetry}>
                    Réessayer
                </Button>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${activityStatusConfig[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
            {status}
        </span>
    );
}

function formatNumber(n) {
    return n.toLocaleString("fr-FR");
}

function formatCurrency(n) {
    return n.toLocaleString("fr-FR") + " MAD";
}

export default function ReportsIndex() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [period, setPeriod] = useState("30days");

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    const handleRetry = () => {
        setLoading(true);
        setError(false);
        setTimeout(() => {
            setLoading(false);
            toast("Rapports rechargés avec succès.", "success");
        }, 800);
    };

    const handleExport = (type) => {
        toast(`Export ${type} en cours de préparation...`, "info");
    };

    const handleFilterChange = (value) => {
        setPeriod(value);
        toast(`Filtre appliqué : ${periodLabels[value]}`, "info");
    };

    if (loading) return <LoadingSkeleton />;

    if (error) {
        return (
            <DashboardLayout title="Rapports & Analytics" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Rapports & Analytics" }]}>
                <ErrorState onRetry={handleRetry} />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Rapports & Analytics"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Rapports & Analytics" }]}
        >
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageTitle
                        title="Rapports & Analytics"
                        description="Vue analytique complète de votre système ERP."
                    />
                    <Button onClick={() => handleExport("PDF")}>
                        <Download className="size-4" />
                        Exporter
                    </Button>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {periodOptions.map((opt) => (
                                <Button
                                    key={opt.value}
                                    variant={period === opt.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFilterChange(opt.value)}
                                    aria-pressed={period === opt.value}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                        <div className="hidden sm:block">
                            <Select value={period} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-[180px]" aria-label="Sélectionner une période">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {periodOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {kpiData.map((kpi, i) => (
                            <KpiCard key={kpi.label} {...kpi} delay={0.1 + i * 0.05} />
                        ))}
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <ChartCard
                            title="Évolution du stock"
                            description="Valeur du stock sur les 12 derniers mois"
                            delay={0.15}
                        >
                            <LineChart
                                data={stockEvolution}
                                dataKey="valeur"
                                xKey="mois"
                                color="#3b82f6"
                                height={300}
                                formatter={formatCurrency}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Produits par catégorie"
                            description="Répartition des produits par catégorie"
                            delay={0.2}
                        >
                            <BarChart
                                data={productsByCategory}
                                dataKey="count"
                                xKey="name"
                                colors={productsByCategory.map((c) => c.color)}
                                height={300}
                                formatter={formatNumber}
                            />
                        </ChartCard>
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <ChartCard
                            title="Utilisateurs par rôle"
                            description="Répartition des utilisateurs"
                            delay={0.25}
                        >
                            <PieChart
                                data={usersByRole}
                                height={300}
                                innerRadius={50}
                                outerRadius={80}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Activité mensuelle"
                            description="Connexions et actions sur les 12 derniers mois"
                            className="lg:col-span-2"
                            delay={0.3}
                        >
                            <AreaChart
                                data={monthlyActivity}
                                areas={[
                                    { dataKey: "actions", color: "#3b82f6", name: "Actions" },
                                    { dataKey: "connexions", color: "#10b981", name: "Connexions" },
                                ]}
                                xKey="mois"
                                height={300}
                                formatter={formatNumber}
                            />
                        </ChartCard>
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.35 }}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <ChartCard
                            title="Produits par agence"
                            description="Nombre de produits dans chaque agence"
                            delay={0.35}
                        >
                            <BarChart
                                data={productsByAgency}
                                dataKey="count"
                                xKey="name"
                                color="#6366f1"
                                height={300}
                                formatter={formatNumber}
                            />
                        </ChartCard>

                        <ChartCard
                            title="Évolution des demandes"
                            description="Demandes d'achat sur les 12 derniers mois"
                            delay={0.4}
                        >
                            <LineChart
                                data={requestsEvolution}
                                dataKey="demandes"
                                xKey="mois"
                                color="#f59e0b"
                                height={300}
                                formatter={formatNumber}
                            />
                        </ChartCard>
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.45 }}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                            { icon: TrendingUp, label: "Top catégorie", value: analyticsOverview.topCategory.name, sub: `${analyticsOverview.topCategory.count} produits (${analyticsOverview.topCategory.percentage}%)`, color: "bg-blue-50 text-blue-600" },
                            { icon: Building2, label: "Agence la plus active", value: analyticsOverview.mostActiveAgency.name, sub: `Score: ${analyticsOverview.mostActiveAgency.activityScore}/100`, color: "bg-indigo-50 text-indigo-600" },
                            { icon: Activity, label: "Dernière activité", value: analyticsOverview.lastActivity, sub: "Mise à jour du stock", color: "bg-emerald-50 text-emerald-600" },
                            { icon: Clock, label: "Dernière connexion", value: analyticsOverview.lastLogin, sub: "Super Admin", color: "bg-amber-50 text-amber-600" },
                            { icon: User, label: "Utilisateur le plus actif", value: analyticsOverview.mostActiveUser.name, sub: `${analyticsOverview.mostActiveUser.actions} actions ce mois`, color: "bg-rose-50 text-rose-600" },
                        ].map((stat, i) => (
                            <StatsCard key={stat.label} {...stat} delay={0.45 + i * 0.04} />
                        ))}
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.55 }}>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Dernières activités</CardTitle>
                                <CardDescription>Actions récentes dans le système</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Date</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Utilisateur</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Action</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Module</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentActivities.map((activity) => {
                                                const IconComp = getIconComponent(activity.icon);
                                                return (
                                                    <tr key={activity.id} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50">
                                                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">
                                                            {activity.date} {activity.time}
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                                    <IconComp className="size-3.5 text-slate-500" />
                                                                </div>
                                                                <span className="font-medium text-slate-900">{activity.text}</span>
                                                            </div>
                                                        </td>
                                                        <td className="max-w-[200px] truncate px-3 py-2.5 text-slate-500">{activity.detail}</td>
                                                        <td className="px-3 py-2.5 text-slate-500">{activity.module}</td>
                                                        <td className="px-3 py-2.5"><StatusBadge status={activity.status} /></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Dernières connexions</CardTitle>
                                <CardDescription>Historique des connexions récentes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Utilisateur</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Email</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Agence</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Heure</th>
                                                <th className="px-3 py-2.5 font-medium text-slate-500">Adresse IP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loginHistory.map((login) => (
                                                <tr key={login.id} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50">
                                                    <td className="whitespace-nowrap px-3 py-2.5 font-medium text-slate-900">{login.name}</td>
                                                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">{login.email}</td>
                                                    <td className="px-3 py-2.5 text-slate-500">{login.agency}</td>
                                                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">{login.date} {login.time}</td>
                                                    <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-slate-400">{login.ip}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.6 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Exporter les données</CardTitle>
                            <CardDescription>Téléchargez vos rapports dans le format de votre choix.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button variant="outline" className="flex-1" onClick={() => handleExport("PDF")}>
                                    <FileDown className="size-4" />
                                    Exporter PDF
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => handleExport("Excel")}>
                                    <FileSpreadsheet className="size-4" />
                                    Exporter Excel
                                </Button>
                                <Button variant="outline" className="flex-1" onClick={() => handleExport("CSV")}>
                                    <FileText className="size-4" />
                                    Exporter CSV
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
