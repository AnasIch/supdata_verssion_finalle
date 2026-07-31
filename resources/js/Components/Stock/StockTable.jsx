import { Eye } from "lucide-react";
import { DataTable } from "@/Components/UI/DataTable";
import StockStatusBadge from "./StockStatusBadge";

function getAvailabilityStatus(row) {
    if (row.quantity_in_stock === 0) return "out_of_stock";
    if (row.quantity_in_stock <= row.minimum_stock) return "low";
    if (row.maximum_stock && row.quantity_in_stock >= row.maximum_stock) return "overstock";
    return "available";
}

function stockLevelClass(row) {
    if (row.quantity_in_stock <= row.minimum_stock) return "text-red-500";
    if (row.maximum_stock && row.quantity_in_stock >= row.maximum_stock) return "text-orange-500";
    return "text-slate-900";
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

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
        header: "Quantité",
        cell: (row) => (
            <span className={`font-medium ${stockLevelClass(row)}`}>
                {row.quantity_in_stock}
            </span>
        ),
    },
    {
        header: "Statut",
        cell: (row) => <StockStatusBadge status={getAvailabilityStatus(row)} />,
    },
    {
        header: "Dernière MAJ",
        cell: (row) => formatDate(row.updated_at),
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
