import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { Package, Hash, Calendar, AlertTriangle } from "lucide-react";

const priorityLabels = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    urgent: "Urgente",
};

const priorityVariants = {
    low: "secondary",
    medium: "info",
    high: "warning",
    urgent: "destructive",
};

export default function RequestSummaryCard({ summary }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-900">Résumé</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Package className="size-4" />
                            Produits
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{summary.productCount}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Hash className="size-4" />
                            Quantité totale
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{summary.totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <AlertTriangle className="size-4" />
                            Priorité
                        </div>
                        <Badge variant={priorityVariants[summary.priority] || "secondary"}>
                            {priorityLabels[summary.priority] || summary.priority}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="size-4" />
                            Date
                        </div>
                        <span className="text-sm font-medium text-slate-900">{summary.date}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
