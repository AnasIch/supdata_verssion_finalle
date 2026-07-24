import { Input } from "@/Components/UI/Input";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export default function ProductSelector({
    products,
    catalogProducts,
    errors,
    onUpdate,
    onAdd,
    onRemove,
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Produits du stock
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Sélectionnez un produit disponible dans le stock.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAdd}
                    className="text-blue-600 hover:text-blue-700"
                >
                    <Plus className="size-3.5" />
                    Ajouter
                </Button>
            </div>

            {errors?.products && (
                <p className="text-xs text-red-500">{errors.products}</p>
            )}

            <div className="flex flex-col gap-3">
                {products.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-slate-200/70 p-4 sm:flex-row sm:items-start"
                    >
                        <div className="flex items-center justify-center size-8 shrink-0 rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                            {index + 1}
                        </div>

                        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                            <div className="flex-1">
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Produit *
                                </label>
                                <select
                                    value={item.product}
                                    onChange={(e) =>
                                        onUpdate(item.id, "product", e.target.value)
                                    }
                                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">Sélectionner un produit</option>
                                    {catalogProducts.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full sm:w-24">
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Quantité *
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        onUpdate(
                                            item.id,
                                            "quantity",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="h-10"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Remarque
                                </label>
                                <Input
                                    value={item.observation}
                                    onChange={(e) =>
                                        onUpdate(
                                            item.id,
                                            "observation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Optionnel"
                                    className="h-10"
                                />
                            </div>

                            {products.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => onRemove(item.id)}
                                    className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                    aria-label="Supprimer le produit"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
