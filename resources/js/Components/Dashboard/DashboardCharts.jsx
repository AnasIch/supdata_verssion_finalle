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

const demandesData = [
    { mois: "Jan", demandes: 18 },
    { mois: "Fév", demandes: 25 },
    { mois: "Mar", demandes: 32 },
    { mois: "Avr", demandes: 28 },
    { mois: "Mai", demandes: 45 },
    { mois: "Jun", demandes: 38 },
    { mois: "Jul", demandes: 52 },
    { mois: "Aoû", demandes: 48 },
    { mois: "Sep", demandes: 61 },
    { mois: "Oct", demandes: 55 },
    { mois: "Nov", demandes: 67 },
    { mois: "Déc", demandes: 72 },
];

const produitsParAgence = [
    { name: "Casablanca", value: 420, color: "#3b82f6" },
    { name: "Marrakech", value: 280, color: "#6366f1" },
    { name: "Rabat", value: 195, color: "#8b5cf6" },
    { name: "Tanger", value: 175, color: "#a78bfa" },
    { name: "Fès", value: 128, color: "#c4b5fd" },
    { name: "Autres", value: 50, color: "#e0e7ff" },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <p className="text-sm font-bold text-slate-900">{payload[0].value}</p>
        </div>
    );
};

export default function DashboardCharts() {
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
                    <p className="text-xs text-slate-500">Demandes d'achat sur les 12 derniers mois</p>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={demandesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
            >
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">Produits par agence</h3>
                    <p className="text-xs text-slate-500">Répartition du stock</p>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={produitsParAgence}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {produitsParAgence.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
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
                </div>
            </motion.div>
        </div>
    );
}
