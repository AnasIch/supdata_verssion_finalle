import { motion } from "framer-motion";
import { Send, Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Textarea } from "@/Components/UI/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import ProductSelector from "./ProductSelector";
import PrioritySelector from "./PrioritySelector";

export default function CreatePurchaseRequestForm({
    form,
    errors,
    reference,
    today,
    user,
    catalogProducts,
    onUpdateProduct,
    onChange,
    onAddProduct,
    onRemoveProduct,
    onSubmit,
    onReset,
    processing,
}) {
    return (
        <form onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-5">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-slate-900">
                            Informations générales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Référence
                                </label>
                                <input
                                    type="text"
                                    value={reference}
                                    disabled
                                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Date
                                </label>
                                <input
                                    type="text"
                                    value={today}
                                    disabled
                                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Agence
                                </label>
                                <input
                                    type="text"
                                    value={user?.agency || ""}
                                    disabled
                                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    Demandeur
                                </label>
                                <input
                                    type="text"
                                    value={user?.name || ""}
                                    disabled
                                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <ProductSelector
                            products={form.products}
                            catalogProducts={catalogProducts}
                            errors={errors}
                            onUpdate={onUpdateProduct}
                            onAdd={onAddProduct}
                            onRemove={onRemoveProduct}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <PrioritySelector
                            value={form.priority}
                            onChange={(val) => onChange("priority", val)}
                            error={errors?.priority}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-slate-900">
                            Remarque générale
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={form.comment}
                            onChange={(e) => onChange("comment", e.target.value)}
                            placeholder="Ajoutez une remarque ou un commentaire..."
                            className="min-h-[100px]"
                        />
                    </CardContent>
                </Card>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.4 }}
                    className="flex flex-col gap-3 sm:flex-row sm:justify-end"
                >
                    <Button type="button" variant="outline" onClick={onReset}>
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Send className="size-4" />
                        {processing ? "Envoi en cours..." : "Envoyer la demande"}
                    </Button>
                </motion.div>
            </div>
        </form>
    );
}
