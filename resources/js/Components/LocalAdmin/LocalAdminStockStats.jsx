import { Building2, Package, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statItems = [
    { key: "total", label: "Total produits", icon: Package, color: "bg-blue-50 text-blue-600" },
    { key: "critical", label: "Critiques", icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
    { key: "outOfStock", label: "Ruptures", icon: XCircle, color: "bg-red-50 text-red-500" },
    { key: "casablanca", label: "Casablanca", icon: Building2, color: "bg-blue-50 text-blue-600" },
    { key: "marrakech", label: "Marrakech", icon: Building2, color: "bg-emerald-50 text-emerald-600" },
];

export default function LocalAdminStockStats({ data }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statItems.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.key}
                        className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
                    >
                        <div className="flex items-center justify-between">
                            <div className={cn("flex size-11 items-center justify-center rounded-xl", stat.color)}>
                                <Icon className="size-5" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                {data[stat.key]}
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">{stat.label}</p>
                    </div>
                );
            })}
        </div>
    );
}
