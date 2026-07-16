import { Trash2 } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/UI/Dialog";

export default function DeleteReservationDialog({ open, onOpenChange, reservation, onConfirm }) {
    if (!reservation) return null;

    const handleConfirm = () => {
        onConfirm(reservation.id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Supprimer la réservation</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer la réservation{" "}
                        <span className="font-medium text-slate-900">{reservation.id}</span> ?
                        {reservation.status === "Réservé" && (
                            <span className="mt-1 block text-xs text-amber-600">
                                Le stock réservé sera libéré.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={onOpenChange}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        <Trash2 className="size-4" />
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
