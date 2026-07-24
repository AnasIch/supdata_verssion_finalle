import { useState, useMemo, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ShieldPlus, Users, Lock, Eye, KeyRound } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getDashboardBaseFromUrl } from "@/lib/utils";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { Skeleton } from "@/Components/UI/Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import RolesStats from "@/Components/Roles/RolesStats";
import { roles as allRoles, sortOptions } from "@/Mocks/roles";

const PAGE_SIZE = 6;

function RoleCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <Skeleton className="size-12 rounded-xl" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-5 w-36" />
                <Skeleton className="mt-2 h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 bg-slate-50/50 pt-4">
                <Skeleton className="h-9 w-full rounded-lg" />
            </CardFooter>
        </Card>
    );
}

function RoleCard({ role, onViewDetails, index, base }) {
    const Icon = role.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
            <Card className="group overflow-hidden transition-shadow duration-200 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)]">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className={`flex size-12 items-center justify-center rounded-xl ${role.color}`}>
                            <Icon className="size-6" />
                        </div>
                        <Badge variant="outline" className={role.badgeColor}>
                            {role.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                    </div>
                    <CardTitle className="mt-3 text-base">{role.nom}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                        {role.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Users className="size-3.5 text-slate-400" />
                            <span>
                                <span className="font-semibold text-slate-700">{role.nombreUtilisateurs}</span>{" "}
                                utilisateur{role.nombreUtilisateurs !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Lock className="size-3.5 text-slate-400" />
                            <span>
                                <span className="font-semibold text-slate-700">{role.nombrePermissions}</span>{" "}
                                permission{role.nombrePermissions !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="border-t border-slate-100 bg-slate-50/50 pt-4">
                    <div className="flex w-full flex-col gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => onViewDetails?.(role)}
                        >
                            <Eye className="size-4" />
                            Voir les détails
                        </Button>
                        <a
                            href={`${base}/permissions/${role.id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <KeyRound className="size-4" />
                            Gérer les permissions
                        </a>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

function EmptyState({ search }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100">
                <ShieldPlus className="size-7 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucun rôle trouvé</h3>
            <p className="mt-1 text-sm text-slate-500">
                {search
                    ? `Aucun résultat pour « ${search} ». Essayez une autre recherche.`
                    : "Aucun rôle n'est disponible pour le moment."}
            </p>
        </motion.div>
    );
}

export default function RolesIndex() {
    const { url } = usePage();
    const base = getDashboardBaseFromUrl(url);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("nom");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    const filtered = useMemo(() => {
        let result = [...allRoles];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (r) =>
                    r.nom.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            if (sortBy === "nom") return a.nom.localeCompare(b.nom);
            if (sortBy === "nombreUtilisateurs") return b.nombreUtilisateurs - a.nombreUtilisateurs;
            if (sortBy === "nombrePermissions") return b.nombrePermissions - a.nombrePermissions;
            return 0;
        });

        return result;
    }, [search, sortBy]);

    const handleViewDetails = (role) => {
        window.location.href = `${base}/roles/${role.id}`;
    };

    return (
        <DashboardLayout
            title="Rôles & Permissions"
            breadcrumbs={[{ label: "Dashboard", href: base }, { label: "Rôles & Permissions" }]}
        >
            <Head title="Rôles — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Gestion des rôles"
                        description="Consultez et gérez les rôles et les permissions de la plateforme."
                    />
                    <Button className="w-full sm:w-auto" disabled>
                        <ShieldPlus className="size-4" />
                        Nouveau rôle
                    </Button>
                </motion.div>

                <RolesStats roles={allRoles} />

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
                            placeholder="Rechercher un rôle..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 shadow-[0_1px_2px_rgb(0,0,0,0.04)] placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            aria-label="Rechercher un rôle"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <SlidersHorizontal className="size-4" />
                            <span>Trier par</span>
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[200px]" aria-label="Trier les rôles">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <RoleCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState search={search} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((role, i) => (
                                    <RoleCard
                                        key={role.id}
                                        role={role}
                                        index={i}
                                        base={base}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <p>
                                {filtered.length} rôle{filtered.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
