import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Search, RotateCcw } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useLocalAdminHistory } from "@/Hooks/useLocalAdminHistory";
import HistoryStats from "@/Components/LocalAdmin/History/HistoryStats";
import HistoryTable from "@/Components/LocalAdmin/History/HistoryTable";
import { SearchInput } from "@/Components/UI/SearchInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { Button } from "@/Components/UI/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LocalAdminHistory() {
    const user = getCurrentUser();
    const {
        history,
        search,
        setSearch,
        typeFilter,
        setTypeFilter,
        typeOptions,
        currentPage,
        setCurrentPage,
        totalPages,
        filteredCount,
        stats,
    } = useLocalAdminHistory();

    const hasFilters = search || typeFilter !== "all";

    return (
        <DashboardLayout
            title="Historique — Agence"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Historique" },
            ]}
            user={user}
        >
            <Head title="Historique — Agence Casablanca — SUPDATA" />

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
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            aria-label="Rechercher dans l'historique"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select
                            value={typeFilter}
                            onValueChange={(v) => {
                                setTypeFilter(v);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[180px]" aria-label="Filtrer par type">
                                <SelectValue placeholder="Type d'activité" />
                            </SelectTrigger>
                            <SelectContent>
                                {typeOptions.map((opt) => (
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
                                onClick={() => {
                                    setSearch("");
                                    setTypeFilter("all");
                                    setCurrentPage(1);
                                }}
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
                    <HistoryTable data={history} />
                </motion.div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
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
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
