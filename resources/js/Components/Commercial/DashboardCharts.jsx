import { motion } from "framer-motion";
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
                    {entry.name}: {typeof entry.value === "number" && entry.value > 1000
                        ? `${(entry.value / 1000000).toFixed(2)}M MAD`
                        : entry.value}
                </p>
            ))}
        </div>
    );
};

export default function DashboardCharts({ revenueData, performanceData }) {
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
                            Chiffre d&apos;affaires vs Objectif
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="ca" name="CA" stroke="#10b981" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="objectif" name="Objectif" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
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
                            Performance des devis
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={performanceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {performanceData.map((entry, i) => (
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
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
