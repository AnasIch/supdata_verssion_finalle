import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import DemandesStats from "@/Components/Commercial/DemandesStats";
import DemandesFilters from "@/Components/Commercial/DemandesFilters";
import DemandesTable from "@/Components/Commercial/DemandesTable";
import { useCommercialDemandes } from "@/Hooks/useCommercialDemandes";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

const PAGE_SIZE = 8;

export default function CommercialDemandesIndex() {
    const user = useMemo(() => getCurrentUser(), []);
    const {
        demandes: filtered,
        stats,
        filters,
        updateFilter,
        resetFilters,
    } = useCommercialDemandes();

    const [currentPage, setCurrentPage] = useState(1);

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

    return (
        <DashboardLayout
            title="Demandes d'achat"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
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
                        onClick={() => { window.location.href = `${getDashboardPath(user.role)}/demandes/creer`; }}
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
                    <DemandesTable data={paged} onView={handleView} />
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                    {paged.map((d) => (
                        <div
                            key={d.id}
                            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900">{d.id}</span>
                                <button
                                    type="button"
                                    onClick={() => handleView(d)}
                                    className="text-xs font-medium text-blue-600"
                                >
                                    Voir
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{d.product}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <span>Qté: {d.quantity}</span>
                                <span>·</span>
                                <span>{d.createdAt}</span>
                            </div>
                        </div>
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
        </DashboardLayout>
    );
}
