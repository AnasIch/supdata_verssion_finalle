import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Head, router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { useToast } from "@/Components/UI/Toast";
import DemandeStats from "@/Components/Demandes/DemandeStats";
import DemandeFilters from "@/Components/Demandes/DemandeFilters";
import DemandeTable from "@/Components/Demandes/DemandeTable";
import DemandeCard from "@/Components/Demandes/DemandeCard";
import ValidateDemandeDialog from "@/Components/Demandes/ValidateDemandeDialog";
import RefuseDemandeDialog from "@/Components/Demandes/RefuseDemandeDialog";
import { getDashboardPath } from "@/lib/mockAuth";

export default function DemandeIndex({ user, demandes, demandesMeta, stats, filters }) {
    const toast = useToast();
    const { flash } = usePage().props;

    const basePath = getDashboardPath(user?.role || "admin_local");

    const [confirmTarget, setConfirmTarget] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rejectOpen, setRejectOpen] = useState(false);

    const handleFilterChange = useCallback((key, value) => {
        const params = { ...filters, [key]: value };
        if (value === "all") delete params[key];
        router.get(`${basePath}/demandes`, params, {
            preserveState: true,
            replace: true,
        });
    }, [filters, basePath]);

    const handleReset = useCallback(() => {
        router.get(`${basePath}/demandes`, {}, {
            preserveState: true,
            replace: true,
        });
    }, [basePath]);

    const handleView = useCallback((demande) => {
        router.get(`${basePath}/demandes/${demande.id}`);
    }, [basePath]);

    const handleConfirmClick = useCallback((demande) => {
        setConfirmTarget(demande);
        setConfirmOpen(true);
    }, []);

    const handleRejectClick = useCallback((demande) => {
        setRejectTarget(demande);
        setRejectOpen(true);
    }, []);

    const handleConfirmValidate = useCallback((id) => {
        router.post(`${basePath}/demandes/${id}/confirmer`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast("Demande confirmée avec succès.", "success");
                setConfirmOpen(false);
                setConfirmTarget(null);
            },
            onError: () => toast("Erreur lors de la confirmation.", "error"),
        });
    }, [basePath, toast]);

    const handleConfirmReject = useCallback((id, reason) => {
        router.post(`${basePath}/demandes/${id}/rejeter`, { reason }, {
            preserveScroll: true,
            onSuccess: () => {
                toast("Demande rejetée.", "info");
                setRejectOpen(false);
                setRejectTarget(null);
            },
            onError: () => toast("Erreur lors du rejet.", "error"),
        });
    }, [basePath, toast]);

    const handlePageChange = useCallback((page) => {
        router.get(`${basePath}/demandes`, { ...filters, page }, {
            preserveState: true,
            replace: true,
        });
    }, [filters, basePath]);

    return (
        <DashboardLayout
            title="Demandes"
            breadcrumbs={[
                { label: "Dashboard", href: basePath },
                { label: "Demandes" },
            ]}
            user={user}
        >
            <Head title="Demandes — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PageTitle
                        title="Gestion des demandes"
                        description="Consultez et traitez les demandes de votre agence."
                    />
                </motion.div>

                <DemandeStats data={stats} />

                <DemandeFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                <div className="hidden sm:block">
                    <DemandeTable
                        data={demandes}
                        onView={handleView}
                        onConfirm={handleConfirmClick}
                        onReject={handleRejectClick}
                    />
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                    {demandes.map((d, i) => (
                        <DemandeCard
                            key={d.id}
                            demande={d}
                            onView={handleView}
                            onConfirm={handleConfirmClick}
                            onReject={handleRejectClick}
                            delay={i * 0.03}
                        />
                    ))}
                </div>

                {demandesMeta.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => handlePageChange(demandesMeta.currentPage - 1)}
                            disabled={demandesMeta.currentPage === 1}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-3 text-sm text-slate-500">
                            Page {demandesMeta.currentPage} / {demandesMeta.lastPage}
                        </span>
                        <button
                            type="button"
                            onClick={() => handlePageChange(demandesMeta.currentPage + 1)}
                            disabled={demandesMeta.currentPage === demandesMeta.lastPage}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}

                <div className="text-sm text-slate-500">
                    {demandesMeta.total} demande{demandesMeta.total !== 1 ? "s" : ""}
                </div>
            </div>

            <ValidateDemandeDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                demande={confirmTarget}
                onConfirm={handleConfirmValidate}
            />
            <RefuseDemandeDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                demande={rejectTarget}
                onConfirm={handleConfirmReject}
            />
        </DashboardLayout>
    );
}
