import { CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/UI/Dialog";
import { Button } from "@/Components/UI/Button";

export default function ValidateDemandeDialog({ open, onOpenChange, demande, onConfirm }) {
    const handleConfirm = () => {
        if (demande) {
            onConfirm(demande.id);
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="size-6 text-emerald-500" />
                    </div>
                    <DialogTitle className="text-center">Valider la demande</DialogTitle>
                    <DialogDescription className="text-center">
                        Êtes-vous sûr de vouloir valider la demande{" "}
                        <span className="font-medium text-slate-700">{demande?.id}</span> ?
                        <br />
                        <span className="text-xs text-slate-400">
                            Cette action sera implémentée lors de la phase Backend.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm} className="bg-emerald-600 text-white hover:bg-emerald-700">
                        Confirmer la validation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
