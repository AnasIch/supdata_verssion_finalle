import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/Components/UI/Dialog";
import { Button } from "@/Components/UI/Button";
import { AlertTriangle } from "lucide-react";

export default function DeleteUserDialog({ open, onOpenChange, user, onConfirm }) {
    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle className="size-6 text-red-500" />
                    </div>
                    <DialogTitle className="mt-2 text-center">
                        Supprimer l'utilisateur
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Êtes-vous sûr de vouloir supprimer{" "}
                        <span className="font-medium text-slate-900">{user.name}</span> ?
                        Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => onConfirm?.(user)}>
                        Supprimer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
