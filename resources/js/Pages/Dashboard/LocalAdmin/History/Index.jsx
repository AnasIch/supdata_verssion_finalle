import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useLocalAdminHistory } from "@/Hooks/useLocalAdminHistory";
import HistoryStats from "@/Components/LocalAdmin/History/HistoryStats";
import HistoryTable from "@/Components/LocalAdmin/History/HistoryTable";
import { SearchInput } from "@/Components/UI/SearchInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { Button } from "@/Components/UI/Button";

export default function LocalAdminHistory({ user, logs, pagination, stats, actions, filters }) {
    const {
        search,
        setSearch,
        actionFilter,
        setActionFilter,
        periodFilter,
        setPeriodFilter,
        currentPage,
        setCurrentPage,
        totalPages,
        filteredCount,
        resetFilters,
    } = useLocalAdminHistory({
        initialLogs: logs,
        initialFilters: filters,
        initialPagination: pagination,
        initialStats: stats,
        initialActions: actions,
    });

    const hasFilters = search || actionFilter !== "all" || periodFilter !== "all";

    const periodOptions = [
        { value: "all", label: "Toutes les périodes" },
        { value: "today", label: "Aujourd'hui" },
        { value: "7days", label: "7 derniers jours" },
        { value: "30days", label: "30 derniers jours" },
    ];

    const actionOptions = [
        { value: "all", label: "Toutes les actions" },
        ...actions.map((a) => ({ value: a, label: a })),
    ];

    return (
        <DashboardLayout
            title="Historique — Agence"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-admin-local" },
                { label: "Historique" },
            ]}
            user={user}
        >
            <Head title="Historique — Agence — SUPDATA" />

            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Historique des activités</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Consultez toutes les actions effectuées dans votre agence
                        </p>
                    </div>
                </motion.div>

                <HistoryStats stats={stats} />

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center"
                >
                    <div className="flex-1">
                        <SearchInput
                            placeholder="Rechercher une action..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Rechercher dans l'historique"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            value={actionFilter}
                            onValueChange={setActionFilter}
                        >
                            <SelectTrigger className="w-[180px]" aria-label="Filtrer par action">
                                <SelectValue placeholder="Type d'action" />
                            </SelectTrigger>
                            <SelectContent>
                                {actionOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={periodFilter}
                            onValueChange={setPeriodFilter}
                        >
                            <SelectTrigger className="w-[180px]" aria-label="Filtrer par période">
                                <SelectValue placeholder="Période" />
                            </SelectTrigger>
                            <SelectContent>
                                {periodOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                            >
                                <RotateCcw size={14} className="mr-1.5" />
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                </motion.div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {filteredCount} activité{filteredCount !== 1 ? "s" : ""}
                        {hasFilters && " (filtré)"}
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <HistoryTable data={logs} />
                </motion.div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            <ChevronLeft size={14} />
                        </Button>
                        <span className="px-3 text-sm text-slate-600">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
