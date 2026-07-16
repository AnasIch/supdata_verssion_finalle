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
import { stockStore } from "@/Hooks/useCommercialStock";
import { productOptions } from "@/Mocks/commercialReservations";

const agencyList = ["Casablanca", "Marrakech"];

export default function CreateReservationDialog({ open, onOpenChange, onConfirm }) {
    const [clientName, setClientName] = useState("");
    const [agency, setAgency] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [remark, setRemark] = useState("");

    const filteredProducts = useMemo(() => {
        if (!agency) return [];
        return productOptions.filter((p) => p.agency === agency);
    }, [agency]);

    const selectedProduct = productOptions.find((p) => p.id === productId);

    const stockItem = useMemo(() => {
        if (!productId) return null;
        return stockStore.products.find((p) => p.id === productId) || null;
    }, [productId, open]);

    const maxAvailable = stockItem ? stockItem.quantity - stockItem.reservedQuantity : 0;

    const canConfirm =
        clientName.trim().length > 0 &&
        agency.length > 0 &&
        productId.length > 0 &&
        quantity >= 1 &&
        quantity <= maxAvailable;

    const handleAgencyChange = (value) => {
        setAgency(value);
        setProductId("");
        setQuantity(1);
    };

    const handleConfirm = () => {
        if (!canConfirm) return;
        onConfirm({
            clientName: clientName.trim(),
            productId,
            agency,
            quantity,
            remark: remark.trim(),
        });
        setClientName("");
        setAgency("");
        setProductId("");
        setQuantity(1);
        setRemark("");
    };

    const handleClose = () => {
        onOpenChange(false);
        setClientName("");
        setAgency("");
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
                            Agence d'origine <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={agency}
                            onChange={(e) => handleAgencyChange(e.target.value)}
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            <option value="">Sélectionnez une agence</option>
                            {agencyList.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

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
                            disabled={!agency}
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        >
                            <option value="">
                                {agency ? "Sélectionnez un produit" : "Choisir une agence d'abord"}
                            </option>
                            {filteredProducts.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {stockItem && (
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
