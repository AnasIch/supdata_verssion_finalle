import { useState } from "react";
import { AlertTriangle, Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/UI/Popover";
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/UI/Command";
import { cn } from "@/lib/utils";

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

function getSearchText(product) {
    return [product.name, product.reference]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

export default function ProductCombobox({ products, value, onChange, disabled = false }) {
    const items = products ?? [];
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selected = items.find((p) => String(p.id) === String(value)) ?? null;

    const filtered = search.trim()
        ? items.filter((product) =>
              getSearchText(product).includes(search.trim().toLowerCase())
          )
        : items;

    return (
        <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen} modal>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Sélectionner un produit"
                        disabled={disabled}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="line-clamp-1 text-left">
                            {selected ? (
                                <span className="text-slate-900">
                                    {selected.name}
                                    <span className="ml-2 text-xs text-slate-400">
                                        ({getStockLabel(selected)})
                                    </span>
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    Sélectionnez un produit
                                </span>
                            )}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    sideOffset={4}
                    className="z-[60] w-[var(--radix-popover-trigger-width)] min-w-[16rem] max-w-[calc(100vw-2rem)] p-0"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Rechercher un produit..."
                            aria-label="Rechercher un produit"
                        />
                        <CommandList>
                            {items.length === 0 ? (
                                <div className="flex items-center justify-center px-3 py-6 text-sm text-slate-400">
                                    Aucun produit disponible
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="py-8 text-center text-sm text-slate-500">
                                    Aucun produit trouvé
                                </div>
                            ) : (
                                filtered.map((product) => {
                                        const isSelected =
                                            String(product.id) === String(value);
                                        return (
                                            <CommandItem
                                                key={product.id}
                                                value={String(product.id)}
                                                onSelect={(currentValue) => {
                                                    onChange(currentValue);
                                                    setSearch("");
                                                    setOpen(false);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4 shrink-0",
                                                        isSelected
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {product.name}
                                                <span className="ml-2 text-xs text-slate-400">
                                                    ({getStockLabel(product)})
                                                </span>
                                            </CommandItem>
                                        );
                                    })
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
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
