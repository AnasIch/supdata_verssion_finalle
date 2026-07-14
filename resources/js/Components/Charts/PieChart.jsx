import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import ChartContainer from "./ChartContainer";

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const value = payload[0].value.toLocaleString("fr-FR");
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-600">{payload[0].name}</p>
            <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
    );
};

export default function PieChart({
    data,
    height = 300,
    innerRadius = 55,
    outerRadius = 85,
    paddingAngle = 3,
    className,
}) {
    return (
        <ChartContainer height={height} className={className}>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={paddingAngle}
                    dataKey="value"
                >
                    {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color || "#3b82f6"} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", color: "#64748b" }}
                />
            </RechartsPieChart>
        </ChartContainer>
    );
}
