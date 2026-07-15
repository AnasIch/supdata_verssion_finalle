import { Eye } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import StockStatusBadge from "./StockStatusBadge";

const columns = [
    {
        header: "Référence",
        accessorKey: "reference",
        className: "font-medium text-slate-900",
    },
    {
        header: "Produit",
        accessorKey: "name",
        className: "max-w-[200px] truncate",
    },
    {
        header: "Catégorie",
        accessorKey: "category",
    },
    {
        header: "Agence",
        accessorKey: "agency",
    },
    {
        header: "Quantité",
        cell: (row) => (
            <span className={`font-medium ${row.quantity <= row.minThreshold ? "text-red-500" : "text-slate-900"}`}>
                {row.quantity}
            </span>
        ),
    },
    {
        header: "Seuil min.",
        accessorKey: "minThreshold",
    },
    {
        header: "Statut",
        cell: (row) => <StockStatusBadge status={row.status} />,
    },
    {
        header: "Dernière MAJ",
        accessorKey: "updatedAt",
    },
];

export default function StockTable({ data, onView }) {
    const extendedColumns = [
        ...columns,
        {
            header: "Actions",
            cell: (row) => (
                <button
                    type="button"
                    onClick={() => onView(row)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    aria-label={`Voir le produit ${row.name}`}
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
                emptyMessage="Aucun produit trouvé"
            />
        </div>
    );
}
