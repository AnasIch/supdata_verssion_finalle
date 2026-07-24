import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";

const disponibiliteOptions = [
    { value: "all", label: "Toutes les disponibilités" },
    { value: "available", label: "Disponible" },
    { value: "low", label: "Stock faible" },
    { value: "out_of_stock", label: "Rupture" },
];

export default function StockFilters({ filters, categories, agencies, onFilterChange, onReset }) {
    const hasActiveFilters =
        filters.search ||
        filters.category !== "all" ||
        filters.agency !== "all" ||
        filters.disponibilite !== "all";

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Rechercher par nom ou référence..."
                    value={filters.search || ""}
                    onChange={(e) => onFilterChange("search", e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <select
                    value={filters.category || "all"}
                    onChange={(e) => onFilterChange("category", e.target.value)}
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={filters.agency || "all"}
                    onChange={(e) => onFilterChange("agency", e.target.value)}
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="all">Toutes les agences</option>
                    {agencies.map((agency) => (
                        <option key={agency} value={agency}>{agency}</option>
                    ))}
                </select>

                <select
                    value={filters.disponibilite || "all"}
                    onChange={(e) => onFilterChange("disponibilite", e.target.value)}
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    {disponibiliteOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-500 hover:text-slate-700">
                        <RotateCcw className="size-3.5" />
                        Réinitialiser
                    </Button>
                )}
            </div>
        </div>
    );
}
