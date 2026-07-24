import { motion } from "framer-motion";
import {
    ClipboardList,
    CheckCircle2,
    XCircle,
    Clock,
    Warehouse,
    AlertTriangle,
} from "lucide-react";
import KpiCard from "@/Components/Charts/KpiCard";

const iconMap = {
    total: ClipboardList,
    validated: CheckCircle2,
    rejected: XCircle,
    pending: Clock,
    stockValue: Warehouse,
    critical: AlertTriangle,
};

export default function ReportKpis({ data }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {data.map((kpi, i) => (
                <KpiCard
                    key={kpi.id}
                    icon={iconMap[kpi.id] || ClipboardList}
                    label={kpi.label}
                    value={kpi.value}
                    unit={kpi.unit}
                    trend={kpi.trend}
                    trendUp={kpi.trendUp}
                    description={kpi.description}
                    color={kpi.color}
                    delay={i * 0.05}
                />
            ))}
        </div>
    );
}
