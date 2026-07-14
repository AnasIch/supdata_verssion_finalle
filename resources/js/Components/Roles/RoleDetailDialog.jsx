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
import { Check, X, Users, Lock } from "lucide-react";

const permissionCategories = {
    "Utilisateurs": ["Voir les utilisateurs", "Créer un utilisateur", "Modifier un utilisateur", "Supprimer un utilisateur"],
    "Achats": ["Voir les achats", "Créer un achat", "Modifier un achat", "Supprimer un achat"],
    "Stock": ["Voir le stock", "Modifier le stock"],
    "Agences": ["Voir les agences", "Modifier les agences"],
    "Rapports": ["Voir les rapports", "Exporter les rapports"],
    "Paramètres": ["Voir les paramètres", "Modifier les paramètres"],
    "Audit Logs": ["Voir les logs d'audit"],
};

export default function RoleDetailDialog({ open, onOpenChange, role }) {
    if (!role) return null;

    const Icon = role.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100">
                        <Icon className="size-6 text-slate-600" />
                    </div>
                    <DialogTitle className="mt-2 text-center">{role.nom}</DialogTitle>
                    <DialogDescription className="text-center">
                        {role.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center gap-6 py-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <Users className="size-4 text-slate-400" />
                        <span>
                            <span className="font-semibold text-slate-700">{role.nombreUtilisateurs}</span>{" "}
                            utilisateur{role.nombreUtilisateurs !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Lock className="size-4 text-slate-400" />
                        <span>
                            <span className="font-semibold text-slate-700">{role.nombrePermissions}</span>{" "}
                            permission{role.nombrePermissions !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-5 py-2">
                    {Object.entries(permissionCategories).map(([category, perms]) => (
                        <div key={category}>
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {category}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {perms.map((perm) => {
                                    const granted = role.permissions.includes(perm);
                                    return (
                                        <span
                                            key={perm}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                                granted
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 bg-slate-50 text-slate-400 line-through"
                                            }`}
                                        >
                                            {granted ? (
                                                <Check className="size-3" />
                                            ) : (
                                                <X className="size-3" />
                                            )}
                                            {perm}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
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
