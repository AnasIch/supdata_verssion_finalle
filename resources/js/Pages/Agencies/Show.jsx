import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Pencil,
    Building2,
    Users,
    Package,
    FolderOpen,
    Activity,
    MapPin,
    Phone,
    Mail,
    Clock,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { Head, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getDashboardBaseFromUrl } from "@/lib/utils";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Skeleton } from "@/Components/UI/Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { TablePagination } from "@/Components/UI/TablePagination";
import UserStatusBadge from "@/Components/Users/UserStatusBadge";
import RoleBadge from "@/Components/Users/RoleBadge";
import { agencies } from "@/Mocks/agencies";
import { agencyUsers } from "@/Mocks/agencyUsers";
import { agencyProducts } from "@/Mocks/agencyProducts";
import { agencyActivity } from "@/Mocks/agencyActivity";

const PAGE_SIZE = 5;

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

function getInitials(name) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function SectionSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
            <CardContent className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-40" /></div>
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
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function ProductsTableSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-slate-50 py-3 last:border-0">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
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
                        <div className="flex flex-1 flex-col gap-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function StockStatusBadge({ status }) {
    const config = {
        "En stock": "bg-emerald-50 text-emerald-700 border-emerald-200",
        "Stock bas": "bg-amber-50 text-amber-700 border-amber-200",
        "Rupture": "bg-red-50 text-red-700 border-red-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
            {status}
        </span>
    );
}

