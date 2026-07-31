import { Badge } from "@/Components/UI/Badge";

export function InventoryStatusBadge({ status }) {
    return status === "completed"
        ? <Badge variant="success">Terminé</Badge>
        : <Badge variant="warning">En cours</Badge>;
}

export function InventoryTypeBadge({ type }) {
    return <Badge variant="outline">{type === "general" ? "Général" : "Partiel"}</Badge>;
}

export function InventoryDifferenceBadge({ difference }) {
    if (difference === 0) return <Badge variant="success">Conforme</Badge>;
    return Math.abs(difference) < 5
        ? <Badge variant="warning">Petit écart</Badge>
        : <Badge variant="destructive">À vérifier</Badge>;
}

export function InventoryDifference({ difference }) {
    const value = difference === 0 ? "0" : `${difference > 0 ? "+" : ""}${difference}`;
    const color = difference === 0 ? "text-slate-900" : difference > 0 ? "text-emerald-600" : "text-red-600";
    return <span className={`font-mono font-semibold tabular-nums ${color}`}>{value}</span>;
}
