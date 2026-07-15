import { Badge } from "@/Components/UI/Badge";
import { DataTable } from "@/Components/UI/DataTable";
import {
    ClipboardList,
    Package,
    BarChart3,
    Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
    demande: {
        label: "Demande",
        variant: "info",
        icon: ClipboardList,
    },
    stock: {
        label: "Stock",
        variant: "warning",
        icon: Package,
    },
    rapport: {
        label: "Rapport",
        variant: "default",
        icon: BarChart3,
    },
    notification: {
        label: "Notification",
        variant: "secondary",
        icon: Bell,
    },
};

const statusConfig = {
    success: { label: "Succès", variant: "success" },
    warning: { label: "Attention", variant: "warning" },
    danger: { label: "Erreur", variant: "destructive" },
    info: { label: "Info", variant: "info" },
};

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

const columns = [
    {
        header: "Action",
        accessorKey: "action",
        cell: (row) => {
            const cfg = typeConfig[row.type] || typeConfig.demande;
            const Icon = cfg.icon;
            return (
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "flex size-8 items-center justify-center rounded-lg",
                            row.type === "demande" && "bg-blue-50 text-blue-600",
                            row.type === "stock" && "bg-amber-50 text-amber-600",
                            row.type === "rapport" && "bg-slate-100 text-slate-600",
                            row.type === "notification" && "bg-violet-50 text-violet-600"
                        )}
                    >
                        <Icon className="size-4" />
                    </div>
                    <span className="font-medium text-slate-800">{row.action}</span>
                </div>
            );
        },
    },
    {
        header: "Description",
        accessorKey: "description",
        className: "max-w-xs",
    },
    {
        header: "Utilisateur",
        accessorKey: "user",
    },
    {
        header: "Date",
        accessorKey: "date",
        cell: (row) => (
            <div className="flex flex-col">
                <span className="text-sm text-slate-700">{formatDate(row.date)}</span>
                <span className="text-xs text-slate-400">{formatTime(row.date)}</span>
            </div>
        ),
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: (row) => {
            const cfg = typeConfig[row.type] || typeConfig.demande;
            return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
        },
    },
    {
        header: "Statut",
        accessorKey: "status",
        cell: (row) => {
            const cfg = statusConfig[row.status] || statusConfig.info;
            return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
        },
    },
];

export default function HistoryTable({ data, isLoading = false }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-white">
            <DataTable
                columns={columns}
                data={data}
                isLoading={isLoading}
                emptyMessage="Aucune activité trouvée"
            />
        </div>
    );
}
