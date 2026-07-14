import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
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

export default function LineChart({
    data,
    dataKey = "value",
    xKey = "name",
    color = "#3b82f6",
    height = 300,
    formatter,
    strokeWidth = 2,
    dot = false,
    className,
}) {
    return (
        <ChartContainer height={height} className={className}>
            <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    dot={dot}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                />
            </RechartsLineChart>
        </ChartContainer>
    );
}
