import { useState, useMemo, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Pencil,
    Users,
    Lock,
    Building2,
    Calendar,
    Check,
    X,
    MapPin,
    Clock,
    CircleDot,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getDashboardBaseFromUrl } from "@/lib/utils";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { Skeleton } from "@/Components/UI/Skeleton";
import UserStatusBadge from "@/Components/Users/UserStatusBadge";
import { roleDetails } from "@/Mocks/roleDetails";
import { roleUsers } from "@/Mocks/roleUsers";
import { permissionModules } from "@/Mocks/rolePermissions";
import { roles } from "@/Mocks/roles";

const ROLE_ID = 1;
const PAGE_SIZE = 5;

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

function StatCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <Skeleton className="size-11 rounded-xl" />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </CardContent>
        </Card>
    );
}

function InfoSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
            <CardContent className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-40" /></div>
                ))}
            </CardContent>
        </Card>
    );
}

function PermissionsSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
            <CardContent className="flex flex-col gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <Skeleton className="mb-3 h-4 w-28" />
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <Skeleton key={j} className="h-7 w-24 rounded-full" />
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function TimelineSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
            <CardContent className="flex flex-col gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="size-3 rounded-full" />
                        <div className="flex-1 flex flex-col gap-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function UsersTableSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-slate-50 py-3 last:border-0">
                            <Skeleton className="size-9 rounded-full" />
                            <div className="flex-1"><Skeleton className="mb-1.5 h-4 w-32" /><Skeleton className="h-3 w-48" /></div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function AgenciesSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <Skeleton className="size-10 rounded-xl" />
                            <div className="flex flex-col gap-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function RolePermissionsCard({ rolePermissions }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Permissions</CardTitle>
                <CardDescription>Permissions accordées à ce rôle, regroupées par module.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    {permissionModules.map((mod) => (
                        <div key={mod.module}>
                            <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {mod.module}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {mod.permissions.map((perm) => {
                                    const granted = rolePermissions.includes(perm.key);
                                    return (
                                        <span
                                            key={perm.key}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                                granted
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 bg-slate-50 text-slate-400 line-through"
                                            }`}
                                        >
                                            {granted ? <Check className="size-3" /> : <X className="size-3" />}
                                            {perm.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function RoleHistoryTimeline({ history }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Historique</CardTitle>
                <CardDescription>Évolutions et modifications de ce rôle.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative ml-1">
                    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />
                    <div className="flex flex-col gap-6">
                        {history.map((event, i) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.08 }}
                                className="relative flex gap-4 pl-5"
                            >
                                <div className={`absolute left-0 top-1.5 size-[11px] rounded-full border-2 ${
                                    i === history.length - 1
                                        ? "border-blue-500 bg-blue-100"
                                        : "border-slate-300 bg-white"
                                }`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{event.action}</p>
                                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                                        <Clock className="size-3" />
                                        {event.date}
                                        <span className="text-slate-300">·</span>
                                        {event.author}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function RoleAgenciesCard({ agencies }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {agencies.map((agence, i) => (
                <motion.div
                    key={agence.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                    <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{agence.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Users className="size-3" />
                                        {agence.userCount} utilisateur{agence.userCount !== 1 ? "s" : ""}
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <UserStatusBadge status={agence.status} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

function RoleUsersTable({ users, loading }) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = useMemo(() => {
        if (!search) return users;
        const q = search.toLowerCase();
        return users.filter(
            (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        );
    }, [users, search]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const getInitials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    if (loading) return <UsersTableSkeleton />;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-base">Utilisateurs affectés</CardTitle>
                        <CardDescription>{users.length} utilisateur{users.length !== 1 ? "s" : ""} avec ce rôle.</CardDescription>
                    </div>
                    <div className="relative sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            aria-label="Rechercher un utilisateur"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {paged.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-500">Aucun utilisateur trouvé.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-3 py-2.5 font-medium text-slate-500">Utilisateur</th>
                                    <th className="px-3 py-2.5 font-medium text-slate-500">Email</th>
                                    <th className="px-3 py-2.5 font-medium text-slate-500">Agence</th>
                                    <th className="px-3 py-2.5 font-medium text-slate-500">Statut</th>
                                    <th className="px-3 py-2.5 font-medium text-slate-500">Créé le</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paged.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50">
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                    {getInitials(user.name)}
                                                </div>
                                                <span className="font-medium text-slate-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-slate-500">{user.email}</td>
                                        <td className="px-3 py-2.5 text-slate-600">{user.agency}</td>
                                        <td className="px-3 py-2.5"><UserStatusBadge status={user.status} /></td>
                                        <td className="px-3 py-2.5 text-slate-400">{user.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-500">Page {currentPage} sur {totalPages}</p>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-7" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} aria-label="Page précédente">
                            <ChevronLeft className="size-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button key={p} variant={p === currentPage ? "outline" : "ghost"} size="icon" className="size-7 text-xs" onClick={() => setCurrentPage(p)} aria-label={`Page ${p}`} aria-current={p === currentPage ? "page" : undefined}>
                                {p}
                            </Button>
                        ))}
                        <Button variant="ghost" size="icon" className="size-7" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} aria-label="Page suivante">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}

export default function RoleShow() {
    const { url } = usePage();
    const base = getDashboardBaseFromUrl(url);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    const detail = roleDetails[ROLE_ID];
    const roleMock = roles.find((r) => r.id === ROLE_ID);
    const users = roleUsers[ROLE_ID] || [];

    if (loading) {
        return (
            <DashboardLayout
                title="Détail du rôle"
                breadcrumbs={[
                    { label: "Dashboard", href: base },
                    { label: "Rôles & Permissions", href: `${base}/roles-permissions` },
                    { label: "Chargement..." },
                ]}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-2"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-72" /></div>
                        <div className="flex gap-2"><Skeleton className="h-10 w-28 rounded-lg" /><Skeleton className="h-10 w-28 rounded-lg" /></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
                    </div>
                    <InfoSkeleton />
                    <PermissionsSkeleton />
                    <UsersTableSkeleton />
                    <AgenciesSkeleton />
                    <TimelineSkeleton />
                </div>
            </DashboardLayout>
        );
    }

    const Icon = roleMock?.icon || CircleDot;

    return (
        <DashboardLayout
            title="Détail du rôle"
            breadcrumbs={[
                { label: "Dashboard", href: base },
                { label: "Rôles & Permissions", href: `${base}/roles-permissions` },
                { label: detail.nom },
            ]}
        >
            <Head title="Détail rôle — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageTitle
                        title={detail.nom}
                        description={detail.description}
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <a href={`${base}/roles-permissions`}>
                                <ArrowLeft className="size-4" />
                                Retour à la liste
                            </a>
                        </Button>
                        <Button disabled>
                            <Pencil className="size-4" />
                            Modifier
                        </Button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Users, label: "Utilisateurs", value: detail.nombreUtilisateurs, color: "bg-purple-50 text-purple-600" },
                        { icon: Lock, label: "Permissions", value: detail.nombrePermissions, color: "bg-blue-50 text-blue-600" },
                        { icon: Building2, label: "Agences", value: detail.nombreAgences, color: "bg-amber-50 text-amber-600" },
                        { icon: Calendar, label: "Créé le", value: detail.createdAt, color: "bg-emerald-50 text-emerald-600", isText: true },
                    ].map((c, i) => (
                        <motion.div
                            key={c.label}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.06 }}
                            whileHover={{ y: -2, transition: { duration: 0.15 } }}
                        >
                            <Card className="transition-shadow hover:shadow-md">
                                <CardContent className="p-5">
                                    <div className={`flex size-11 items-center justify-center rounded-xl ${c.color}`}>
                                        <c.icon className="size-5" />
                                    </div>
                                    <div className="mt-4">
                                        <p className={`font-bold tracking-tight text-slate-900 ${c.isText ? "text-sm" : "text-2xl"}`}>{c.value}</p>
                                        <p className="mt-0.5 text-sm text-slate-500">{c.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Informations du rôle</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {[
                                    { label: "Nom", value: detail.nom },
                                    { label: "Statut", value: <UserStatusBadge status={detail.status} /> },
                                    { label: "Date de création", value: detail.createdAt },
                                    { label: "Dernière modification", value: detail.lastModified },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                                        <span className="text-sm text-slate-500">{item.label}</span>
                                        <span className="text-sm font-medium text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 rounded-xl bg-slate-50 p-3">
                                <span className="text-sm text-slate-500">Description</span>
                                <p className="mt-1 text-sm font-medium text-slate-800">{detail.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                    <RolePermissionsCard rolePermissions={roleMock?.permissions || []} />
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                    <RoleUsersTable users={users} />
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-slate-900">Agences concernées</h3>
                        <RoleAgenciesCard agencies={detail.agencies} />
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>
                    <RoleHistoryTimeline history={detail.history} />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
