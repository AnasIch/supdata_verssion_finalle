import { motion } from "framer-motion";
import { Eye } from "lucide-react";
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
        header: "Responsable",
        accessorKey: "responsable",
    },
    {
        header: "Client",
        accessorKey: "client",
    },
    {
        header: "Priorité",
        cell: (row) => {
            const variants = {
                Haute: "destructive",
                Moyenne: "warning",
                Basse: "secondary",
            };
            return <Badge variant={variants[row.priorite] || "secondary"}>{row.priorite}</Badge>;
        },
    },
    {
        header: "Budget",
        cell: (row) => <span className="font-medium text-slate-900">{row.budget} MAD</span>,
    },
    {
        header: "Date",
        accessorKey: "date",
    },
    {
        header: "Statut",
        cell: () => <Badge variant="warning">En attente</Badge>,
    },
    {
        header: "Action",
        cell: () => (
            <button
                type="button"
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

export default function PendingRequestsCard({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                        Demandes en attente
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        emptyMessage="Aucune demande en attente"
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
}
