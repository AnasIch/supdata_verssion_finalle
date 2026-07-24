import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Head, router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { useToast } from "@/Components/UI/Toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/UI/Dialog";
import DemandesStats from "@/Components/Commercial/DemandesStats";
import DemandesFilters from "@/Components/Commercial/DemandesFilters";
import DemandesTable from "@/Components/Commercial/DemandesTable";

export default function CommercialDemandesIndex({
    user,
    demandes,
    demandesMeta,
    stats,
    filters,
}) {
    const [currentPage, setCurrentPage] = useState(demandesMeta.currentPage || 1);
    const [archiveId, setArchiveId] = useState(null);
    const [showArchiveDialog, setShowArchiveDialog] = useState(false);
    const { props } = usePage();
    const toast = useToast();

    useEffect(() => {
        const flash = props.flash;
        if (flash?.success) toast(flash.success, "success");
        if (flash?.error) toast(flash.error, "error");
    }, [props.flash]);

    const handleFilterChange = useCallback(
        (key, value) => {
            const params = { ...filters, [key]: value };
            if (value === "all" || value === "") {
                delete params[key];
            }
            setCurrentPage(1);
            router.get(route("rc.demandes"), params, {
                preserveState: true,
                replace: true,
            });
        },
        [filters]
    );

    const handleReset = useCallback(() => {
        setCurrentPage(1);
        router.get(route("rc.demandes"), {}, { preserveState: true, replace: true });
    }, []);

    const handleView = useCallback((demande) => {
        router.visit(route("rc.demandes.show", demande.id));
    }, []);

    const handleArchive = useCallback((demande) => {
        setArchiveId(demande.id);
        setShowArchiveDialog(true);
    }, []);

    const confirmArchive = useCallback(() => {
        if (!archiveId) return;
        router.post(
            route("rc.demandes.archive", archiveId),
            {},
            {
                preserveState: true,
                onFinish: () => {
                    setArchiveId(null);
                    setShowArchiveDialog(false);
                },
            }
        );
    }, [archiveId]);

    const handlePageChange = useCallback(
        (page) => {
            setCurrentPage(page);
            router.get(
                route("rc.demandes"),
                { ...filters, page },
                { preserveState: true, replace: true }
            );
        },
        [filters]
    );

    return (
        <DashboardLayout
            title="Demandes d'achat"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-commercial" },
                { label: "Demandes d'achat" },
            ]}
            user={user}
        >
            <Head title="Demandes d'achat — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Mes demandes d'achat"
                        description="Consultez l'état de vos demandes d'achat."
                    />
                    <Button
                        onClick={() =>
                            router.visit(route("rc.demandes.create"))
                        }
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Plus className="size-4" />
                        Nouvelle demande
                    </Button>
                </motion.div>

                <DemandesStats data={stats} />

                <DemandesFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                <div className="hidden sm:block">
                    <DemandesTable data={demandes} onView={handleView} onArchive={handleArchive} />
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                    {demandes.map((d) => (
                        <div
                            key={d.id}
                            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900">
                                    {d.title}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleView(d)}
                                    className="text-xs font-medium text-blue-600"
                                >
                                    Voir
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                                {d.product_name}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <span>Qté: {d.quantity}</span>
                                <span>·</span>
                                <span>
                                    {new Date(d.created_at).toLocaleDateString(
                                        "fr-FR",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {demandesMeta.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    Math.max(1, currentPage - 1)
                                )
                            }
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-3 text-sm text-slate-500">
                            Page {currentPage} / {demandesMeta.lastPage}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    Math.min(
                                        demandesMeta.lastPage,
                                        currentPage + 1
                                    )
                                )
                            }
                            disabled={currentPage === demandesMeta.lastPage}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}

                <div className="text-sm text-slate-500">
                    {demandesMeta.total} demande
                    {demandesMeta.total !== 1 ? "s" : ""}
                </div>
            </div>

            <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Archiver la demande</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir archiver cette demande ? Cette action est réversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowArchiveDialog(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmArchive}
                        >
                            Archiver
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
