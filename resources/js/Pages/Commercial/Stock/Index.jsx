import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import StockStats from "@/Components/Commercial/StockStats";
import StockFilters from "@/Components/Commercial/StockFilters";
import StockTable from "@/Components/Commercial/StockTable";
import { useCommercialStock } from "@/Hooks/useCommercialStock";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

const PAGE_SIZE = 10;

export default function CommercialStockIndex() {
    const user = useMemo(() => getCurrentUser(), []);
    const {
        products: filtered,
        stats,
        filters,
        updateFilter,
        resetFilters,
    } = useCommercialStock();

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

    return (
        <DashboardLayout
            title="Stock disponible"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Stock disponible" },
            ]}
            user={user}
        >
            <Head title="Stock disponible — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PageTitle
                        title="Stock disponible"
                        description="Consultez les produits disponibles en stock."
                    />
                </motion.div>

                <StockStats data={stats} />

                <StockFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                <div className="hidden sm:block">
                    <StockTable data={paged} />
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                    {paged.map((p) => (
                        <div
                            key={p.id}
                            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900">{p.reference}</span>
                                <span className="text-xs font-medium text-slate-500">{p.agency}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{p.name}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <span>Qté: {p.quantity}</span>
                                <span>·</span>
                                <span>Réservé: {p.reservedQuantity}</span>
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
                    {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
                </div>
            </div>
        </DashboardLayout>
    );
}
