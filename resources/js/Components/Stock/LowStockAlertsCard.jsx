import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

const columns = [
    {
        header: "Référence",
        accessorKey: "id",
        className: "font-medium text-slate-900",
    },
    {
        header: "Article",
        accessorKey: "article",
    },
    {
        header: "Catégorie",
        accessorKey: "categorie",
    },
    {
        header: "Stock actuel",
        cell: (row) => <span className="font-bold text-red-600">{row.stockActuel}</span>,
    },
    {
        header: "Seuil min.",
        accessorKey: "seuilMin",
    },
    {
        header: "Agence",
        accessorKey: "agence",
    },
    {
        header: "Statut",
        cell: (row) => {
            const variant = row.statut === "Critique" ? "destructive" : "warning";
            return <Badge variant={variant}>{row.statut}</Badge>;
        },
    },
];

export default function LowStockAlertsCard({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                        Alertes stock bas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        emptyMessage="Aucune alerte stock"
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}