export default function AgencyShow({ agencyId }) {
    const { url } = usePage();
    const base = getDashboardBaseFromUrl(url);
    const [loading, setLoading] = useState(true);
    const [userSearch, setUserSearch] = useState("");
    const [userSort, setUserSort] = useState("name");
    const [userPage, setUserPage] = useState(1);
    const [productSearch, setProductSearch] = useState("");
    const [productSort, setProductSort] = useState("name");
    const [productPage, setProductPage] = useState(1);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    const agence = agencies.find((a) => a.id === agencyId);
    const users = agencyUsers[agencyId] || [];
    const products = agencyProducts[agencyId] || [];
    const activity = agencyActivity[agencyId] || [];

    const filteredUsers = useMemo(() => {
        let result = [...users];
        if (userSearch) {
            const q = userSearch.toLowerCase();
            result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
        }
        result.sort((a, b) => {
            if (userSort === "name") return a.name.localeCompare(b.name);
            if (userSort === "role") return a.role.localeCompare(b.role);
            if (userSort === "status") return a.status.localeCompare(b.status);
            return 0;
        });
        return result;
    }, [users, userSearch, userSort]);

    const userTotalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const pagedUsers = filteredUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE);

    const filteredProducts = useMemo(() => {
        let result = [...products];
        if (productSearch) {
            const q = productSearch.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        }
        result.sort((a, b) => {
            if (productSort === "name") return a.name.localeCompare(b.name);
            if (productSort === "category") return a.category.localeCompare(b.category);
            if (productSort === "quantity") return b.quantity - a.quantity;
            if (productSort === "status") return a.status.localeCompare(b.status);
            return 0;
        });
        return result;
    }, [products, productSearch, productSort]);

    const productTotalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const pagedProducts = filteredProducts.slice((productPage - 1) * PAGE_SIZE, productPage * PAGE_SIZE);

    const handleUserSearch = useCallback((value) => {
        setUserSearch(value);
        setUserPage(1);
    }, []);

    const handleUserSort = useCallback((value) => {
        setUserSort(value);
        setUserPage(1);
    }, []);

    const handleProductSearch = useCallback((value) => {
        setProductSearch(value);
        setProductPage(1);
    }, []);

    const handleProductSort = useCallback((value) => {
        setProductSort(value);
        setProductPage(1);
    }, []);

    if (!agence) {
        return (
            <DashboardLayout title="Agence" breadcrumbs={[{ label: "Dashboard", href: base }, { label: "Agences", href: `${base}/agences` }, { label: "Introuvable" }]}>
                <div className="py-12 text-center text-sm text-slate-500">Agence introuvable.</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Détail agence"
            breadcrumbs={[
                { label: "Dashboard", href: base },
                { label: "Agences", href: `${base}/agences` },
                { label: agence.name },
            ]}
        >
            <Head title="Détail agence — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageTitle title={agence.name} description={agence.city} />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <a href={`${base}/agences`}>
                                <ArrowLeft className="size-4" />
                                Retour
                            </a>
                        </Button>
                        <Button asChild>
                            <a href={`${base}/agences/${agence.id}/modifier`}>
                                <Pencil className="size-4" />
                                Modifier
                            </a>
                        </Button>
                    </div>
                </motion.div>

                {loading ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-2xl" />)}
                        </div>
                        <SectionSkeleton />
                        <UsersTableSkeleton />
                        <ProductsTableSkeleton />
                        <TimelineSkeleton />
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: Users, label: "Utilisateurs", value: agence.userCount, color: "bg-purple-50 text-purple-600" },
                                { icon: Package, label: "Produits", value: agence.productCount, color: "bg-amber-50 text-amber-600" },
                                { icon: FolderOpen, label: "Catégories", value: agence.categoryCount, color: "bg-blue-50 text-blue-600" },
                                { icon: Activity, label: "Mouvements stock", value: agence.stockMovements.toLocaleString(), color: "bg-emerald-50 text-emerald-600" },
                            ].map((c, i) => (
                                <motion.div key={c.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }} whileHover={{ y: -2, transition: { duration: 0.15 } }}>
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

                        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Informations générales</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {[
                                            { icon: Building2, label: "Nom", value: agence.name },
                                            { icon: MapPin, label: "Ville", value: agence.city },
                                            { icon: MapPin, label: "Adresse", value: agence.address },
                                            { icon: Phone, label: "Téléphone", value: agence.phone },
                                            { icon: Mail, label: "Email", value: agence.email },
                                            { icon: Users, label: "Responsable", value: agence.director },
                                            { icon: Clock, label: "Créé le", value: agence.createdAt },
                                            { icon: Clock, label: "Dernière modification", value: agence.lastModified },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <item.icon className="size-4 text-slate-400" />
                                                    {item.label}
                                                </div>
                                                <span className="text-sm font-medium text-slate-800">{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 sm:col-span-2">
                                            <span className="text-sm text-slate-500">Statut</span>
                                            <UserStatusBadge status={agence.status} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <CardTitle className="text-base">Utilisateurs affectés</CardTitle>
                                            <CardDescription>{users.length} utilisateur{users.length !== 1 ? "s" : ""}.</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative sm:max-w-xs">
                                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher..."
                                                    value={userSearch}
                                                    onChange={(e) => handleUserSearch(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                                                    aria-label="Rechercher un utilisateur"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <SlidersHorizontal className="size-4" />
                                                <span>Trier par</span>
                                            </div>
                                            <Select value={userSort} onValueChange={handleUserSort}>
                                                <SelectTrigger className="w-[140px]" aria-label="Trier les utilisateurs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="name">Nom</SelectItem>
                                                    <SelectItem value="role">Rôle</SelectItem>
                                                    <SelectItem value="status">Statut</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {pagedUsers.length === 0 ? (
                                        <div className="py-8 text-center text-sm text-slate-500">Aucun utilisateur trouvé.</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Utilisateur</th>
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Email</th>
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Rôle</th>
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Statut</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pagedUsers.map((user) => (
                                                        <tr key={user.id} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50">
                                                            <td className="px-3 py-2.5">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{getInitials(user.name)}</div>
                                                                    <span className="font-medium text-slate-900">{user.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2.5 text-slate-500">{user.email}</td>
                                                            <td className="px-3 py-2.5"><RoleBadge role={user.role} /></td>
                                                            <td className="px-3 py-2.5"><UserStatusBadge status={user.status} /></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                                <TablePagination
                                    currentPage={userPage}
                                    totalPages={userTotalPages}
                                    onPageChange={setUserPage}
                                />
                            </Card>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <CardTitle className="text-base">Produits en stock</CardTitle>
                                            <CardDescription>{products.length} produit{products.length !== 1 ? "s" : ""}.</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative sm:max-w-xs">
                                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Rechercher..."
                                                    value={productSearch}
                                                    onChange={(e) => handleProductSearch(e.target.value)}
                                                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                                                    aria-label="Rechercher un produit"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <SlidersHorizontal className="size-4" />
                                                <span>Trier par</span>
                                            </div>
                                            <Select value={productSort} onValueChange={handleProductSort}>
                                                <SelectTrigger className="w-[140px]" aria-label="Trier les produits">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="name">Nom</SelectItem>
                                                    <SelectItem value="category">Catégorie</SelectItem>
                                                    <SelectItem value="quantity">Quantité</SelectItem>
                                                    <SelectItem value="status">Statut</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {pagedProducts.length === 0 ? (
                                        <div className="py-8 text-center text-sm text-slate-500">Aucun produit trouvé.</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Produit</th>
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Catégorie</th>
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Quantité</th>
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Statut</th>
                                                        <th className="px-3 py-2.5 font-medium text-slate-500">Dernière MAJ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pagedProducts.map((product) => (
                                                        <tr key={product.id} className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50">
                                                            <td className="px-3 py-2.5 font-medium text-slate-900">{product.name}</td>
                                                            <td className="px-3 py-2.5 text-slate-500">{product.category}</td>
                                                            <td className="px-3 py-2.5 text-slate-600">{product.quantity}</td>
                                                            <td className="px-3 py-2.5"><StockStatusBadge status={product.status} /></td>
                                                            <td className="px-3 py-2.5 text-slate-400">{product.lastUpdate}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                                <TablePagination
                                    currentPage={productPage}
                                    totalPages={productTotalPages}
                                    onPageChange={setProductPage}
                                />
                            </Card>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Activité récente</CardTitle>
                                    <CardDescription>Dernières actions effectuées dans cette agence.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative ml-1">
                                        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />
                                        <div className="flex flex-col gap-6">
                                            {activity.map((event, i) => (
                                                <motion.div
                                                    key={event.id}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: i * 0.08 }}
                                                    className="relative flex gap-4 pl-5"
                                                >
                                                    <div className={`absolute left-0 top-1.5 size-[11px] rounded-full border-2 ${
                                                        i === activity.length - 1 ? "border-blue-500 bg-blue-100" : "border-slate-300 bg-white"
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
                        </motion.div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
