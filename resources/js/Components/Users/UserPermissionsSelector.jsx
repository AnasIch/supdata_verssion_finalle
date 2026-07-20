import { motion } from "framer-motion";
import { Check, CheckSquare, MinusSquare } from "lucide-react";

const categories = {
    Utilisateurs: ["Créer utilisateur", "Modifier utilisateur", "Supprimer utilisateur", "Consulter utilisateurs"],
    Agences: ["Créer agence", "Modifier agence", "Supprimer agence", "Consulter agences"],
    Rapports: ["Consulter rapports", "Exporter rapports", "Créer rapports"],
    Stock: ["Gérer les stocks", "Consulter l'inventaire", "Ajuster les stocks"],
    Clients: ["Créer client", "Modifier client", "Supprimer client", "Consulter clients"],
    Produits: ["Créer produit", "Modifier produit", "Supprimer produit", "Consulter produits"],
    Commandes: ["Créer commande", "Approuver commandes", "Annuler commandes", "Consulter commandes"],
};

export default function UserPermissionsSelector({ selected, onToggle, onToggleAll }) {
    const allPerms = Object.values(categories).flat();
    const allSelected = allPerms.every((p) => selected.includes(p));
    const someSelected = allPerms.some((p) => selected.includes(p)) && !allSelected;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Permissions</h3>
                <button
                    type="button"
                    onClick={() => onToggleAll(allSelected ? [] : allPerms)}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                    {allSelected ? (
                        <>
                            <MinusSquare className="size-3.5" />
                            Tout désélectionner
                        </>
                    ) : (
                        <>
                            <CheckSquare className="size-3.5" />
                            Tout sélectionner
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(categories).map(([category, perms]) => (
                    <div key={category}>
                        <p className="mb-2 text-xs font-medium text-slate-500">{category}</p>
                        <div className="flex flex-col gap-1.5">
                            {perms.map((perm) => {
                                const checked = selected.includes(perm);
                                return (
                                    <label
                                        key={perm}
                                        onClick={(e) => { e.preventDefault(); onToggle(perm); }}
                                        className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        <div
                                            className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                                                checked
                                                    ? "border-blue-500 bg-blue-500 text-white"
                                                    : "border-slate-300 bg-white"
                                            }`}
                                        >
                                            {checked && <Check className="size-3" />}
                                        </div>
                                        <span className="select-none">{perm}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
