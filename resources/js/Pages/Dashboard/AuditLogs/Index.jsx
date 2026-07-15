import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Search,
    SlidersHorizontal,
    Download,
    Clock,
    Activity,
    Shield,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    FileText,
} from "lucide-react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Skeleton } from "@/Components/UI/Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { TablePagination } from "@/Components/UI/TablePagination";
import { useToast } from "@/Components/UI/Toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/Components/UI/Dialog";
import KpiCard from "@/Components/Charts/KpiCard";
import { auditLogs, auditModules, auditActions, auditStatuses } from "@/Mocks/auditLogs";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

const PAGE_SIZE = 12;

const periodOptions = [
    { value: "today", label: "Aujourd'hui" },
    { value: "7days", label: "7 derniers jours" },
    { value: "30days", label: "30 derniers jours" },
    { value: "year", label: "Cette année" },
];

function LoadingSkeleton() {
    return (
        <DashboardLayout title="Journaux d'audit" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Journaux d'audit" }]}>
            <div className="flex flex-col gap-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-2xl" />)}
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
                <Card>
                    <CardContent className="p-5">
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-4 border-b border-slate-50 py-3 last:border-0">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="size-8 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
                <FileText className="size-8 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucun journal trouvé</h3>
            <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
                Aucune activité ne correspond à vos critères de recherche. Essayez de modifier les filtres.
            </p>
        </div>
    );
}

function ErrorState({ onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="size-8 text-red-500" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Erreur de chargement</h3>
            <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
                Une erreur est survenue lors du chargement des journaux d'audit. Veuillez réessayer.
            </p>
            {onRetry && (
                <Button variant="outline" className="mt-4" onClick={onRetry}>
                    Réessayer
                </Button>
            )}
        </div>
    );
}

function DetailRow({ label, value }) {
    if (!value && value !== 0) return null;
    return (
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-800">{value}</span>
        </div>
    );
}

