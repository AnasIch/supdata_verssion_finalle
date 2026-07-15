import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { useToast } from "@/Components/UI/Toast";
import DemandeStats from "@/Components/Demandes/DemandeStats";
import DemandeFilters from "@/Components/Demandes/DemandeFilters";
import DemandeTable from "@/Components/Demandes/DemandeTable";
import DemandeCard from "@/Components/Demandes/DemandeCard";
import ValidateDemandeDialog from "@/Components/Demandes/ValidateDemandeDialog";
import RefuseDemandeDialog from "@/Components/Demandes/RefuseDemandeDialog";
import { useDemandes } from "@/Hooks/useDemandes";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

const PAGE_SIZE = 8;

export default function DemandeIndex() {
    const user = useMemo(() => getCurrentUser(), []);
    const toast = useToast();
    const {
        demandes: filtered,
        stats,
        filters,
        updateFilter,
        resetFilters,
        handleValidate,
        handleRefuse,
    } = useDemandes();

    const [currentPage, setCurrentPage] = useState(1);
    const [validateTarget, setValidateTarget] = useState(null);
    const [validateOpen, setValidateOpen] = useState(false);
    const [refuseTarget, setRefuseTarget] = useState(null);
    const [refuseOpen, setRefuseOpen] = useState(false);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleFilterChange = (key, value) => {
        updateFilter(key, value);
        setCurrentPage(1);
    };

    const handleReset = () => {
        resetFilters();
        setCurrentPage(1);
    };

    const handleView = (demande) => {
        window.location.href = `${getDashboardPath(user.role)}/demandes/${demande.id}`;
    };

    const handleValidateClick = (demande) => {
        setValidateTarget(demande);
        setValidateOpen(true);
    };

    const handleRefuseClick = (demande) => {
        setRefuseTarget(demande);
        setRefuseOpen(true);
    };

    const handleConfirmValidate = (id) => {
        handleValidate(id);
        toast(`Demande « ${validateTarget.id} » validée avec succès.`, "success");
        setValidateOpen(false);
        setValidateTarget(null);
    };

    const handleConfirmRefuse = (id, reason) => {
        handleRefuse(id, reason);
        toast(`Demande « ${refuseTarget.id} » refusée.`, "info");
        setRefuseOpen(false);
        setRefuseTarget(null);
    };

    return (
        <DashboardLayout
            title="Demandes"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
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
                        data={paged}
                        onView={handleView}
                        onValidate={handleValidateClick}
                        onRefuse={handleRefuseClick}
                    />
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                    {paged.map((d, i) => (
                        <DemandeCard
                            key={d.id}
                            demande={d}
                            onView={handleView}
                            onValidate={handleValidateClick}
                            onRefuse={handleRefuseClick}
                            delay={i * 0.03}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-3 text-sm text-slate-500">
                            Page {currentPage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}

                <div className="text-sm text-slate-500">
                    {filtered.length} demande{filtered.length !== 1 ? "s" : ""}
                </div>
            </div>

            <ValidateDemandeDialog
                open={validateOpen}
                onOpenChange={setValidateOpen}
                demande={validateTarget}
                onConfirm={handleConfirmValidate}
            />
            <RefuseDemandeDialog
                open={refuseOpen}
                onOpenChange={setRefuseOpen}
                demande={refuseTarget}
                onConfirm={handleConfirmRefuse}
            />
        </DashboardLayout>
    );
}
