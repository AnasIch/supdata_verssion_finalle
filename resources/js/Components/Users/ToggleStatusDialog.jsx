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
import { UserCheck, UserX } from "lucide-react";

export default function ToggleStatusDialog({ open, onOpenChange, user, onConfirm }) {
    if (!user) return null;

    const isActivating = user.status !== "active";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className={`mx-auto flex size-12 items-center justify-center rounded-full ${isActivating ? "bg-emerald-50" : "bg-amber-50"}`}>
                        {isActivating ? (
                            <UserCheck className="size-6 text-emerald-500" />
                        ) : (
                            <UserX className="size-6 text-amber-500" />
                        )}
                    </div>
                    <DialogTitle className="mt-2 text-center">
                        {isActivating ? "Activer cet utilisateur ?" : "Désactiver cet utilisateur ?"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isActivating ? (
                            <>
                                <span className="font-medium text-slate-900">{user.name}</span>{" "}
                                pourra de nouveau accéder à la plateforme.
                            </>
                        ) : (
                            <>
                                <span className="font-medium text-slate-900">{user.name}</span>{" "}
                                ne pourra plus accéder à la plateforme tant qu&apos;il ne sera pas réactivé.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button
                        variant={isActivating ? "default" : "destructive"}
                        onClick={() => onConfirm?.(user, isActivating ? "active" : "inactive")}
                    >
                        {isActivating ? "Activer" : "Désactiver"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