function DiffView({ oldVal, newVal }) {
    if (!oldVal && !newVal) return <p className="text-sm text-slate-500">Aucune donnée de modification disponible.</p>;
    if (!oldVal) return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-500 uppercase">Nouvelles valeurs</p>
            {Object.entries(newVal).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                    <span className="text-sm text-slate-600 capitalize">{k}</span>
                    <span className="text-sm font-medium text-emerald-700">{String(v)}</span>
                </div>
            ))}
        </div>
    );
    if (!newVal) return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-500 uppercase">Valeurs supprimées</p>
            {Object.entries(oldVal).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                    <span className="text-sm text-slate-600 capitalize">{k}</span>
                    <span className="text-sm font-medium text-red-600">{String(v)}</span>
                </div>
            ))}
        </div>
    );
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-slate-500 uppercase">Avant</p>
                {Object.entries(oldVal).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                        <span className="text-sm text-slate-600 capitalize">{k}</span>
                        <span className="text-sm font-medium text-red-600">{String(v)}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-slate-500 uppercase">Après</p>
                {Object.entries(newVal).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                        <span className="text-sm text-slate-600 capitalize">{k}</span>
                        <span className="text-sm font-medium text-emerald-700">{String(v)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AuditLogsIndex() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("Tous");
    const [actionFilter, setActionFilter] = useState("Toutes");
    const [period, setPeriod] = useState("30days");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    const kpis = useMemo(() => {
        const total = auditLogs.length;
        const today = auditLogs.filter((l) => l.timestamp.startsWith("14/07/2026")).length;
        const successCount = auditLogs.filter((l) => l.status === "Succès").length;
        const failedCount = auditLogs.filter((l) => l.status === "Échoué").length;
        return [
            { icon: Activity, label: "Total actions", value: String(total), trend: "+18", trendUp: true, description: "toutes périodes", color: "bg-blue-50 text-blue-600" },
            { icon: Clock, label: "Aujourd'hui", value: String(today), trend: "+5", trendUp: true, description: "actions aujourd'hui", color: "bg-emerald-50 text-emerald-600" },
            { icon: Shield, label: "Succès", value: String(successCount), trend: `${Math.round((successCount / total) * 100)}%`, trendUp: true, description: "taux de réussite", color: "bg-violet-50 text-violet-600" },
            { icon: AlertTriangle, label: "Échoués", value: String(failedCount), trend: failedCount > 0 ? `${failedCount}` : "0", trendUp: false, description: "nécessitent attention", color: "bg-amber-50 audit-amber-600" },
        ];
    }, []);

    const filtered = useMemo(() => {
        let result = [...auditLogs];
        if (moduleFilter !== "Tous") {
            result = result.filter((l) => l.module === moduleFilter);
        }
        if (actionFilter !== "Toutes") {
            result = result.filter((l) => l.action === actionFilter);
        }
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (l) =>
                    l.user.toLowerCase().includes(q) ||
                    l.description.toLowerCase().includes(q) ||
                    l.target.toLowerCase().includes(q) ||
                    l.email.toLowerCase().includes(q) ||
                    l.ip.includes(q)
            );
        }
        result.sort((a, b) => {
            const da = a.timestamp.split(" ").reverse().join(" ");
            const db = b.timestamp.split(" ").reverse().join(" ");
            return sortOrder === "desc" ? db.localeCompare(da) : da.localeCompare(db);
        });
        return result;
    }, [moduleFilter, actionFilter, search, sortOrder]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSearch = useCallback((value) => {
        setSearch(value);
        setCurrentPage(1);
    }, []);

    const handleModuleFilter = useCallback((value) => {
        setModuleFilter(value);
        setCurrentPage(1);
    }, []);

    const handleActionFilter = useCallback((value) => {
        setActionFilter(value);
        setCurrentPage(1);
    }, []);

    const handleRetry = () => {
        setLoading(true);
        setError(false);
        setTimeout(() => {
            setLoading(false);
            toast("Journaux rechargés avec succès.", "success");
        }, 700);
    };

    const handleExport = () => {
        toast("Export des journaux en cours de préparation...", "info");
    };

    if (loading) return <LoadingSkeleton />;

    if (error) {
        return (
            <DashboardLayout title="Journaux d'audit" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Journaux d'audit" }]}>
                <ErrorState onRetry={handleRetry} />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title="Journaux d'audit"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Journaux d'audit" }]}
        >
            <Head title="Journaux d'audit — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageTitle
                        title="Journaux d'audit"
                        description="Consultez toutes les actions effectuées sur la plateforme."
                    />
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="size-4" />
                        Exporter
                    </Button>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {kpis.map((kpi, i) => (
                            <KpiCard key={kpi.label} {...kpi} delay={0.1 + i * 0.05} />
                        ))}
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur, une action..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
                                aria-label="Rechercher dans les journaux"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <SlidersHorizontal className="size-4" />
                                <span>Filtres</span>
                            </div>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="w-[150px]" aria-label="Période">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {periodOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={moduleFilter} onValueChange={handleModuleFilter}>
                                <SelectTrigger className="w-[150px]" aria-label="Module">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {auditModules.map((m) => (
                                        <SelectItem key={m} value={m}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={actionFilter} onValueChange={handleActionFilter}>
                                <SelectTrigger className="w-[150px]" aria-label="Action">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {auditActions.map((a) => (
                                        <SelectItem key={a} value={a}>{a}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                    {paged.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-4 py-3 font-medium text-slate-500">Date / Heure</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Utilisateur</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Action</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Module</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Description</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">Statut</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">IP</th>
                                            <th className="px-4 py-3 font-medium text-slate-500">
                                                <button
                                                    onClick={() => setSortOrder((o) => o === "desc" ? "asc" : "desc")}
                                                    className="flex items-center gap-1 text-slate-500 hover:text-slate-700"
                                                    aria-label="Trier par date"
                                                >
                                                    Tri
                                                    {sortOrder === "desc" ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paged.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50 cursor-pointer"
                                                onClick={() => setSelectedLog(log)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedLog(log); } }}
                                                aria-label={`Détail de l'action: ${log.description}`}
                                            >
                                                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{log.timestamp}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{log.user}</span>
                                                        <span className="text-xs text-slate-400">{log.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                                        log.action === "Création" ? "bg-blue-50 text-blue-600 border-blue-200"
                                                        : log.action === "Modification" ? "bg-amber-50 text-amber-600 border-amber-200"
                                                        : log.action === "Suppression" ? "bg-red-50 text-red-600 border-red-200"
                                                        : log.action === "Connexion" || log.action === "Déconnexion" ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                        : log.action === "Import" || log.action === "Export" ? "bg-violet-50 text-violet-600 border-violet-200"
                                                        : "bg-slate-50 text-slate-600 border-slate-200"
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{log.module}</td>
                                                <td className="max-w-[250px] truncate px-4 py-3 text-slate-500">{log.description}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${auditStatuses[log.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">{log.ip}</td>
                                                <td className="px-4 py-3">
                                                    <Button variant="ghost" size="icon" className="size-7" aria-label="Voir le détail">
                                                        <ChevronDown className="size-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </Card>
                    )}
                </motion.div>
            </div>

            <Dialog open={!!selectedLog} onOpenChange={(open) => { if (!open) setSelectedLog(null); }}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                    {selectedLog && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start gap-3">
                                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                                        selectedLog.action === "Création" ? "bg-blue-50 text-blue-600"
                                        : selectedLog.action === "Modification" ? "bg-amber-50 text-amber-600"
                                        : selectedLog.action === "Suppression" ? "bg-red-50 text-red-600"
                                        : selectedLog.action === "Connexion" || selectedLog.action === "Déconnexion" ? "bg-emerald-50 text-emerald-600"
                                        : "bg-violet-50 text-violet-600"
                                    }`}>
                                        <Shield className="size-5" />
                                    </div>
                                    <div className="flex-1">
                                        <DialogTitle>{selectedLog.description}</DialogTitle>
                                        <DialogDescription>{selectedLog.timestamp} — {selectedLog.user}</DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="flex flex-col gap-4 py-2">
                                <DetailRow label="Utilisateur" value={`${selectedLog.user} (${selectedLog.email})`} />
                                <DetailRow label="Rôle" value={selectedLog.role} />
                                <DetailRow label="Agence" value={selectedLog.agency} />
                                <DetailRow label="Action" value={selectedLog.action} />
                                <DetailRow label="Module" value={selectedLog.module} />
                                <DetailRow label="Cible" value={selectedLog.target} />
                                <DetailRow label="Adresse IP" value={selectedLog.ip} />
                                <DetailRow label="Appareil" value={selectedLog.device} />
                                <DetailRow label="Statut" value={selectedLog.status} />

                                {(selectedLog.details?.ancien || selectedLog.details?.nouveau) && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Modification</p>
                                        <DiffView oldVal={selectedLog.details.ancien} newVal={selectedLog.details.nouveau} />
                                    </div>
                                )}
                            </div>

                            <DialogClose asChild>
                                <Button variant="outline" className="mt-2">
                                    Fermer
                                </Button>
                            </DialogClose>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
