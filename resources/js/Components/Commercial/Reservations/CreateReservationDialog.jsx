import { useState } from "react";
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
import ProductCombobox from "@/Components/Commercial/Reservations/ProductCombobox";

export default function CreateReservationDialog({ open, onOpenChange, onConfirm, products }) {
    const [clientName, setClientName] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [remark, setRemark] = useState("");

    const canConfirm =
        clientName.trim().length > 0 &&
        productId !== "" &&
        Number(quantity) >= 1;

    const handleConfirm = () => {
        if (!canConfirm) return;
        onConfirm({
            client_name: clientName.trim(),
            product_id: Number(productId),
            quantity: Number(quantity),
            remark: remark.trim() || null,
        });
        reset();
    };

    const handleClose = () => {
        onOpenChange(false);
        reset();
    };

    const reset = () => {
        setClientName("");
        setProductId("");
        setQuantity("1");
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
                        <ProductCombobox
                            products={products}
                            value={productId}
                            onChange={setProductId}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">
                            Quantité à réserver <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={quantity}
                            onChange={(e) => {
                                const v = e.target.value.replace(/[^0-9]/g, "");
                                setQuantity(v === "" ? "" : Math.max(1, Number(v)));
                            }}
                            placeholder="Ex : 10"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
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
