import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Textarea } from "@/Components/UI/Textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/UI/Dialog";

export default function ReserveStockDialog({ open, onOpenChange, product, onConfirm }) {
    const [clientName, setClientName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [remark, setRemark] = useState("");

    if (!product) return null;

    const maxAvailable = product.quantity - product.reservedQuantity;
    const canConfirm = clientName.trim().length > 0 && quantity >= 1 && quantity <= maxAvailable;

    const handleConfirm = () => {
        if (!canConfirm) return;
        onConfirm(product.id, quantity, remark, clientName.trim());
        setClientName("");
        setQuantity(1);
        setRemark("");
    };

    const handleClose = () => {
        onOpenChange(false);
        setClientName("");
        setQuantity(1);
        setRemark("");
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Réserver du stock</DialogTitle>
                    <DialogDescription>
                        Renseignez les informations de réservation pour ce produit.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">
                            Nom du client <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Ex : Hôtel Atlas, Restaurant La Mamounia..."
                            className="h-10"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">Produit</label>
                        <input
                            type="text"
                            value={product.name}
                            disabled
                            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-slate-500">Agence</label>
                            <input
                                type="text"
                                value={product.agency}
                                disabled
                                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-slate-500">Stock disponible</label>
                            <input
                                type="text"
                                value={`${maxAvailable} unité${maxAvailable !== 1 ? "s" : ""}`}
                                disabled
                                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">
                            Quantité à réserver <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            min={1}
                            max={maxAvailable}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="h-10"
                        />
                        {quantity > maxAvailable && (
                            <p className="text-xs text-red-500">
                                La quantité ne peut pas dépasser {maxAvailable}.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">Remarque (optionnelle)</label>
                        <Textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="Ajoutez une remarque..."
                            className="min-h-[70px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Bookmark className="size-4" />
                        Confirmer la réservation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
