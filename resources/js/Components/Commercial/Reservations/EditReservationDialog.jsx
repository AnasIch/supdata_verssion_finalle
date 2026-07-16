import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
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

export default function EditReservationDialog({ open, onOpenChange, reservation, onConfirm }) {
    const [clientName, setClientName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [remark, setRemark] = useState("");

    useEffect(() => {
        if (reservation) {
            setClientName(reservation.clientName);
            setQuantity(reservation.quantity);
            setRemark(reservation.remark || "");
        }
    }, [reservation]);

    if (!reservation) return null;

    const canConfirm = clientName.trim().length > 0 && quantity >= 1;

    const handleConfirm = () => {
        if (!canConfirm) return;
        onConfirm(reservation.id, {
            clientName: clientName.trim(),
            quantity,
            remark: remark.trim(),
        });
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Modifier la réservation</DialogTitle>
                    <DialogDescription>
                        Référence : {reservation.id}
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
                            className="h-10"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">Produit</label>
                        <input
                            type="text"
                            value={reservation.productName}
                            disabled
                            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-slate-500">Agence d'origine</label>
                            <input
                                type="text"
                                value={reservation.agency}
                                disabled
                                className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-slate-500">
                                Quantité <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="h-10"
                            />
                        </div>
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
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Pencil className="size-4" />
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
