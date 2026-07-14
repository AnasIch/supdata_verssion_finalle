import {
    AreaChart as RechartsAreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import ChartContainer from "./ChartContainer";

const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            {payload.map((entry, i) => {
                const value = formatter
                    ? formatter(entry.value)
                    : entry.value.toLocaleString("fr-FR");
                return (
                    <p key={i} className="text-sm font-bold text-slate-900">
                        {entry.name}: {value}
                    </p>
                );
            })}
        </div>
    );
};

export default function AreaChart({
    data,
    areas = [{ dataKey: "value", color: "#3b82f6", name: "Valeur" }],
    xKey = "name",
    height = 300,
    formatter,
    className,
}) {
    return (
        <ChartContainer height={height} className={className}>
            <RechartsAreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    {areas.map((a) => (
                        <linearGradient key={a.dataKey} id={`gradient-${a.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={a.color} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={a.color} stopOpacity={0} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
                {areas.map((a) => (
                    <Area
                        key={a.dataKey}
                        type="monotone"
                        dataKey={a.dataKey}
                        name={a.name || a.dataKey}
                        stroke={a.color}
                        strokeWidth={2}
                        fill={`url(#gradient-${a.dataKey})`}
                    />
                ))}
            </RechartsAreaChart>
        </ChartContainer>
    );
}
