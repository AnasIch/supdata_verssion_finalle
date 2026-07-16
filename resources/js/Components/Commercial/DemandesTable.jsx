import { Eye } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

const statusLabels = {
    pending: "En attente",
    accepted: "Acceptée",
    refused: "Refusée",
    in_progress: "En cours",
};

const statusVariants = {
    pending: "warning",
    accepted: "success",
    refused: "destructive",
    in_progress: "info",
};

const priorityVariants = {
    Urgente: "destructive",
    Haute: "warning",
    Moyenne: "info",
    Basse: "secondary",
    Faible: "secondary",
};

const columns = [
    {
        header: "N° demande",
        accessorKey: "id",
        className: "font-medium text-slate-900",
    },
    {
        header: "Produit",
        accessorKey: "product",
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
                {row.priority}
            </Badge>
        ),
    },
    {
        header: "Date",
        accessorKey: "createdAt",
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

export default function DemandesTable({ data, onView }) {
    const extendedColumns = [
        ...columns,
        {
            header: "Actions",
            cell: (row) => (
                <button
                    type="button"
                    onClick={() => onView(row)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    aria-label={`Voir la demande ${row.id}`}
                >
                    <Eye className="size-3.5" />
                    Voir
                </button>
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
