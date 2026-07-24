import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

const statusLabels = {
    approved: "En attente",
    confirmed: "Confirmée",
    rejected: "Rejetée",
};

const statusVariants = {
    approved: "warning",
    confirmed: "success",
    rejected: "destructive",
};

const priorityLabels = {
    urgent: "Urgente",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
};

const priorityVariants = {
    urgent: "destructive",
    high: "destructive",
    medium: "warning",
    low: "secondary",
};

const columns = [
    {
        header: "Référence",
        cell: (row) => (
            <span className="font-medium text-slate-900">
                DEM-{new Date(row.created_at).getFullYear()}-{String(row.id).padStart(4, "0")}
            </span>
        ),
    },
    {
        header: "Produit",
        accessorKey: "product_name",
        className: "max-w-[200px] truncate",
    },
    {
        header: "Demandeur",
        cell: (row) => row.user?.name ?? "—",
    },
    {
        header: "Quantité",
        accessorKey: "quantity",
    },
    {
        header: "Priorité",
        cell: (row) => (
            <Badge variant={priorityVariants[row.priority] || "secondary"}>
                {priorityLabels[row.priority] || row.priority}
            </Badge>
        ),
    },
    {
        header: "Date",
        cell: (row) => (
            <span className="text-slate-500">
                {new Date(row.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            </span>
        ),
    },
    {
        header: "Statut",
        cell: (row) => (
            <Badge variant={statusVariants[row.status] || "secondary"}>
                {statusLabels[row.status] || row.status}
            </Badge>
        ),
    },
];

export default function DemandeTable({ data, onView, onConfirm, onReject }) {
    const extendedColumns = [
        ...columns,
        {
            header: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => onView(row)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                        aria-label={`Voir la demande ${row.id}`}
                    >
                        <Eye className="size-3.5" />
                        Voir
                    </button>
                    {row.status === "approved" && (
                        <>
                            <button
                                type="button"
                                onClick={() => onConfirm(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
                                aria-label={`Confirmer la demande ${row.id}`}
                            >
                                <CheckCircle2 className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onReject(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-100"
                                aria-label={`Rejeter la demande ${row.id}`}
                            >
                                <XCircle className="size-3.5" />
                            </button>
                        </>
                    )}
                </div>
            ),
            className: "text-right",
        },
    ];

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <DataTable
                columns={extendedColumns}
                data={data}
                emptyMessage="Aucune demande trouvée"
            />
        </div>
    );
}
