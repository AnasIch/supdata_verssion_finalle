import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";

export default function InventoryFilters({ filters, agencies = [], onFilterChange, onReset }) {
    const set = (key, value) => onFilterChange({ ...filters, [key]: value });

    return (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) => set("search", e.target.value)}
                    placeholder="Rechercher une référence, un produit, une agence…"
                    aria-label="Rechercher un inventaire"
                />
            </div>
            <select
                value={filters.agency}
                onChange={(e) => set("agency", e.target.value)}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Filtrer par agence"
            >
                <option value="all">Toutes les agences</option>
                {agencies.map((agency) => (
                    <option key={agency.id} value={agency.name}>{agency.name}</option>
                ))}
            </select>
            <select
                value={filters.status}
                onChange={(e) => set("status", e.target.value)}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                aria-label="Filtrer par statut"
            >
                <option value="all">Tous les statuts</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
            </select>
            <Input
                type="date"
                className="w-auto"
                value={filters.date}
                onChange={(e) => set("date", e.target.value)}
                aria-label="Filtrer par date"
            />
            <Button variant="ghost" size="icon" onClick={onReset} aria-label="Réinitialiser les filtres">
                <RotateCcw className="size-4" />
            </Button>
        </div>
    );
}
