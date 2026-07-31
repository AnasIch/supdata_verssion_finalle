import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { useToast } from "@/Components/UI/Toast";
import { useInventaires } from "@/Hooks/useInventaires";
import InventoryKpiCards from "@/Components/Stock/Inventaires/InventoryKpiCards";
import InventoryFilters from "@/Components/Stock/Inventaires/InventoryFilters";
import InventoryTable from "@/Components/Stock/Inventaires/InventoryTable";
import InventoryEmptyState from "@/Components/Stock/Inventaires/InventoryEmptyState";
import CreateInventoryDialog from "@/Components/Stock/Inventaires/CreateInventoryDialog";

export default function InventaireIndex({ user, inventories, pagination, stats, agencies, products, responsables, filters }) {
    const toast = useToast();
    const inv = useInventaires({ inventories, pagination, stats, agencies, products, responsables, filters });
    const [createOpen, setCreateOpen] = useState(false);

    const submit = (values) => {
        inv.createItem(values);
        setCreateOpen(false);
        toast("Inventaire créé. Saisie des produits…");
    };

    const onDelete = (row) => {
        inv.deleteItem(row.id);
        toast("Inventaire supprimé.");
    };

    const breadcrumbs = [
        { label: "Responsable stock", href: route("stock.dashboard") },
        { label: "Inventaires" },
    ];

    return (
        <DashboardLayout title="Inventaires" breadcrumbs={breadcrumbs} user={user} showNotifications={false}>
            <Head title="Inventaires — SUPDATA" />
            <div className="flex flex-col gap-6">
                <section className="border-b-2 border-emerald-900 pb-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">Responsable Stock</p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Inventaires du stock</h1>
                            <p className="mt-2 text-sm text-slate-500">Historique des contrôles physiques, écarts détectés et exports.</p>
                        </div>
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />Nouvel inventaire
                        </Button>
                    </div>
                </section>

                <InventoryKpiCards data={inv.stats} />

                <Card className="rounded-lg border-slate-300 shadow-none">
                    <CardHeader>
                        <CardTitle>Historique des inventaires</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <InventoryFilters
                            filters={{ search: inv.search, agency: inv.agency, status: inv.status, date: inv.date }}
                            agencies={inv.agencies}
                            onFilterChange={inv.setFilters}
                            onReset={inv.reset}
                        />
                        {inv.inventories.length === 0 ? (
                            <InventoryEmptyState onAction={() => setCreateOpen(true)} />
                        ) : (
                            <InventoryTable
                                inventories={inv.inventories}
                                pagination={inv.pagination}
                                onPageChange={inv.setPage}
                                onPerPageChange={inv.setPerPage}
                                onView={(row) => router.get(route("rs.inventaires.show", row.id))}
                                onEdit={(row) => router.get(route("rs.inventaires.show", row.id))}
                                onDelete={onDelete}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
            <CreateInventoryDialog open={createOpen} onOpenChange={setCreateOpen} agencies={inv.agencies} responsables={inv.responsables} user={user} onSubmit={submit} />
        </DashboardLayout>
    );
}
