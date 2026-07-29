import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/UI/Select";
import { AlertTriangle } from "lucide-react";

function computeAvailable(product) {
    if (product.available !== undefined) return Number(product.available);
    const qty = product.quantity_in_stock ?? product.quantity ?? 0;
    const reserved = product.reserved_quantity ?? product.reservedQuantity ?? 0;
    return qty - reserved;
}

function getStockLabel(product) {
    const available = computeAvailable(product);
    if (product.status === "inactive") return "Inactif";
    if (available <= 0) return "Rupture";
    return `${available} disponible${available > 1 ? "s" : ""}`;
}

export default function ProductCombobox({ products, value, onChange, disabled = false }) {
    const items = products ?? [];
    const selected = items.find((p) => String(p.id) === String(value)) ?? null;

    return (
        <div className="flex flex-col gap-2">
            <Select
                value={String(value || "")}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Sélectionnez un produit" />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                    {items.length > 0 ? (
                        items.map((product) => {
                            const label = getStockLabel(product);
                            return (
                                <SelectItem
                                    key={product.id}
                                    value={String(product.id)}
                                    className="cursor-pointer"
                                >
                                    {product.name}
                                    <span className="ml-2 text-xs text-slate-400">
                                        ({label})
                                    </span>
                                </SelectItem>
                            );
                        })
                    ) : (
                        <div className="flex items-center justify-center px-3 py-6 text-sm text-slate-400">
                            Aucun produit disponible
                        </div>
                    )}
                </SelectContent>
            </Select>
            {selected && computeAvailable(selected) <= 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <div className="flex flex-col gap-2">
                        <p className="text-amber-700">
                            Ce produit est actuellement en rupture de stock. Cette
                            demande permettra son réapprovisionnement.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
