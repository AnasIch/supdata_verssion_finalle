import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { ArrowLeft, CheckCircle2, FileSpreadsheet, Save } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/Dialog";
import { Label } from "@/Components/UI/Label";
import { Textarea } from "@/Components/UI/Textarea";
import { useToast } from "@/Components/UI/Toast";
import { useInventaires } from "@/Hooks/useInventaires";
import { InventoryStatusBadge, InventoryTypeBadge } from "@/Components/Stock/Inventaires/InventoryBadge";
import InventoryEntryTable from "@/Components/Stock/Inventaires/InventoryEntryTable";

const recap = (inventory) => [
    { label: "Date", value: inventory?.date },
    { label: "Agence", value: inventory?.agency },
    { label: "Responsable", value: inventory?.responsable },
    { label: "Produits contrôlés", value: inventory?.produits_controles },
    { label: "Écarts détectés", value: inventory?.ecarts },
    { label: "Terminé le", value: inventory?.completed_at || "—" },
];

export default function InventoryShow({ user, inventory, items, products }) {
    const toast = useToast();
    const inv = useInventaires({ products }, { remote: false });
    const [lines, setLines] = useState(items || []);
    const [observation, setObservation] = useState(inventory?.observation || "");
    const [terminateOpen, setTerminateOpen] = useState(false);
    const editable = inventory?.status === "in_progress";

    useEffect(() => {
        setLines(items || []);
        setObservation(inventory?.observation || "");
    }, [items, inventory?.observation]);

    const payload = () => ({
        observation,
        items: lines.map(({ id, product_id, system_quantity, physical_quantity, comment }) => ({
            id: id ?? null,
            product_id,
            system_quantity: Number(system_quantity) || 0,
            physical_quantity: Number(physical_quantity) || 0,
            comment,
        })),
    });

    const save = () => {
        inv.updateItem(inventory.id, payload());
        toast("Inventaire enregistré.");
    };

    const terminate = () => {
        setTerminateOpen(false);
        inv.terminateItem(inventory.id, payload());
        toast("Inventaire terminé.");
    };

    const download = () => {
        window.location.href = route("rs.inventaires.export", { inventory: inventory.id, format: "excel" });
    };

    const breadcrumbs = [
        { label: "Responsable stock", href: route("stock.dashboard") },
        { label: "Inventaires", href: route("rs.inventaires.index") },
        { label: inventory?.reference },
    ];

    return (
        <DashboardLayout title={inventory?.reference} breadcrumbs={breadcrumbs} user={user} showNotifications={false}>
            <Head title={`${inventory?.reference} — SUPDATA`} />
            <div className="flex flex-col gap-6">
                <section className="border-b-2 border-emerald-900 pb-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">Responsable Stock</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <h1 className="font-mono text-2xl font-semibold tracking-tight text-slate-950">{inventory?.reference}</h1>
                                <InventoryStatusBadge status={inventory?.status} />
                                <InventoryTypeBadge type={inventory?.type} />
                            </div>
                            <p className="mt-2 text-sm text-slate-500">{inventory?.agency} · {inventory?.date} · {inventory?.responsable}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button variant="outline" onClick={() => router.get(route("rs.inventaires.index"))}>
                                <ArrowLeft className="size-4" />Historique
                            </Button>
                            <Button variant="outline" onClick={download}>
                                <FileSpreadsheet className="size-4" />Excel
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
                    {recap(inventory).map((item) => (
                        <div key={item.label} className="rounded-xl border border-slate-200/70 bg-white p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                            <p className="mt-1.5 truncate font-mono text-sm font-semibold text-slate-900">{item.value ?? "—"}</p>
                        </div>
                    ))}
                </section>

                {!editable && (
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                        <p>Inventaire terminé le <strong>{inventory?.completed_at}</strong> par <strong>{inventory?.completed_by}</strong>. Les écarts ne sont pas appliqués automatiquement au stock.</p>
                    </div>
                )}

                <Card className="rounded-lg border-slate-300 shadow-none">
                    <CardHeader>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <CardTitle>{editable ? "Saisie des quantités" : "Contrôle effectué"}</CardTitle>
                                <p className="mt-1 text-sm text-slate-500">
                                    {editable ? "Comptez physiquement et renseignez les quantités. Les écarts sont calculés automatiquement." : "Détail des produits contrôlés lors de cet inventaire."}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline">{inventory?.produits_controles} produits contrôlés</Badge>
                                {Number(inventory?.ecarts) > 0 ? (
                                    <Badge variant={Number(inventory?.ecarts) >= 5 ? "destructive" : "warning"}>{inventory?.ecarts} écart(s)</Badge>
                                ) : (
                                    <Badge variant="success">Aucun écart</Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="observation">Observation</Label>
                            <Textarea
                                id="observation"
                                rows={3}
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                                disabled={!editable}
                                placeholder="Contexte, remarques, anomalies constatées…"
                            />
                        </div>
                        <InventoryEntryTable lines={lines} products={inv.products} onChange={setLines} readOnly={!editable} />
                        {editable && (
                            <div className="flex flex-wrap items-center justify-end gap-2">
                                <Button variant="outline" onClick={save}>
                                    <Save className="size-4" />Enregistrer
                                </Button>
                                <Button onClick={() => setTerminateOpen(true)}>
                                    <CheckCircle2 className="size-4" />Terminer l'inventaire
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={terminateOpen} onOpenChange={setTerminateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Terminer {inventory?.reference} ?</DialogTitle>
                        <DialogDescription>L'inventaire sera clôturé et ne pourra plus être modifié. Les écarts seront conservés pour analyse.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setTerminateOpen(false)}>Annuler</Button>
                        <Button onClick={terminate}>
                            <CheckCircle2 className="size-4" />Terminer l'inventaire
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
