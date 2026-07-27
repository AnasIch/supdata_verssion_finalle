import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, FileText, User, Calendar, Building2, Tag, AlertTriangle } from "lucide-react";
import { Head, Link, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { useToast } from "@/Components/UI/Toast";
import ValidateDemandeDialog from "@/Components/Demandes/ValidateDemandeDialog";
import RefuseDemandeDialog from "@/Components/Demandes/RefuseDemandeDialog";
import { getDashboardPath } from "@/lib/mockAuth";

const statusLabels = {
    pending_local_admin: "En attente de décision",
    confirmed_local_admin: "Confirmée",
    rejected_local_admin: "Rejetée",
};

const statusVariants = {
    pending_local_admin: "warning",
    confirmed_local_admin: "success",
    rejected_local_admin: "destructive",
};

const priorityLabels = {
    urgent: "Urgente",
    high: "Haute",
    medium: "Moyenne",
    low: "Basse",
};

const priorityVariants = {
    urgent: "destructive",
    high: "destructive",
    medium: "warning",
    low: "secondary",
};

export default function DemandeShow({ user, demande, auditLogs }) {
    const toast = useToast();
    const basePath = getDashboardPath(user?.role || "admin_local");
    const ref = `DEM-${new Date(demande.created_at).getFullYear()}-${String(demande.id).padStart(4, "0")}`;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);

    const handleConfirm = () => {
        router.post(`${basePath}/demandes/${demande.id}/confirmer`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast("Demande confirmée avec succès.", "success");
                setConfirmOpen(false);
            },
            onError: () => toast("Erreur lors de la confirmation.", "error"),
        });
    };

    const handleReject = () => {
        setRejectOpen(true);
    };

    const handleConfirmReject = (id, reason) => {
        router.post(`${basePath}/demandes/${demande.id}/rejeter`, { reason }, {
            preserveScroll: true,
            onSuccess: () => {
                toast("Demande rejetée.", "info");
                setRejectOpen(false);
            },
            onError: () => toast("Erreur lors du rejet.", "error"),
        });
    };

    return (
        <DashboardLayout
            title={`Demande ${ref}`}
            breadcrumbs={[
                { label: "Dashboard", href: basePath },
                { label: "Demandes", href: `${basePath}/demandes` },
                { label: ref },
            ]}
            user={user}
        >
            <Head title={`Demande ${ref} — SUPDATA`} />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title={demande.product_name || demande.title}
                        description={`Détail de la demande ${ref}`}
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`${basePath}/demandes`}>
                                <ArrowLeft className="size-4" />
                                Retour à la liste
                            </Link>
                        </Button>
                        {demande.status === "pending_local_admin" && (
                            <>
                                <Button
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                    onClick={() => setConfirmOpen(true)}
                                >
                                    <CheckCircle2 className="size-4" />
                                    Confirmer
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleReject}
                                >
                                    <XCircle className="size-4" />
                                    Rejeter
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50">
                                            <FileText className="size-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{ref}</h3>
                                            <p className="text-sm text-slate-500">{demande.product_name || demande.title}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <User className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Demandeur</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.requester}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Building2 className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Agence</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.agency_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Tag className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Produit</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.product_name || "—"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <AlertTriangle className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Quantité</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Calendar className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Créée le</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.created_at}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <AlertTriangle className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Priorité</p>
                                                <Badge variant={priorityVariants[demande.priority] || "secondary"}>
                                                    {priorityLabels[demande.priority] || demande.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 lg:w-56">
                                    <div className="rounded-xl border border-slate-100 p-4 text-center">
                                        <p className="text-xs text-slate-500">Statut</p>
                                        <Badge variant={statusVariants[demande.status] || "secondary"} className="mt-1">
                                            {statusLabels[demande.status] || demande.status}
                                        </Badge>
                                    </div>
                                    {demande.confirmedBy && (
                                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                                            <p className="text-xs text-slate-500">Confirmé par</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{demande.confirmedBy}</p>
                                        </div>
                                    )}
                                    {demande.confirmed_at && (
                                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                                            <p className="text-xs text-slate-500">Confirmé le</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{demande.confirmed_at}</p>
                                        </div>
                                    )}
                                    {demande.refuser && (
                                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                                            <p className="text-xs text-slate-500">Rejeté par</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{demande.refuser}</p>
                                        </div>
                                    )}
                                    {demande.refused_at && (
                                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                                            <p className="text-xs text-slate-500">Rejeté le</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{demande.refused_at}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                >
                    {demande.status === "pending_local_admin" ? (
                        <Card className="border-amber-200 bg-amber-50/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <AlertTriangle className="size-4 text-amber-500" />
                                    Décision finale
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-slate-600">
                                    Cette demande attend votre décision. Veuillez confirmer ou rejeter cette demande.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                                        onClick={() => setConfirmOpen(true)}
                                    >
                                        <CheckCircle2 className="size-4" />
                                        Confirmer
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={handleReject}
                                    >
                                        <XCircle className="size-4" />
                                        Rejeter
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : demande.status === "confirmed_local_admin" ? (
                        <Card className="border-emerald-200 bg-emerald-50/30">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100">
                                        <CheckCircle2 className="size-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-emerald-700">Demande approuvée</p>
                                        <p className="text-sm text-slate-600">
                                            Confirmée le {demande.confirmed_at || "—"}
                                            {demande.confirmedBy && ` par ${demande.confirmedBy}`}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : demande.status === "rejected_local_admin" ? (
                        <Card className="border-red-200 bg-red-50/30">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                                        <XCircle className="size-6 text-red-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-base font-semibold text-red-700">Demande refusée</p>
                                        <p className="text-sm text-slate-600">
                                            Rejetée le {demande.refused_at || "—"}
                                            {demande.refuser && ` par ${demande.refuser}`}
                                        </p>
                                        {demande.rejection_reason && (
                                            <div className="mt-2 rounded-lg border border-red-200 bg-white p-3">
                                                <p className="text-xs font-medium text-slate-500">Motif du refus</p>
                                                <p className="mt-0.5 text-sm text-red-600">{demande.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : null}
                </motion.div>

                {demande.description && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-900">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-slate-600">{demande.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {auditLogs && auditLogs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.25 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-900">Historique</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                                    <div className="flex flex-col gap-4">
                                        {auditLogs.map((log) => (
                                            <div key={log.id} className="relative flex items-start gap-3">
                                                <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                    <span className="text-xs font-bold">
                                                        {log.action.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-0.5">
                                                    <p className="text-sm font-medium text-slate-900">{log.description}</p>
                                                    <p className="text-xs text-slate-500">Par {log.user}</p>
                                                </div>
                                                <span className="shrink-0 text-xs text-slate-400">{log.created_at}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            <ValidateDemandeDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                demande={demande}
                onConfirm={handleConfirm}
            />
            <RefuseDemandeDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                demande={demande}
                onConfirm={handleConfirmReject}
            />
        </DashboardLayout>
    );
}
