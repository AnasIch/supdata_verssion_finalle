import { useState } from "react";
import { AlertCircle, CheckCircle2, Eye, RotateCcw, Search, Send, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/UI/Alert";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/UI/Dialog";
import { Input } from "@/Components/UI/Input";
import { TablePagination } from "@/Components/UI/TablePagination";
import { Textarea } from "@/Components/UI/Textarea";
import { useToast } from "@/Components/UI/Toast";

const statusVariant = (status) => {
    if (["Rupture", "Critique", "Rejetée", "Rejetée par Administrateur Local", "Incomplet"].includes(status)) return "destructive";
    if (["À vérifier", "En attente", "En attente Administrateur Local"].includes(status)) return "warning";
    return "success";
};

const Detail = ({ label, value }) => (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">{value ?? "—"}</p>
    </div>
);

export default function AdministrativeOperationsPanel({ operations }) {
    const toast = useToast();
    const [selected, setSelected] = useState(null);
    const [decision, setDecision] = useState("");
    const [reason, setReason] = useState("");
    const isRequest = operations.section === "demandes";
    const canDecide = isRequest && selected && !["Validée et transmise", "Rejetée"].includes(selected.statut);

    const close = () => {
        setSelected(null);
        setDecision("");
        setReason("");
    };

    const confirmDecision = () => {
        const result = operations.decide(selected.id, decision, reason.trim());
        if (!result.ok) {
            toast(result.message, "error");
            return;
        }

        toast(
            decision === "Validée"
                ? "Demande validée, transmise à l’Administrateur Local et Responsable Commercial informé."
                : "Demande rejetée avec motif et Responsable Commercial informé.",
            decision === "Validée" ? "success" : "warning",
        );
        close();
    };

    const stockColumns = [
        { header: "Référence", accessorKey: "id", className: "font-mono text-xs font-semibold" },
        {
            header: "Produit",
            cell: (item) => <div><p className="font-medium">{item.nom}</p><p className="text-xs text-slate-500">{item.categorie}</p></div>,
        },
        { header: "Agence", accessorKey: "agence" },
        { header: "Disponible", cell: (item) => <span className="font-mono font-semibold">{item.disponible}</span> },
        { header: "Réservé", accessorKey: "reserve" },
        { header: "Statut", cell: (item) => <Badge variant={statusVariant(item.statut)}>{item.statut}</Badge> },
        {
            header: "Action",
            cell: (item) => <Button size="sm" variant="outline" onClick={() => setSelected(item)}><Eye className="size-3.5" />Consulter</Button>,
        },
    ];

    const requestColumns = [
        { header: "Référence", accessorKey: "id", className: "font-mono text-xs font-semibold" },
        {
            header: "Client",
            cell: (item) => <div><p className="font-medium">{item.nom}</p><p className="text-xs text-slate-500">{item.demandeur}</p></div>,
        },
        { header: "Agence", accessorKey: "agence" },
        { header: "Statut", cell: (item) => <Badge variant={statusVariant(item.statut)}>{item.statut}</Badge> },
        {
            header: "Action",
            cell: (item) => <Button size="sm" variant="outline" onClick={() => setSelected(item)}><Eye className="size-3.5" />{isRequest && !["Validée et transmise", "Rejetée"].includes(item.statut) ? "Vérifier" : "Consulter"}</Button>,
        },
    ];

    return <>
        <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && close()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Détail · {selected?.id}</DialogTitle>
                    <DialogDescription>{operations.config.titre}</DialogDescription>
                </DialogHeader>

                {selected && <div className="grid gap-3 sm:grid-cols-2">
                    {operations.section === "stock" ? <>
                        <Detail label="Produit" value={selected.nom} />
                        <Detail label="Catégorie" value={selected.categorie} />
                        <Detail label="Agence" value={selected.agence} />
                        <Detail label="Emplacement" value={selected.emplacement} />
                        <Detail label="Disponible / Réservé" value={`${selected.disponible} / ${selected.reserve}`} />
                        <Detail label="Seuil minimum" value={selected.seuil} />
                    </> : <>
                        <Detail label="Client" value={selected.nom} />
                        <Detail label="Responsable Commercial" value={selected.demandeur} />
                        <Detail label="Agence" value={selected.agence} />
                        <Detail label={isRequest ? "Produits demandés" : "Historique"} value={selected.produits || selected.historique} />
                        <Detail label="Date" value={selected.date} />
                        {isRequest && <>
                            <Detail label="Complétude" value={`${selected.completude} %`} />
                            <Detail label="Priorité" value={selected.priorite} />
                        </>}
                        {selected.motif && <div className="sm:col-span-2"><Detail label="Motif du rejet" value={selected.motif} /></div>}
                    </>}
                </div>}

                {canDecide && selected.completude !== 100 && <Alert variant="warning">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Informations incomplètes</AlertTitle>
                    <AlertDescription>La validation est bloquée. Vous pouvez rejeter la demande avec un motif précis.</AlertDescription>
                </Alert>}

                {canDecide && <>
                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-800">Décision</p>
                        <div className="flex flex-wrap gap-2">
                            <Button variant={decision === "Validée" ? "default" : "outline"} onClick={() => setDecision("Validée")} disabled={selected.completude !== 100}>
                                <Send className="size-4" />Valider et transmettre
                            </Button>
                            <Button variant={decision === "Rejetée" ? "destructive" : "outline"} onClick={() => setDecision("Rejetée")}>
                                <XCircle className="size-4" />Rejeter
                            </Button>
                        </div>
                    </div>
                    {decision === "Rejetée" && <div className="flex flex-col gap-2">
                        <Textarea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Motif obligatoire du rejet…"
                            aria-label="Motif du rejet"
                            aria-required="true"
                            aria-invalid={reason.trim().length > 0 && reason.trim().length < 5}
                        />
                        <p className="text-xs text-slate-500">Ce motif sera envoyé automatiquement au Responsable Commercial.</p>
                    </div>}
                </>}

                {isRequest && selected && !canDecide && <Alert variant={selected.statut?.includes("Rejetée") ? "warning" : "success"}>
                    {selected.statut?.includes("Rejetée") ? <XCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
                    <AlertTitle>{selected.statut}</AlertTitle>
                    <AlertDescription>{selected.statut?.includes("Rejetée") ? "Le Responsable Commercial a été informé avec le motif du rejet." : "La demande a été transmise à l'Administrateur Local et le Responsable Commercial a été informé."}</AlertDescription>
                </Alert>}

                <DialogFooter>
                    <Button variant="ghost" onClick={close}>Fermer</Button>
                    {canDecide && decision && <Button onClick={confirmDecision}>Confirmer la décision</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <div className="flex flex-col gap-6">
            <header className="border-b-2 border-slate-900 pb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">Gestion Administrative</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-950">{operations.config.titre}</h1>
                <p className="mt-2 text-sm text-slate-500">{operations.config.description}</p>
            </header>
            <Card className="rounded-lg border-slate-300 shadow-none">
                <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>Liste opérationnelle</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input className="pl-9" value={operations.search} onChange={(event) => operations.setSearch(event.target.value)} placeholder="Rechercher…" aria-label={`Rechercher dans ${operations.config.titre}`} />
                            </div>
                            <select className="rounded-md border border-slate-200 bg-white px-3 text-sm" value={operations.agency} onChange={(event) => operations.setAgency(event.target.value)} aria-label="Filtrer par agence">
                                <option value="Toutes">Toutes</option>
                                <option value="SUPDATA Casablanca">SUPDATA Casablanca</option>
                                <option value="SUPDATA Marrakech">SUPDATA Marrakech</option>
                            </select>
                            <Button variant="ghost" size="icon" onClick={() => { operations.reset(); toast("Données réinitialisées.", "info"); }} aria-label="Réinitialiser">
                                <RotateCcw className="size-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={operations.section === "stock" ? stockColumns : requestColumns} data={operations.items} emptyMessage="Aucun résultat." />
                    <TablePagination currentPage={operations.page} totalPages={operations.totalPages} onPageChange={operations.setPage} />
                </CardContent>
            </Card>
        </div>
    </>;
}
