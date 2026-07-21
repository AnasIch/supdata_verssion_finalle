import { Eye, Archive } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

const statusLabels = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Rejetée",
    in_progress: "En cours",
    completed: "Terminée",
};

const statusVariants = {
    pending: "warning",
    approved: "success",
    rejected: "destructive",
    in_progress: "info",
    completed: "secondary",
};

const priorityLabels = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    urgent: "Urgente",
};

const priorityVariants = {
    low: "secondary",
    medium: "info",
    high: "warning",
    urgent: "destructive",
};

const columns = [
    {
        header: "Titre",
        accessorKey: "title",
        className: "font-medium text-slate-900 max-w-[200px] truncate",
    },
    {
        header: "Produit",
        accessorKey: "product_name",
        className: "max-w-[220px] truncate",
    },
    {
        header: "Quantité",
        accessorKey: "quantity",
        className: "text-center",
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
            <span>
                {new Date(row.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })}
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

export default function DemandesTable({ data, onView, onArchive }) {
    const extendedColumns = [
        ...columns,
        {
            header: "Actions",
            cell: (row) => (
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => onView(row)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                        aria-label={`Voir la demande ${row.title}`}
                    >
                        <Eye className="size-3.5" />
                        Voir
                    </button>
                    {row.status !== "completed" && (
                        <button
                            type="button"
                            onClick={() => onArchive(row)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-100"
                            aria-label={`Archiver la demande ${row.title}`}
                        >
                            <Archive className="size-3.5" />
                            Archiver
                        </button>
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
