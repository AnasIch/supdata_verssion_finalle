import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";
import ChartContainer from "./ChartContainer";

const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (!active || !payload?.length) return null;
    const value = formatter ? formatter(payload[0].value) : payload[0].value.toLocaleString("fr-FR");
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
    );
};

export default function BarChart({
    data,
    dataKey = "count",
    xKey = "name",
    color = "#3b82f6",
    height = 300,
    formatter,
    radius = [6, 6, 0, 0],
    colors,
    className,
}) {
    return (
        <ChartContainer height={height} className={className}>
            <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                    dataKey={xKey}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip formatter={formatter} />} />
                <Bar dataKey={dataKey} radius={radius} maxBarSize={48}>
                    {colors
                        ? data.map((_, i) => (
                              <Cell key={i} fill={colors[i % colors.length]} />
                          ))
                        : <Cell fill={color} />}
                </Bar>
            </RechartsBarChart>
        </ChartContainer>
    );
}
