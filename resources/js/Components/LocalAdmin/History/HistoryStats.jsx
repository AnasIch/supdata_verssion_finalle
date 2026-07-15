import { motion } from "framer-motion";
import { Activity, CheckCircle2, XCircle, Warehouse } from "lucide-react";
import KpiCard from "@/Components/Charts/KpiCard";

const kpis = [
    {
        id: "total",
        label: "Total activités",
        icon: Activity,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "validations",
        label: "Validations",
        icon: CheckCircle2,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "refus",
        label: "Refus",
        icon: XCircle,
        color: "bg-red-50 text-red-600",
    },
    {
        id: "stockConsults",
        label: "Consultations stock",
        icon: Warehouse,
        color: "bg-amber-50 text-amber-600",
    },
];

export default function HistoryStats({ stats }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi, i) => (
                <KpiCard
                    key={kpi.id}
                    icon={kpi.icon}
                    label={kpi.label}
                    value={String(stats[kpi.id])}
                    color={kpi.color}
                    delay={i * 0.05}
                />
            ))}
        </div>
    );
}
