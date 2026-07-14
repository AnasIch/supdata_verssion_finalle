import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    Users,
    Package,
    TrendingUp,
    Search,
    SlidersHorizontal,
    Eye,
    Pencil,
    MoreHorizontal,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Card, CardContent } from "@/Components/UI/Card";
import { Skeleton } from "@/Components/UI/Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/Components/UI/DropdownMenu";
import { TablePagination } from "@/Components/UI/TablePagination";
import UserStatusBadge from "@/Components/Users/UserStatusBadge";
import { agencies } from "@/Mocks/agencies";

const PAGE_SIZE = 10;

function StatSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-5">
                        <Skeleton className="size-11 rounded-xl" />
                        <div className="mt-4 flex flex-col gap-2">
                            <Skeleton className="h-7 w-12" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function TableSkeleton() {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-slate-50 py-3 last:border-0">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="size-8 rounded-lg" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AgenciesIndex() {
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    const stats = useMemo(() => {
        const totalUsers = agencies.reduce((sum, a) => sum + a.userCount, 0);
        const totalProducts = agencies.reduce((sum, a) => sum + a.productCount, 0);
        const activeAgencies = agencies.filter((a) => a.status === "active").length;
        return [
            { icon: Building2, label: "Total agences", value: agencies.length, color: "bg-blue-50 text-blue-600" },
            { icon: Users, label: "Utilisateurs actifs", value: totalUsers, color: "bg-purple-50 text-purple-600" },
            { icon: Package, label: "Produits en stock", value: totalProducts, color: "bg-amber-50 text-amber-600" },
            { icon: TrendingUp, label: "Agences actives", value: activeAgencies, color: "bg-emerald-50 text-emerald-600" },
        ];
    }, []);

    const filtered = useMemo(() => {
        let result = [...agencies];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (a) =>
                    a.name.toLowerCase().includes(q) ||
                    a.city.toLowerCase().includes(q) ||
                    a.director.toLowerCase().includes(q)
            );
        }
        result.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "userCount") return b.userCount - a.userCount;
            if (sortBy === "productCount") return b.productCount - a.productCount;
            return 0;
        });
        return result;
    }, [search, sortBy]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <DashboardLayout
            title="Agences"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Agences" }]}
        >
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PageTitle
                        title="Gestion des agences"
                        description="Consultez et gérez les agences SUPDATA."
                    />
                </motion.div>

                {loading ? <StatSkeleton /> : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((c, i) => (
                            <motion.div
                                key={c.label}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.05 }}
                                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                            >
                                <Card className="transition-shadow hover:shadow-md">
                                    <CardContent className="p-5">
                                        <div className={`flex size-11 items-center justify-center rounded-xl ${c.color}`}>
                                            <c.icon className="size-5" />
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-2xl font-bold tracking-tight text-slate-900">{c.value}</p>
                                            <p className="mt-0.5 text-sm text-slate-500">{c.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une agence..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 shadow-[0_1px_2px_rgb(0,0,0,0.04)] placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            aria-label="Rechercher une agence"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <SlidersHorizontal className="size-4" />
                            <span>Trier par</span>
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]" aria-label="Trier les agences">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Nom</SelectItem>
                                <SelectItem value="userCount">Nombre d'utilisateurs</SelectItem>
                                <SelectItem value="productCount">Nombre de produits</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                {loading ? <TableSkeleton /> : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-4 py-3 font-medium text-slate-500">Nom</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Ville</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Responsable</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Utilisateurs</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Produits</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Statut</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Créé le</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paged.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                                                    Aucune agence trouvée.
                                                </td>
                                            </tr>
                                        ) : (
                                            paged.map((agence, i) => (
                                                <motion.tr
                                                    key={agence.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                                    className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-semibold text-blue-600">
                                                                <Building2 className="size-4" />
                                                            </div>
                                                            <span className="font-medium text-slate-900">{agence.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500">{agence.city}</td>
                                                    <td className="px-4 py-3 text-slate-600">{agence.director}</td>
                                                    <td className="px-4 py-3 text-slate-600">{agence.userCount}</td>
                                                    <td className="px-4 py-3 text-slate-600">{agence.productCount}</td>
                                                    <td className="px-4 py-3"><UserStatusBadge status={agence.status} /></td>
                                                    <td className="px-4 py-3 text-slate-400">{agence.createdAt}</td>
                                                    <td className="px-4 py-3">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                                                    aria-label={`Actions pour ${agence.name}`}
                                                                >
                                                                    <MoreHorizontal className="size-4" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem asChild>
                                                                    <a href={`/agences/${agence.id}`}>
                                                                        <Eye className="size-4" />
                                                                        Voir les détails
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <a href={`/agences/${agence.id}/modifier`}>
                                                                        <Pencil className="size-4" />
                                                                        Modifier
                                                                    </a>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
