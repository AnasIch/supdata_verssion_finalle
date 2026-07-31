import { useState } from "react";
import { router } from "@inertiajs/react";
import { ArrowRight, ClipboardList, Plus } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { useToast } from "@/Components/UI/Toast";
import { useInventaires } from "@/Hooks/useInventaires";
import CreateInventoryDialog from "./CreateInventoryDialog";
import InventoryKpiCards from "./InventoryKpiCards";

export default function InventorySection({ user }) {
    const toast = useToast();
    const { stats, agencies, responsables, createItem } = useInventaires({}, { remote: false });
    const [createOpen, setCreateOpen] = useState(false);

    const submit = (values) => {
        createItem(values);
        setCreateOpen(false);
        toast("Inventaire créé. Saisie des produits…");
    };

    return (
        <Card className="rounded-lg border-slate-300 shadow-none">
            <CardHeader>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">📦 Inventaire</p>
                        <CardTitle className="mt-1">Contrôles physiques du stock</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">Comptez, comparez et corrigez les écarts par agence.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => router.get(route("rs.inventaires.index"))}>
                            <ClipboardList className="size-4" />Historique des inventaires
                        </Button>
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />Créer un inventaire
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <InventoryKpiCards data={stats} />
                <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                    <p className="text-sm text-emerald-900">
                        Les écarts détectés lors des inventaires ne sont pas appliqués automatiquement au stock.
                    </p>
                    <Button size="sm" variant="ghost" className="shrink-0 text-emerald-900" onClick={() => router.get(route("rs.inventaires.index"))}>
                        Gérer les écarts<ArrowRight className="size-3.5" />
                    </Button>
                </div>
            </CardContent>
            <CreateInventoryDialog open={createOpen} onOpenChange={setCreateOpen} agencies={agencies} responsables={responsables} user={user} onSubmit={submit} />
        </Card>
    );
}
