import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { InventoryDifference, InventoryDifferenceBadge } from "./InventoryBadge";

const emptyLine = () => ({
    id: null,
    product_id: "",
    reference: "",
    product: "",
    category: "",
    agency: "",
    system_quantity: 0,
    physical_quantity: 0,
    difference: 0,
    comment: "",
    status: "conforme",
});

export default function InventoryEntryTable({ lines, products = [], onChange, readOnly = false }) {
    const update = (index, patch) => {
        const next = lines.map((line, i) => {
            if (i !== index) return line;
            const updated = { ...line, ...patch };
            if ("product_id" in patch) {
                const product = products.find((p) => p.id === Number(patch.product_id));
                if (product) {
                    updated.product = product.name;
                    updated.reference = product.reference;
                    updated.category = product.category;
                    updated.agency = product.agency;
                    updated.system_quantity = product.system;
                }
            }
            updated.difference = (Number(updated.physical_quantity) || 0) - (Number(updated.system_quantity) || 0);
            return updated;
        });
        onChange(next);
    };

    const addLine = () => onChange([...lines, emptyLine()]);
    const removeLine = (index) => onChange(lines.filter((_, i) => i !== index));

    const selectedIds = lines.map((line) => Number(line.product_id)).filter(Boolean);

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[820px] border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left">
                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-500">Référence</th>
                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-500">Produit</th>
                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-500">Stock système</th>
                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-500">Stock physique</th>
                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-500">Écart</th>
                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-500">Statut</th>
                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-500">Commentaire</th>
                            {!readOnly && <th className="w-10 px-3 py-2.5 text-right text-xs font-semibold text-slate-500">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {lines.length === 0 ? (
                            <tr>
                                <td colSpan={readOnly ? 7 : 8} className="px-3 py-8 text-center text-sm text-slate-400">
                                    Aucune ligne saisie.
                                </td>
                            </tr>
                        ) : (
                            lines.map((line, index) => (
                                <tr key={line.id ?? `line-${index}`} className="bg-white">
                                    <td className="px-3 py-2">
                                        <span className="font-mono text-xs text-slate-600">{line.reference || "—"}</span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {readOnly ? (
                                            <div>
                                                <p className="font-medium">{line.product}</p>
                                                <p className="text-xs text-slate-500">{line.category}</p>
                                            </div>
                                        ) : (
                                            <select
                                                value={line.product_id}
                                                onChange={(e) => update(index, { product_id: e.target.value })}
                                                className="h-9 w-full min-w-44 rounded-md border border-slate-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                                                aria-label={`Produit de la ligne ${index + 1}`}
                                            >
                                                <option value="">Sélectionner un produit</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id} disabled={selectedIds.includes(product.id) && product.id !== line.product_id}>
                                                        {product.name} ({product.agency})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-slate-600">
                                        {readOnly ? (
                                            <span className="font-mono tabular-nums">{line.system_quantity}</span>
                                        ) : (
                                            <Input
                                                type="number"
                                                min="0"
                                                className="h-9 w-20"
                                                value={line.system_quantity}
                                                onChange={(e) => update(index, { system_quantity: e.target.value })}
                                                aria-label={`Stock système de la ligne ${index + 1}`}
                                            />
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        {readOnly ? (
                                            <span className="font-mono font-semibold tabular-nums">{line.physical_quantity}</span>
                                        ) : (
                                            <Input
                                                type="number"
                                                min="0"
                                                className="h-9 w-20"
                                                value={line.physical_quantity}
                                                onChange={(e) => update(index, { physical_quantity: e.target.value })}
                                                aria-label={`Stock physique de la ligne ${index + 1}`}
                                            />
                                        )}
                                    </td>
                                    <td className="px-3 py-2"><InventoryDifference difference={Number(line.difference) || 0} /></td>
                                    <td className="px-3 py-2"><InventoryDifferenceBadge difference={Number(line.difference) || 0} /></td>
                                    <td className="px-3 py-2">
                                        {readOnly ? (
                                            <span className="text-slate-600">{line.comment || "—"}</span>
                                        ) : (
                                            <Input
                                                className="h-9 min-w-36"
                                                value={line.comment}
                                                onChange={(e) => update(index, { comment: e.target.value })}
                                                placeholder="Commentaire…"
                                                aria-label={`Commentaire de la ligne ${index + 1}`}
                                            />
                                        )}
                                    </td>
                                    {!readOnly && (
                                        <td className="px-3 py-2 text-right">
                                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => removeLine(index)} aria-label={`Retirer la ligne ${index + 1}`}>
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {!readOnly && (
                <div>
                    <Button variant="outline" size="sm" onClick={addLine}>
                        <Plus className="size-4" />Ajouter une ligne
                    </Button>
                </div>
            )}
        </div>
    );
}
