import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import {
    LineChart,
    Line,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            {payload.map((entry, i) => (
                <p key={i} className="text-sm font-bold text-slate-900">
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
};

const EmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center gap-2">
        <Inbox className="size-8 text-slate-300" />
        <p className="text-sm text-slate-400">Aucune donnée disponible</p>
    </div>
);

export default function DashboardCharts({ evolutionData = [], decisionsData = [] }) {
    const hasLineData = Array.isArray(evolutionData) && evolutionData.some(
        (m) => Number(m.creees) + Number(m.confirmees) + Number(m.rejetees) > 0
    );
    const hasPieData = Array.isArray(decisionsData) && decisionsData.some(
        (d) => Number(d.value) > 0
    );

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="lg:col-span-2"
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-slate-900">
                            Décisions par mois
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {hasLineData ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={evolutionData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="creees" name="Demandes créées" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="confirmees" name="Confirmées" stroke="#10b981" strokeWidth={2} dot={false} />
                                        <Line type="monotone" dataKey="rejetees" name="Rejetées" stroke="#ef4444" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-slate-900">
                            Répartition des décisions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            {hasPieData ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={decisionsData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {decisionsData.map((entry, i) => (
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
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
