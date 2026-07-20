import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/Components/UI/Input";
import { Button } from "@/Components/UI/Button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Components/UI/Select";

export default function UsersFilters({ filters, onFilterChange, onReset, roles = [], agencies = [] }) {
    const hasActiveFilters = filters.role !== "all" || filters.agency !== "all" || filters.status !== "all" || filters.search.length > 0;

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <SlidersHorizontal className="size-4" />
                    Filtres
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Rechercher un utilisateur..."
                            value={filters.search}
                            onChange={(e) => onFilterChange("search", e.target.value)}
                            className="pl-9"
                            aria-label="Rechercher un utilisateur"
                        />
                    </div>

                    <Select value={filters.role} onValueChange={(v) => onFilterChange("role", v)}>
                        <SelectTrigger aria-label="Filtrer par rôle">
                            <SelectValue placeholder="Rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les rôles</SelectItem>
                            {roles.map((r) => (
                                <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.agency} onValueChange={(v) => onFilterChange("agency", v)}>
                        <SelectTrigger aria-label="Filtrer par agence">
                            <SelectValue placeholder="Agence" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les agences</SelectItem>
                            {agencies.map((a) => (
                                <SelectItem key={a.id} value={a.city}>{a.city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.status} onValueChange={(v) => onFilterChange("status", v)}>
                        <SelectTrigger aria-label="Filtrer par statut">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-500">
                            <X className="size-3.5" />
                            Réinitialiser
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}