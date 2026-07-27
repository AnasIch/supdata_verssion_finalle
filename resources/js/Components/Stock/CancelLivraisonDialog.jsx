import { useState } from "react";
import { XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/UI/Dialog";
import { Button } from "@/Components/UI/Button";
import { Textarea } from "@/Components/UI/Textarea";

export default function CancelLivraisonDialog({ open, onOpenChange, reservation, onConfirm }) {
    const [reason, setReason] = useState("");
    const minLen = 20;

    const handleConfirm = () => {
        if (reservation) {
            onConfirm(reservation.id, reason);
        }
        setReason("");
        onOpenChange(false);
    };

    const handleCancel = () => {
        setReason("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50">
                        <XCircle className="size-6 text-red-500" />
                    </div>
                    <DialogTitle className="text-center">Annuler la livraison</DialogTitle>
                    <DialogDescription className="text-center">
                        Annuler la réservation <span className="font-medium text-slate-700">{reservation?.reference}</span> avec un motif.
                        <br />
                        <span className="text-xs text-slate-400">
                            Le motif sera enregistré et le Commercial sera notifié.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div className="px-1">
                    <label htmlFor="cancel-reason" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Motif de l'annulation <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                        id="cancel-reason"
                        placeholder="Saisissez le motif de l'annulation..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        minLength={minLen}
                        className="w-full"
                    />
                    <p className="mt-1.5 text-xs text-slate-400">
                        {reason.length}/{minLen} caractères minimum
                    </p>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleCancel}>
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={reason.trim().length < minLen}
                    >
                        Confirmer l'annulation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
