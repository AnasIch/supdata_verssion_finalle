import { Search, X } from "lucide-react";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import { cn } from "@/lib/utils";

export default function NotificationsFilter({
    search,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    categoryOptions,
    onReset,
    hasFilters,
}) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <Input
                        placeholder="Rechercher une notification…"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onCategoryChange(opt.value)}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                                categoryFilter === opt.value
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
            {hasFilters && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="text-xs text-slate-500 hover:text-slate-700"
                    >
                        <X size={12} className="mr-1" />
                        Effacer les filtres
                    </Button>
                </div>
            )}
        </div>
    );
}
