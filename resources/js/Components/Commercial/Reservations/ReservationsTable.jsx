import { Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";

const statusVariants = {
    reserved: "info",
    delivered: "success",
    cancelled: "destructive",
};

const statusLabels = {
    reserved: "Réservé",
    delivered: "Livré",
    cancelled: "Annulé",
};

export default function ReservationsTable({ data, onEdit, onDelete }) {
    const columns = [
        {
            header: "Référence",
            accessorKey: "reference",
            className: "font-medium text-slate-900",
        },
        {
            header: "Nom du client",
            accessorKey: "client_name",
            className: "font-medium text-slate-900",
        },
        {
            header: "Produit",
            cell: (row) => row.product?.name ?? "—",
            className: "max-w-[200px] truncate",
        },
        {
            header: "Agence d'origine",
            cell: (row) => row.agency?.name ?? "—",
        },
        {
            header: "Quantité",
            accessorKey: "quantity",
            className: "text-center",
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
        {
            header: "Actions",
            cell: (row) => {
                const isReserved = row.status === "reserved";
                return (
                    <div className="flex items-center gap-1">
                        {isReserved && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-slate-500 hover:text-blue-600"
                                    onClick={() => onEdit(row)}
                                    title="Modifier"
                                >
                                    <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-slate-500 hover:text-red-600"
                                    onClick={() => onDelete(row)}
                                    title="Supprimer"
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
            className: "text-right",
        },
    ];

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <DataTable
                columns={columns}
                data={data}
                emptyMessage="Aucune réservation"
            />
        </div>
    );
}
