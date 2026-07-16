import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
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

export default function DashboardCharts({ evolutionData }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                        Évolution des demandes d&apos;achat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={evolutionData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="demandes" name="Total" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="validees" name="Validées" stroke="#10b981" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="refusees" name="Refusées" stroke="#ef4444" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
