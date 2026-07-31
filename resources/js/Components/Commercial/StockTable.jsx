import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

const statusLabels = {
    available: "Disponible",
    low: "Stock faible",
    out_of_stock: "Rupture",
    overstock: "Surabondant",
};

const statusVariants = {
    available: "success",
    low: "warning",
    out_of_stock: "destructive",
    overstock: "orange",
};

function getAvailabilityStatus(row) {
    if (row.quantity_in_stock === 0) return "out_of_stock";
    if (row.quantity_in_stock <= row.minimum_stock) return "low";
    if (row.maximum_stock && row.quantity_in_stock >= row.maximum_stock) return "overstock";
    return "available";
}

export default function StockTable({ data }) {
    const columns = [
        {
            header: "Produit",
            accessorKey: "name",
            className: "font-medium text-slate-900 max-w-[220px] truncate",
        },
        {
            header: "Catégorie",
            accessorKey: "category",
        },
        {
            header: "Agence",
            cell: (row) => row.agency?.name ?? "—",
        },
        {
            header: "Qté disponible",
            accessorKey: "quantity_in_stock",
            className: "text-center",
        },
        {
            header: "Qté réservée",
            accessorKey: "reserved_quantity",
            className: "text-center",
        },
        {
            header: "Disponibilité",
            cell: (row) => {
                const status = getAvailabilityStatus(row);
                return (
                    <Badge variant={statusVariants[status] || "secondary"}>
                        {statusLabels[status] || status}
                    </Badge>
                );
            },
        },
    ];

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <DataTable
                columns={columns}
                data={data}
                emptyMessage="Aucun produit trouvé"
            />
        </div>
    );
}
