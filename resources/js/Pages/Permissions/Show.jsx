import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    RotateCcw,
    Search,
    SlidersHorizontal,
    CheckSquare,
    Square,
    RefreshCw,
    Shield,
    KeyRound,
    Lock,
    Unlock,
    LayoutGrid,
} from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { Checkbox } from "@/Components/UI/Checkbox";
import { Skeleton } from "@/Components/UI/Skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/Components/UI/Dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { useToast } from "@/Components/UI/Toast";
import { usePermissions } from "@/Hooks/usePermissions";
import { permissionGroups } from "@/Mocks/permissionGroups";
import { initialPermissions } from "@/Mocks/permissions";
import { roles } from "@/Mocks/roles";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-5">
                        <Skeleton className="size-11 rounded-xl" />
                        <div className="mt-4 space-y-2">
                            <Skeleton className="h-7 w-12" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function ModuleCardSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 4 }).map((_, j) => (
                        <Skeleton key={j} className="h-9 w-28 rounded-lg" />
                    ))}
                </div>
            </CardContent>
        </Card>
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
                <KeyRound className="size-7 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucun module trouvé</h3>
            <p className="mt-1 text-sm text-slate-500">
                {search
                    ? `Aucun résultat pour « ${search} ». Essayez une autre recherche.`
                    : "Aucun module de permissions disponible."}
            </p>
        </motion.div>
    );
}

