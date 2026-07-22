import { FileText, Calendar, Tag, Building2, Hash, Package } from "lucide-react";
import { Card, CardContent } from "@/Components/UI/Card";
import StockStatusBadge from "./StockStatusBadge";

function getAvailabilityStatus(product) {
    if (product.quantity_in_stock === 0) return "out_of_stock";
    if (product.quantity_in_stock <= product.minimum_stock) return "low";
    return "available";
}

export default function StockDetails({ product }) {
    const status = getAvailabilityStatus(product);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
                                <FileText className="size-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                                <p className="text-sm text-slate-500">{product.reference}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <Tag className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Catégorie</p>
                                    <p className="text-sm font-medium text-slate-900">{product.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <Building2 className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Agence</p>
                                    <p className="text-sm font-medium text-slate-900">{product.agency?.name ?? "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <Hash className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Quantité en stock</p>
                                    <p className={`text-sm font-bold ${product.quantity_in_stock <= product.minimum_stock ? "text-red-500" : "text-slate-900"}`}>
                                        {product.quantity_in_stock} unités
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <Package className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Quantité réservée</p>
                                    <p className="text-sm font-medium text-slate-900">{product.reserved_quantity} unités</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <Calendar className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Dernière mise à jour</p>
                                    <p className="text-sm font-medium text-slate-900">{product.updated_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:w-56">
                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                            <p className="text-xs text-slate-500">Statut</p>
                            <div className="mt-1 flex justify-center">
                                <StockStatusBadge status={status} />
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                            <p className="text-xs text-slate-500">Valeur unitaire</p>
                            <p className="mt-1 text-lg font-bold text-slate-900">{product.unit_price.toLocaleString("fr-FR")} MAD</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
