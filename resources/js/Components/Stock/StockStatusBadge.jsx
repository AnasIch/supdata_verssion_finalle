import { Badge } from "@/Components/UI/Badge";

const statusConfig = {
    available: { label: "Disponible", variant: "success" },
    low: { label: "Stock faible", variant: "warning" },
    out_of_stock: { label: "Rupture", variant: "destructive" },
};

export default function StockStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.available;
    return <Badge variant={config.variant}>{config.label}</Badge>;
}