function ModulePermCard({ module, permissionsState, onToggle, filter }) {
    const Icon = module.icon;
    const modulePerms = module.permissions;

    const visiblePerms = useMemo(() => {
        if (filter === "all") return modulePerms;
        return modulePerms.filter((p) => {
            const checked = permissionsState?.[p.key] || false;
            return filter === "active" ? checked : !checked;
        });
    }, [modulePerms, permissionsState, filter]);

    if (visiblePerms.length === 0) return null;

    const checkedCount = modulePerms.filter((p) => permissionsState?.[p.key]).length;
    const allChecked = checkedCount === modulePerms.length;
    const someChecked = checkedCount > 0 && !allChecked;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3 }}
            layout
        >
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-xl ${module.color}`}>
                            <Icon className="size-5" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-sm">{module.module}</CardTitle>
                            <CardDescription className="text-xs">{module.description}</CardDescription>
                        </div>
                        <Badge
                            variant={allChecked ? "success" : someChecked ? "warning" : "secondary"}
                            className="text-xs"
                        >
                            {checkedCount}/{modulePerms.length}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {visiblePerms.map((perm) => {
                            const checked = permissionsState?.[perm.key] || false;
                            return (
                                <label
                                    key={perm.key}
                                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all cursor-pointer select-none ${
                                        checked
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                    } focus-within:ring-2 focus-within:ring-slate-200`}
                                >
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={() => onToggle(module.key, perm.key)}
                                        aria-label={`${perm.label} — ${module.module}`}
                                    />
                                    {perm.label}
                                </label>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export default function PermissionShow({ roleId }) {
    const toast = useToast();
    const roleMock = roles.find((r) => r.id === roleId);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    const {
        permissions,
        isDirty,
        toggle,
        toggleModule,
        selectAll,
        deselectAll,
        reset,
        save,
        stats,
    } = usePermissions(initialPermissions[roleId] || initialPermissions[1]);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const handleSave = useCallback(() => {
        save();
        toast("Permissions enregistrées avec succès.", "success");
    }, [save, toast]);

    const handleReset = useCallback(() => {
        reset();
        toast("Réinitialisation effectuée.", "info");
    }, [reset, toast]);

    const handleCancel = useCallback(() => {
        reset();
        toast("Modifications annulées.", "warning");
    }, [reset, toast]);

    const filteredGroups = useMemo(() => {
        let result = permissionGroups;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter((g) => {
                if (g.module.toLowerCase().includes(q)) return true;
                if (g.permissions.some((p) => p.label.toLowerCase().includes(q))) return true;
                return false;
            });
        }

        if (filter !== "all") {
            result = result.filter((g) => {
                const groupState = permissions[g.key] || {};
                return g.permissions.some((p) => {
                    const checked = groupState[p.key] || false;
                    return filter === "active" ? checked : !checked;
                });
            });
        }

        return result;
    }, [search, filter, permissions]);

    const navigateAway = useCallback((href) => {
        window.location.href = href;
    }, []);

    const handleBackClick = useCallback(() => {
        if (isDirty) {
            setPendingNavigation("/permissions");
            setLeaveDialogOpen(true);
        } else {
            navigateAway("/permissions");
        }
    }, [isDirty, navigateAway]);

    if (!roleMock) {
        return (
            <DashboardLayout
                title="Permissions"
                breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Permissions", href: "/permissions" }, { label: "Rôle introuvable" }]}
            >
                <div className="py-12 text-center text-sm text-slate-500">Rôle introuvable.</div>
            </DashboardLayout>
        );
    }

    const Icon = roleMock.icon;

    return (
        <DashboardLayout
            title="Permissions"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Permissions", href: "/permissions" },
                { label: roleMock.nom },
            ]}
        >
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`flex size-11 items-center justify-center rounded-xl ${roleMock.color}`}>
                            <Icon className="size-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{roleMock.nom}</h1>
                                <Badge variant="outline" className={roleMock.badgeColor}>
                                    {roleMock.status === "active" ? "Actif" : "Inactif"}
                                </Badge>
                            </div>
                            <p className="mt-0.5 text-sm text-slate-500">{roleMock.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleBackClick}>
                            <ArrowLeft className="size-4" />
                            Retour
                        </Button>
                        <Button variant="outline" onClick={handleCancel} disabled={!isDirty}>
                            <RotateCcw className="size-4" />
                            Annuler
                        </Button>
                        <Button onClick={handleSave} disabled={!isDirty}>
                            <Save className="size-4" />
                            Enregistrer
                        </Button>
                    </div>
                </motion.div>

                {loading ? (
                    <StatsSkeleton />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: LayoutGrid, label: "Modules", value: permissionGroups.length, color: "bg-blue-50 text-blue-600" },
                            { icon: KeyRound, label: "Total permissions", value: stats.total, color: "bg-purple-50 text-purple-600" },
                            { icon: Unlock, label: "Actives", value: stats.active, color: "bg-emerald-50 text-emerald-600" },
                            { icon: Lock, label: "Désactivées", value: stats.inactive, color: "bg-slate-100 text-slate-500" },
                        ].map((c, i) => (
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

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un module ou une permission..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 shadow-[0_1px_2px_rgb(0,0,0,0.04)] placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                                aria-label="Rechercher"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <SlidersHorizontal className="size-4" />
                                <span>Filtrer</span>
                            </div>
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[150px]" aria-label="Filtrer les permissions">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes</SelectItem>
                                    <SelectItem value="active">Actives</SelectItem>
                                    <SelectItem value="inactive">Désactivées</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="h-6 w-px bg-slate-200" />
                            <Button variant="outline" size="sm" onClick={selectAll}>
                                <CheckSquare className="size-3.5" />
                                Tout sélectionner
                            </Button>
                            <Button variant="outline" size="sm" onClick={deselectAll}>
                                <Square className="size-3.5" />
                                Tout désélectionner
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleReset} disabled={!isDirty}>
                                <RefreshCw className="size-3.5" />
                                Réinitialiser
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ModuleCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredGroups.length === 0 ? (
                    <EmptyState search={search} />
                ) : (
                    <div className="flex flex-col gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredGroups.map((group) => (
                                <ModulePermCard
                                    key={group.key}
                                    module={group}
                                    permissionsState={permissions[group.key] || {}}
                                    onToggle={toggle}
                                    filter={filter}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && (
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                        <Card className="border-slate-200/70 bg-slate-50/50">
                            <CardContent className="p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm font-medium text-slate-700">Résumé</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span>
                                            Total : <span className="font-semibold text-slate-700">{stats.total}</span>
                                        </span>
                                        <span className="text-emerald-600">
                                            Actives : <span className="font-semibold">{stats.active}</span>
                                        </span>
                                        <span className="text-slate-400">
                                            Désactivées : <span className="font-semibold">{stats.inactive}</span>
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50">
                            <KeyRound className="size-6 text-amber-500" />
                        </div>
                        <DialogTitle className="mt-2 text-center">Modifications non enregistrées</DialogTitle>
                        <DialogDescription className="text-center">
                            Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline">Rester sur la page</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setLeaveDialogOpen(false);
                                save();
                                navigateAway(pendingNavigation || "/permissions");
                            }}
                        >
                            Quitter sans enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
