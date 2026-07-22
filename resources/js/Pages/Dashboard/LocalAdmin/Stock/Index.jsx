import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import StockStats from "@/Components/Stock/StockStats";
import StockFilters from "@/Components/Stock/StockFilters";
import StockTable from "@/Components/Stock/StockTable";
import StockCard from "@/Components/Stock/StockCard";

export default function LocalAdminStockIndex({
    user,
    products,
    productsMeta,
    stats,
    categories,
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
            router.get(route("al.stock"), params, {
                preserveState: true,
                replace: true,
            });
        },
        [filters]
    );

    const handleReset = useCallback(() => {
        setCurrentPage(1);
        router.get(route("al.stock"), {}, { preserveState: true, replace: true });
    }, []);

    const handlePageChange = useCallback(
        (page) => {
            setCurrentPage(page);
            router.get(
                route("al.stock"),
                { ...filters, page },
                { preserveState: true, replace: true }
            );
        },
        [filters]
    );

    const handleView = (product) => {
        router.get(route("al.stock.show", product.id));
    };

    return (
        <DashboardLayout
            title="Stock"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-admin-local" },
                { label: "Stock" },
            ]}
            user={user}
        >
            <Head title="Stock — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PageTitle
                        title="Gestion du stock"
                        description={`Produits de l'agence ${user.agency}`}
                    />
                </motion.div>

                <StockStats data={stats} />

                <StockFilters
                    filters={filters}
                    categories={categories}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                <div className="hidden sm:block">
                    <StockTable data={products} onView={handleView} />
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                    {products.map((p, i) => (
                        <StockCard
                            key={p.id}
                            product={p}
                            onView={handleView}
                            delay={i * 0.03}
                        />
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
