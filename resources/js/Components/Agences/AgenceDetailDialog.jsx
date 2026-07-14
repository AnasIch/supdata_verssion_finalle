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
import { MapPin, Users, Package, Phone, Mail } from "lucide-react";
import UserStatusBadge from "@/Components/Users/UserStatusBadge";

export default function AgenceDetailDialog({ open, onOpenChange, agence }) {
    if (!agence) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50">
                        <MapPin className="size-6 text-blue-500" />
                    </div>
                    <DialogTitle className="mt-2 text-center">{agence.name}</DialogTitle>
                    <DialogDescription className="text-center">{agence.address}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                            <MapPin className="size-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Ville</p>
                                <p className="text-sm font-medium text-slate-700">{agence.city}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                            <Users className="size-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Utilisateurs</p>
                                <p className="text-sm font-medium text-slate-700">{agence.userCount}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                            <Package className="size-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Articles en stock</p>
                                <p className="text-sm font-medium text-slate-700">{agence.stockItems}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                            <Phone className="size-4 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-400">Téléphone</p>
                                <p className="text-sm font-medium text-slate-700">{agence.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                        <p className="text-xs text-slate-400">Directeur</p>
                        <p className="text-sm font-medium text-slate-700">{agence.director}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                            <Mail className="size-3" />
                            {agence.directorEmail}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                        <span className="text-xs text-slate-400">Statut</span>
                        <UserStatusBadge status={agence.status} />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Fermer</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
