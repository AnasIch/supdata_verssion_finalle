import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#e0e7ff", "#10b981", "#f59e0b", "#ef4444"];

const STATUS_LABELS = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Rejetée",
    in_progress: "En cours",
    completed: "Terminée",
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <p className="text-sm font-bold text-slate-900">{payload[0].value}</p>
        </div>
    );
};

export default function DashboardCharts({ charts = {}, agencyStats = [] }) {
    const monthlyData = Object.entries(charts.monthlyDemandes || {}).map(([month, total]) => {
        const [y, m] = month.split("-");
        const date = new Date(parseInt(y), parseInt(m) - 1);
        const label = date.toLocaleDateString("fr-FR", { month: "short" });
        return { mois: label, demandes: total };
    });

    const categoryData = Object.entries(charts.productsByCategory || {}).map(([name, value]) => ({
        name,
        value,
    }));

    const statusData = Object.entries(charts.demandesByStatus || {}).map(([status, total]) => ({
        name: STATUS_LABELS[status] || status,
        value: total,
    }));

    const hasMonthlyData = monthlyData.length > 0;
    const hasCategoryData = categoryData.length > 0;

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] lg:col-span-2"
            >
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Évolution des demandes</h3>
                    <p className="text-xs text-slate-500">Demandes d'achat sur les derniers mois</p>
                </div>
                <div className="h-64">
                    {hasMonthlyData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDemandes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="demandes"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#colorDemandes)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            Aucune donnée pour le moment
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
            >
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Produits par catégorie</h3>
                    <p className="text-xs text-slate-500">Répartition du stock</p>
                </div>
                <div className="h-64">
                    {hasCategoryData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            Aucune donnée pour le moment
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
