import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
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

export default function CreateReservationDialog({ open, onOpenChange, onConfirm, products }) {
    const [clientName, setClientName] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [remark, setRemark] = useState("");

    const selectedProduct = useMemo(() => {
        if (!productId) return null;
        return products.find((p) => Number(p.id) === Number(productId)) || null;
    }, [productId, products]);

    const maxAvailable = selectedProduct ? selectedProduct.available : 0;

    const canConfirm =
        clientName.trim().length > 0 &&
        productId.length > 0 &&
        quantity >= 1 &&
        quantity <= maxAvailable;

    const handleConfirm = () => {
        if (!canConfirm) return;
        onConfirm({
            client_name: clientName.trim(),
            product_id: Number(productId),
            quantity,
            remark: remark.trim() || null,
        });
        setClientName("");
        setProductId("");
        setQuantity(1);
        setRemark("");
    };

    const handleClose = () => {
        onOpenChange(false);
        setClientName("");
        setProductId("");
        setQuantity(1);
        setRemark("");
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nouvelle réservation</DialogTitle>
                    <DialogDescription>
                        Créez une réservation de matériel pour un client.
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
                        <label className="text-xs font-medium text-slate-500">
                            Produit <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={productId}
                            onChange={(e) => {
                                setProductId(e.target.value);
                                setQuantity(1);
                            }}
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Sélectionnez un produit</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.available} disponible{p.available !== 1 ? "s" : ""})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedProduct && (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-slate-500">Stock disponible</label>
                            <input
                                type="text"
                                value={`${maxAvailable} unité${maxAvailable !== 1 ? "s" : ""}`}
                                disabled
                                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">
                            Quantité à réserver <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            min={1}
                            max={maxAvailable || 1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            disabled={!productId}
                            className="h-10"
                        />
                        {quantity > maxAvailable && maxAvailable > 0 && (
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
                        <Plus className="size-4" />
                        Créer la réservation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
