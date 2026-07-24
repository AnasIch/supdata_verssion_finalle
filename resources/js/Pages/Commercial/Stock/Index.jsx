import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import StockStats from "@/Components/Commercial/StockStats";
import StockFilters from "@/Components/Commercial/StockFilters";
import StockTable from "@/Components/Commercial/StockTable";

export default function CommercialStockIndex({
    user,
    products,
    productsMeta,
    stats,
    categories,
    agencies,
    filters,
}) {
    const [currentPage, setCurrentPage] = useState(productsMeta.currentPage || 1);

    const handleFilterChange = useCallback(
        (key, value) => {
            const params = { ...filters, [key]: value };
            if (value === "all" || value === "") {
                delete params[key];
            }
            setCurrentPage(1);
            router.get(route("rc.stock"), params, {
                preserveState: true,
                replace: true,
            });
        },
        [filters]
    );

    const handleReset = useCallback(() => {
        setCurrentPage(1);
        router.get(route("rc.stock"), {}, { preserveState: true, replace: true });
    }, []);

    const handlePageChange = useCallback(
        (page) => {
            setCurrentPage(page);
            router.get(
                route("rc.stock"),
                { ...filters, page },
                { preserveState: true, replace: true }
            );
        },
        [filters]
    );

    return (
        <DashboardLayout
            title="Stock disponible"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-commercial" },
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
                    categories={categories}
                    agencies={agencies}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                <div className="hidden sm:block">
                    <StockTable data={products} />
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900">{p.reference}</span>
                                <span className="text-xs font-medium text-slate-500">{p.agency?.name}</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{p.name}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <span>Qté: {p.quantity_in_stock}</span>
                                <span>·</span>
                                <span>Réservé: {p.reserved_quantity}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {productsMeta.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-3 text-sm text-slate-500">
                            Page {currentPage} / {productsMeta.lastPage}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    Math.min(productsMeta.lastPage, currentPage + 1)
                                )
                            }
                            disabled={currentPage === productsMeta.lastPage}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}

                <div className="text-sm text-slate-500">
                    {productsMeta.total} produit{productsMeta.total !== 1 ? "s" : ""}
                </div>
            </div>
        </DashboardLayout>
    );
}
