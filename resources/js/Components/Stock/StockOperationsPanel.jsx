import { useState } from "react";
import { Edit3, Eye, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Input } from "@/Components/UI/Input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/Dialog";
import { useToast } from "@/Components/UI/Toast";
import StockOperationForm from "./StockOperationForm";

const emptyForm = { nom: "", detail: "", agence: "Casablanca", quantite: "" };
const criticalStatuses = ["Rupture", "Critique"];
const warningStatuses = ["Stock faible", "À contrôler", "À valider", "À confirmer", "En transit", "En cours"];

export default function StockOperationsPanel({ operations }) {
    const toast = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
    const openEdit = (item) => { setEditing(item); setForm({ nom: item.nom, detail: item.detail, agence: item.agence, quantite: item.quantite }); setDialogOpen(true); };
    const submit = () => {
        if (form.nom.trim().length < 2 || form.quantite === "" || Number(form.quantite) < 0 || (operations.section === "inventaires" && Number(form.quantite) > 100)) return toast("Vérifiez le libellé et la quantité.", "error");
        if (editing) operations.updateItem(editing.id, form); else operations.createItem(form);
        setDialogOpen(false); toast(editing ? "Élément modifié." : "Élément créé.");
    };
    const workflowAction = (item) => {
        if (operations.config.workflow === "reception") { operations.transitionItem(item.id, "Validée"); toast(`Réception validée. Les utilisateurs concernés sont informés de l’arrivée à ${item.agence}.`); }
        if (operations.config.workflow === "livraison") { operations.transitionItem(item.id, "Confirmée"); toast("Livraison au client confirmée."); }
        if (operations.config.workflow === "alerte") { operations.transitionItem(item.id, "Commercial informé"); toast("Responsable Commercial informé automatiquement de l’indisponibilité.", "warning"); }
    };
    const columns = [
        { header: "Référence", accessorKey: "id", className: "font-mono text-xs font-semibold" },
        { header: "Élément", cell: (item) => <div><p className="font-medium text-slate-900">{item.nom}</p><p className="text-xs text-slate-500">{item.detail}</p></div> },
        { header: "Agence", accessorKey: "agence" },
        { header: operations.config.titre === "Inventaires" ? "Progression" : "Quantité", cell: (item) => <span className="font-mono font-semibold tabular-nums">{item.quantite}{operations.config.titre === "Inventaires" ? " %" : ""}</span> },
        { header: "Statut", cell: (item) => <Badge variant={criticalStatuses.includes(item.statut) ? "destructive" : warningStatuses.includes(item.statut) ? "warning" : "success"}>{item.statut}</Badge> },
        { header: "Actions", cell: (item) => <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelected(item)} aria-label={`Consulter ${item.nom}`}><Eye className="size-3.5"/></Button>
            {operations.config.workflow && operations.canTransition(item) && <Button size="sm" onClick={() => workflowAction(item)}>{operations.config.workflow === "reception" ? "Valider" : operations.config.workflow === "livraison" ? "Confirmer" : "Informer"}</Button>}
            {operations.config.canCrud && <><Button size="sm" variant="outline" onClick={() => openEdit(item)} aria-label={`Modifier ${item.nom}`}><Edit3 className="size-3.5"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={() => { operations.deleteItem(item.id); toast("Élément supprimé.", "warning"); }} aria-label={`Supprimer ${item.nom}`}><Trash2 className="size-3.5"/></Button></>}
        </div>, className: "text-right" },
    ];
    return <>
        <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent><DialogHeader><DialogTitle>Détail · {selected?.id}</DialogTitle><DialogDescription>{operations.config.titre}</DialogDescription></DialogHeader>{selected && <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Élément</p><p className="mt-1 font-semibold">{selected.nom}</p></div><div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Agence</p><p className="mt-1 font-semibold">{selected.agence}</p></div><div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Détail</p><p className="mt-1 font-semibold">{selected.detail}</p></div><div className="rounded-lg border p-3"><p className="text-xs text-slate-500">Quantité / progression</p><p className="mt-1 font-mono font-semibold">{selected.quantite}{operations.config.titre === "Inventaires" ? " %" : ""}</p></div><div className="rounded-lg border p-3 sm:col-span-2"><p className="text-xs text-slate-500">Statut actuel</p><div className="mt-2"><Badge variant={criticalStatuses.includes(selected.statut) ? "destructive" : warningStatuses.includes(selected.statut) ? "warning" : "success"}>{selected.statut}</Badge></div></div>{selected.notification && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 sm:col-span-2"><p className="text-xs font-medium text-emerald-700">Notification automatique</p><p className="mt-1 text-sm font-semibold text-emerald-900">{selected.notification}</p><p className="mt-1 text-xs text-emerald-700">{selected.notifiedAt || selected.validatedAt}</p></div>}</div>}<DialogFooter><Button onClick={() => setSelected(null)}>Fermer</Button></DialogFooter></DialogContent></Dialog>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? `Modifier ${editing.id}` : operations.config.action}</DialogTitle><DialogDescription>Les données sont enregistrées uniquement dans le navigateur.</DialogDescription></DialogHeader><StockOperationForm section={operations.section} values={form} onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}/><DialogFooter><Button variant="ghost" onClick={() => setDialogOpen(false)}>Annuler</Button><Button onClick={submit}>{editing ? "Enregistrer" : "Créer"}</Button></DialogFooter></DialogContent></Dialog>
        <div className="flex flex-col gap-6">
            <header className="border-b-2 border-emerald-900 pb-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">Responsable Stock</p><h1 className="mt-2 text-2xl font-semibold text-slate-950">{operations.config.titre}</h1><p className="mt-2 text-sm text-slate-500">{operations.config.description}</p></div>{operations.config.action && <Button onClick={openCreate}><Plus className="size-4"/>{operations.config.action}</Button>}</div></header>
            <Card className="rounded-lg border-slate-300 shadow-none"><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>Registre opérationnel</CardTitle><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input className="pl-9" value={operations.search} onChange={(event) => operations.setSearch(event.target.value)} placeholder="Rechercher…"/></div><select className="rounded-md border border-slate-200 bg-white px-3 text-sm" value={operations.agency} onChange={(event) => operations.setAgency(event.target.value)}><option>Toutes</option><option>Casablanca</option><option>Marrakech</option></select><Button variant="ghost" size="sm" onClick={() => { operations.reset(); toast("Données de démonstration réinitialisées.", "info"); }} aria-label="Réinitialiser"><RotateCcw className="size-4"/></Button></div></div></CardHeader><CardContent><DataTable columns={columns} data={operations.items} emptyMessage="Aucun élément trouvé."/></CardContent></Card>
        </div>
    </>;
}
