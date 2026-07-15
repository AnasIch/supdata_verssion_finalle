import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-600">{entry.name}</p>
            <p className="text-sm font-bold text-slate-900">{entry.value} demandes</p>
        </div>
    );
};

export default function DecisionsChart({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                        Répartition des décisions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {data.map((entry, i) => (
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
    );
}
