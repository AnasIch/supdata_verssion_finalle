import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Badge } from "@/Components/UI/Badge";

const statusVariant = (status) => {
    if (status === "Rejetée") return "destructive";
    if (status === "En attente") return "warning";
    if (status === "Soumise") return "secondary";
    return "success";
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

export default function LastDemandesCard({ data = [], basePath }) {
    const columns = [
        {
            header: "Référence",
            accessorKey: "reference",
            className: "font-mono text-xs font-semibold",
        },
        {
            header: "Produit",
            accessorKey: "product",
        },
        {
            header: "Demandeur",
            accessorKey: "requester",
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
            header: "Statut",
            cell: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>,
        },
        {
            header: "Date",
            accessorKey: "date",
        },
        {
            header: "Action",
            cell: (row) => (
                <button
                    type="button"
                    onClick={() => router.get(`${basePath}/demandes/${row.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    aria-label="Voir les détails de la demande"
                >
                    <Eye className="size-3.5" />
                    Voir
                </button>
            ),
            className: "text-right",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                        Demandes récentes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        emptyMessage="Aucune demande récente"
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}
