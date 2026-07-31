import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/UI/Card";
import { SearchInput } from "@/Components/UI/SearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/UI/Select";
import { PaginationBar } from "@/Components/UI/Pagination";
import { EmptyState } from "@/Components/UI/EmptyState";
import CategoryThresholdRow from "./CategoryThresholdRow";

const PER_PAGE = 5;

export default function CategoryThresholdsCard({ thresholds }) {
    const [search, setSearch] = useState("");
    const [agencyFilter, setAgencyFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const items = thresholds || [];

    const agencies = useMemo(() => {
        const seen = new Map();
        items.forEach((t) => {
            if (!seen.has(t.agency_id)) {
                seen.set(t.agency_id, t.agency);
            }
        });

        return [...seen.entries()].map(([id, name]) => ({ id, name }));
    }, [items]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return items.filter((t) => {
            const matchesSearch =
                !query ||
                t.category.toLowerCase().includes(query) ||
                (t.agency || "").toLowerCase().includes(query);
            const matchesAgency =
                agencyFilter === "all" || String(t.agency_id) === String(agencyFilter);

            return matchesSearch && matchesAgency;
        });
    }, [items, search, agencyFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleAgencyFilter = (value) => {
        setAgencyFilter(value);
        setCurrentPage(1);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span className="text-xl" aria-hidden="true">📦</span>
                    Gestion des seuils de stock
                </CardTitle>
                <CardDescription>
                    Définissez les seuils minimum et maximum par catégorie et par agence.
                    Les produits héritent automatiquement de ces valeurs sauf si un seuil spécifique est défini.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {items.length > 0 && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <SearchInput
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            onClear={() => handleSearch("")}
                            placeholder="Rechercher une catégorie ou une agence..."
                            className="w-full sm:max-w-xs"
                            aria-label="Rechercher une catégorie ou une agence"
                        />
                        <Select value={agencyFilter} onValueChange={handleAgencyFilter}>
                            <SelectTrigger className="w-full sm:w-56" aria-label="Filtrer par agence">
                                <SelectValue placeholder="Toutes les agences" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les agences</SelectItem>
                                {agencies.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>
                                        {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {items.length === 0 ? (
                    <EmptyState
                        icon={<span className="text-3xl" aria-hidden="true">📦</span>}
                        title="Aucun seuil trouvé."
                        description="Aucune catégorie n'est disponible pour le moment."
                    />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={<span className="text-3xl" aria-hidden="true">📦</span>}
                        title="Aucun seuil trouvé."
                        description="Aucun résultat ne correspond à votre recherche."
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-slate-100">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        <th className="py-3 pl-4 pr-4 font-medium">Agence</th>
                                        <th className="py-3 pr-4 font-medium">Catégorie</th>
                                        <th className="py-3 pr-4 font-medium">Seuil minimum</th>
                                        <th className="py-3 pr-4 font-medium">Seuil maximum</th>
                                        <th className="py-3 pr-4 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageItems.map((t) => (
                                        <CategoryThresholdRow
                                            key={`${t.agency_id}-${t.category}`}
                                            threshold={t}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <PaginationBar
                            currentPage={safePage}
                            totalPages={totalPages}
                            total={filtered.length}
                            perPage={PER_PAGE}
                            onPageChange={setCurrentPage}
                            className="border-t-0 px-0 py-1"
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
}
