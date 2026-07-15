import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";

const statusLabels = {
    pending: "En attente",
    validated: "Validée",
    rejected: "Refusée",
    cancelled: "Annulée",
};

const statusVariants = {
    pending: "warning",
    validated: "success",
    rejected: "destructive",
    cancelled: "secondary",
};

const priorityVariants = {
    Haute: "destructive",
    Moyenne: "warning",
    Basse: "secondary",
};

const columns = [
    {
        header: "Référence",
        accessorKey: "id",
        className: "font-medium text-slate-900",
    },
    {
        header: "Titre",
        accessorKey: "title",
        className: "max-w-[200px] truncate",
    },
    {
        header: "Demandeur",
        accessorKey: "requester",
    },
    {
        header: "Type",
        accessorKey: "type",
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
        header: "Budget",
        cell: (row) => <span className="font-medium text-slate-900">{row.budget} MAD</span>,
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

export default function DemandeTable({ data, onView, onValidate, onRefuse }) {
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
                    {row.status === "pending" && (
                        <>
                            <button
                                type="button"
                                onClick={() => onValidate(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
                                aria-label={`Valider la demande ${row.id}`}
                            >
                                <CheckCircle2 className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRefuse(row)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-100"
                                aria-label={`Refuser la demande ${row.id}`}
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
