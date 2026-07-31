import { useForm } from "@inertiajs/react";
import { Eraser, Save } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { useToast } from "@/Components/UI/Toast";

export default function CategoryThresholdRow({ threshold }) {
    const toast = useToast();
    const { data, setData, patch, processing, errors } = useForm({
        product_id: threshold.product_id,
        minimum_stock: threshold.minimum_stock ?? 0,
        maximum_stock: threshold.maximum_stock ?? "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("al.stock.categories.thresholds"), {
            preserveScroll: true,
            onSuccess: () => {
                toast("Seuils de la catégorie mis à jour avec succès.");
            },
            onError: (errs) => {
                toast(Object.values(errs)[0] || "Impossible de mettre à jour les seuils.", "error");
            },
        });
    };

    const handleClear = () => {
        setData("minimum_stock", 0);
        setData("maximum_stock", "");
    };

    return (
        <tr className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/50">
            <td className="py-3 pl-4 pr-4 text-slate-600">{threshold.agency}</td>
            <td className="py-3 pr-4 font-medium text-slate-900">{threshold.category}</td>
            <td className="py-3 pr-4">
                <Input
                    type="number"
                    min="0"
                    step="1"
                    value={data.minimum_stock}
                    onChange={(e) => setData("minimum_stock", e.target.value)}
                    className="h-9 w-24 text-center"
                    aria-label={`Seuil minimum ${threshold.category}`}
                    aria-invalid={!!errors.minimum_stock}
                />
                {errors.minimum_stock && (
                    <p className="mt-1 text-xs text-red-500">{errors.minimum_stock}</p>
                )}
            </td>
            <td className="py-3 pr-4">
                <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Aucun"
                    value={data.maximum_stock}
                    onChange={(e) => setData("maximum_stock", e.target.value)}
                    className="h-9 w-24 text-center"
                    aria-label={`Seuil maximum ${threshold.category}`}
                    aria-invalid={!!errors.maximum_stock}
                />
                {errors.maximum_stock && (
                    <p className="mt-1 text-xs text-red-500">{errors.maximum_stock}</p>
                )}
            </td>
            <td className="py-3 pr-4">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={processing}
                        aria-busy={processing}
                    >
                        <Save className="size-3.5" />
                        {processing ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        disabled={processing}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        <Eraser className="size-3.5" />
                        Effacer
                    </Button>
                </div>
            </td>
        </tr>
    );
}
