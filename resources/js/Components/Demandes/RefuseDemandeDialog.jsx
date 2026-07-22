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

export default function RefuseDemandeDialog({ open, onOpenChange, demande, onConfirm }) {
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        if (demande) {
            onConfirm(demande.id, reason);
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
                    <DialogTitle className="text-center">Refuser la demande</DialogTitle>
                    <DialogDescription className="text-center">
                        Refuser la demande <span className="font-medium text-slate-700">{demande?.id}</span> avec un motif.
                        <br />
                        <span className="text-xs text-slate-400">
                            Le motif sera enregistré dans le système.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div className="px-1">
                    <label htmlFor="refuse-reason" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Motif du refus <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                        id="refuse-reason"
                        placeholder="Saisissez le motif du refus..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        className="w-full"
                    />
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleCancel}>
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                    >
                        Confirmer le refus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
