import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

const statusLabels = {
    available: "Disponible",
    low: "Stock faible",
    out_of_stock: "Rupture",
};

const statusVariants = {
    available: "success",
    low: "warning",
    out_of_stock: "destructive",
};

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
            accessorKey: "agency",
        },
        {
            header: "Qté disponible",
            accessorKey: "quantity",
            className: "text-center",
        },
        {
            header: "Qté réservée",
            accessorKey: "reservedQuantity",
            className: "text-center",
        },
        {
            header: "Disponibilité",
            cell: (row) => (
                <Badge variant={statusVariants[row.status] || "secondary"}>
                    {statusLabels[row.status] || row.status}
                </Badge>
            ),
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
