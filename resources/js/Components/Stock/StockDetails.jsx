import { FileText, User, Calendar, MapPin, Tag, Building2, Hash, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import StockStatusBadge from "./StockStatusBadge";

export default function StockDetails({ product }) {
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
                                    <p className="text-sm font-medium text-slate-900">{product.agency}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <Hash className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Quantité</p>
                                    <p className={`text-sm font-bold ${product.quantity <= product.minThreshold ? "text-red-500" : "text-slate-900"}`}>
                                        {product.quantity} unités
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <AlertTriangle className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Seuil minimum</p>
                                    <p className="text-sm font-medium text-slate-900">{product.minThreshold} unités</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <MapPin className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Emplacement</p>
                                    <p className="text-sm font-medium text-slate-900">{product.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                    <Calendar className="size-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Dernière mise à jour</p>
                                    <p className="text-sm font-medium text-slate-900">{product.updatedAt}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:w-56">
                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                            <p className="text-xs text-slate-500">Statut</p>
                            <div className="mt-1 flex justify-center">
                                <StockStatusBadge status={product.status} />
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                            <p className="text-xs text-slate-500">Valeur unitaire</p>
                            <p className="mt-1 text-lg font-bold text-slate-900">{product.unitPrice} MAD</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function AlertTriangle({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    );
}
