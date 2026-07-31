import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import LocalAdminStockStats from "@/Components/LocalAdmin/LocalAdminStockStats";
import LocalAdminStockFilters from "@/Components/LocalAdmin/LocalAdminStockFilters";
import LocalAdminStockTable from "@/Components/LocalAdmin/LocalAdminStockTable";
import CategoryThresholdsCard from "@/Components/LocalAdmin/CategoryThresholdsCard";

export default function LocalAdminStockIndex({
    user,
    products,
    productsMeta,
    stats,
    categories,
    agencies,
    categoryThresholds,
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
                        title="Stock global"
                        description="Consultation du stock de toutes les agences (lecture seule)"
                    />
                </motion.div>

                <LocalAdminStockStats data={stats} />

                <LocalAdminStockFilters
                    filters={filters}
                    categories={categories}
                    agencies={agencies}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                <div className="hidden sm:block">
                    <LocalAdminStockTable data={products} onView={handleView} />
                </div>

                <div className="sm:hidden">
                    {products.length === 0 && (
                        <p className="py-8 text-center text-sm text-slate-500">
                            Aucun produit trouvé
                        </p>
                    )}
                    {products.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => handleView(p)}
                            className="mb-3 w-full rounded-2xl border border-slate-200/70 bg-white p-4 text-left shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900">
                                    {p.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {p.reference}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                <span>{p.category}</span>
                                <span>·</span>
                                <span>{p.agency?.name ?? "—"}</span>
                                <span>·</span>
                                <span
                                    className={
                                        p.quantity_in_stock <= p.minimum_stock
                                            ? "font-medium text-red-500"
                                            : p.maximum_stock && p.quantity_in_stock >= p.maximum_stock
                                              ? "font-medium text-orange-500"
                                              : "text-slate-700"
                                    }
                                >
                                    Qté {p.quantity_in_stock}
                                </span>
                            </div>
                        </button>
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

                <CategoryThresholdsCard thresholds={categoryThresholds} />
            </div>
        </DashboardLayout>
    );
}
