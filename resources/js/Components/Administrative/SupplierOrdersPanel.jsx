import { useState } from "react";
import { Building2, CheckCircle2, Eye, FileCheck2, MapPin, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/Dialog";
import { Input } from "@/Components/UI/Input";
import { useToast } from "@/Components/UI/Toast";

const Detail = ({ label, value }) => (
    <div className="rounded-md border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
);

export default function SupplierOrdersPanel({ operations }) {
    const toast = useToast();
    const [selected, setSelected] = useState(null);

    const columns = [
        {
            header: "Demande",
            cell: (item) => <div><p className="font-mono text-xs font-semibold text-slate-900">{item.id}</p><p className="mt-1 font-medium">{item.title}</p></div>,
        },
        {
            header: "Employé",
            cell: (item) => <div><p className="font-medium">{item.requester}</p><p className="text-xs text-slate-500">{item.agency}</p></div>,
        },
        { header: "Type", accessorKey: "type" },
        { header: "Budget", cell: (item) => <span className="font-medium">{item.budget} MAD</span> },
        {
            header: "Validation Administrateur Local",
            cell: (item) => <div><p className="text-sm">{item.validatedAt || "Validée"}</p><p className="text-xs text-slate-500">par {item.validator || "Administrateur Local"}</p></div>,
        },
        { header: "État", cell: () => <Badge variant="success">Acceptée</Badge> },
        {
            header: "Action",
            cell: (item) => <Button size="sm" variant="outline" onClick={() => setSelected(item)}><Eye className="size-3.5"/>Consulter</Button>,
        },
    ];

    return <div className="flex flex-col gap-6">
        <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Demande acceptée · {selected?.id}</DialogTitle>
                    <DialogDescription>Dossier interne validé par l’Administrateur Local.</DialogDescription>
                </DialogHeader>
                {selected && <div className="grid gap-3 sm:grid-cols-2">
                    <Detail label="Employé demandeur" value={selected.requester} />
                    <Detail label="Agence" value={selected.agency} />
                    <Detail label="Objet" value={selected.title} />
                    <Detail label="Type" value={selected.type} />
                    <Detail label="Budget" value={selected.budget ? `${selected.budget} MAD` : null} />
                    <Detail label="Priorité" value={selected.priority} />
                    <Detail label="Validée le" value={selected.validatedAt} />
                    <Detail label="Administrateur Local" value={selected.validator} />
                    <div className="sm:col-span-2"><Detail label="Description" value={selected.description} /></div>
                </div>}
                <DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Fermer</Button></DialogFooter>
            </DialogContent>
        </Dialog>

        <header className="border-b-2 border-slate-900 pb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">Gestion Administrative</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">Demandes acceptées</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">Archive interne des demandes approuvées par l’Administrateur Local.</p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
            <Card className="rounded-lg border-slate-300 shadow-none"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700"><CheckCircle2 /></div><div><p className="text-2xl font-semibold">{operations.stats.approved}</p><p className="text-xs text-slate-500">demandes acceptées</p></div></CardContent></Card>
            <Card className="rounded-lg border-slate-300 shadow-none"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-blue-700"><Building2 /></div><div><p className="text-2xl font-semibold">{operations.stats.casablanca}</p><p className="text-xs text-slate-500">agence Casablanca</p></div></CardContent></Card>
            <Card className="rounded-lg border-slate-300 shadow-none"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-10 items-center justify-center rounded-md bg-violet-50 text-violet-700"><MapPin /></div><div><p className="text-2xl font-semibold">{operations.stats.marrakech}</p><p className="text-xs text-slate-500">agence Marrakech</p></div></CardContent></Card>
        </div>

        <Card className="rounded-lg border-slate-300 shadow-none">
            <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div><CardTitle>Registre des demandes acceptées</CardTitle><p className="mt-1 text-sm text-slate-500">Les validations de l’Administrateur Local sont conservées ici pour le suivi interne.</p></div>
                    <div className="flex gap-2">
                        <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input className="pl-9" value={operations.search} onChange={(event) => operations.setSearch(event.target.value)} placeholder="Rechercher…" aria-label="Rechercher une demande acceptée"/></div>
                        <Button variant="outline" size="icon" onClick={() => { operations.refresh(); toast("Liste actualisée.", "info"); }} aria-label="Actualiser"><RefreshCw className="size-4"/></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent><DataTable columns={columns} data={operations.approvals} emptyMessage="Aucune demande acceptée pour le moment."/></CardContent>
        </Card>

        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <FileCheck2 className="size-4 shrink-0"/>
            Cet espace est réservé aux employés et ne contient aucun accès externe.
        </div>
    </div>;
}
