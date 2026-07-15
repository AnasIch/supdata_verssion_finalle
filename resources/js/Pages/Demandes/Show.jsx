import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, FileText, User, Calendar, Building2, Tag, DollarSign, AlertTriangle } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { useToast } from "@/Components/UI/Toast";
import ValidateDemandeDialog from "@/Components/Demandes/ValidateDemandeDialog";
import RefuseDemandeDialog from "@/Components/Demandes/RefuseDemandeDialog";
import { demandes as allDemandes } from "@/Mocks/demandes";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

const statusLabels = {
    pending: "En attente",
    validated: "Validée",
    rejected: "Refusée",
    cancelled: "Annulée",
};

const statusVariants = {
    pending: "warning",
    validated: "success",
    rejected: "destructive",
    cancelled: "secondary",
};

const priorityVariants = {
    Haute: "destructive",
    Moyenne: "warning",
    Basse: "secondary",
};

const typeIcons = {
    Achat: "bg-blue-50 text-blue-600",
    Licence: "bg-violet-50 text-violet-600",
    Maintenance: "bg-amber-50 text-amber-600",
    Formation: "bg-emerald-50 text-emerald-600",
    Infrastructure: "bg-cyan-50 text-cyan-600",
    Développement: "bg-indigo-50 text-indigo-600",
    Service: "bg-slate-100 text-slate-600",
};

export default function DemandeShow({ demandeId }) {
    const user = useMemo(() => getCurrentUser(), []);
    const toast = useToast();
    const [demande, setDemande] = useState(() => {
        const found = allDemandes.find((d) => String(d.id) === String(demandeId));
        return found || allDemandes[0];
    });

    const [validateOpen, setValidateOpen] = useState(false);
    const [refuseOpen, setRefuseOpen] = useState(false);

    const handleValidate = () => {
        setDemande((prev) => ({
            ...prev,
            status: "validated",
            validator: "Youssef Benali",
            validatedAt: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) + " — " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        }));
        toast(`Demande « ${demande.id} » validée avec succès.`, "success");
    };

    const handleRefuse = () => {
        setDemande((prev) => ({
            ...prev,
            status: "rejected",
            validator: "Youssef Benali",
        }));
        toast(`Demande « ${demande.id} » refusée.`, "info");
    };

    return (
        <DashboardLayout
            title={`Demande ${demande.id}`}
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Demandes", href: `${getDashboardPath(user.role)}/demandes` },
                { label: demande.id },
            ]}
            user={user}
        >
            <Head title={`Demande ${demande.id} — SUPDATA`} />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title={demande.title}
                        description={`Détail de la demande ${demande.id}`}
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`${getDashboardPath(user.role)}/demandes`}>
                                <ArrowLeft className="size-4" />
                                Retour à la liste
                            </Link>
                        </Button>
                        {demande.status === "pending" && (
                            <>
                                <Button
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                    onClick={() => setValidateOpen(true)}
                                >
                                    <CheckCircle2 className="size-4" />
                                    Valider
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setRefuseOpen(true)}
                                >
                                    <XCircle className="size-4" />
                                    Refuser
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
                                            <h3 className="text-lg font-bold text-slate-900">{demande.id}</h3>
                                            <p className="text-sm text-slate-500">{demande.title}</p>
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
                                                <p className="text-sm font-medium text-slate-900">{demande.agency}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Tag className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Type</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <DollarSign className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Budget</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.budget} MAD</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Calendar className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Créée le</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.createdAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <AlertTriangle className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Priorité</p>
                                                <Badge variant={priorityVariants[demande.priority] || "secondary"}>
                                                    {demande.priority}
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
                                    {demande.validator && (
                                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                                            <p className="text-xs text-slate-500">Traité par</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{demande.validator}</p>
                                        </div>
                                    )}
                                    {demande.validatedAt && (
                                        <div className="rounded-xl border border-slate-100 p-4 text-center">
                                            <p className="text-xs text-slate-500">Traité le</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{demande.validatedAt}</p>
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-900">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-slate-600">{demande.description}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {demande.rejectReason && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                    >
                        <Card className="border-red-100 bg-red-50/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-red-700">
                                    <XCircle className="size-4" />
                                    Motif du refus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-red-600">{demande.rejectReason}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

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
                                    <div className="relative flex items-start gap-3">
                                        <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                            <span className="text-xs font-bold">D</span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <p className="text-sm font-medium text-slate-900">Demande créée</p>
                                            <p className="text-xs text-slate-500">Par {demande.requester}</p>
                                        </div>
                                        <span className="shrink-0 text-xs text-slate-400">{demande.createdAt}</span>
                                    </div>
                                    {demande.status === "validated" && (
                                        <div className="relative flex items-start gap-3">
                                            <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                <CheckCircle2 className="size-4" />
                                            </div>
                                            <div className="min-w-0 flex-1 pt-0.5">
                                                <p className="text-sm font-medium text-slate-900">Demande validée</p>
                                                <p className="text-xs text-slate-500">Par {demande.validator}</p>
                                            </div>
                                            <span className="shrink-0 text-xs text-slate-400">{demande.validatedAt}</span>
                                        </div>
                                    )}
                                    {demande.status === "rejected" && (
                                        <div className="relative flex items-start gap-3">
                                            <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                                                <XCircle className="size-4" />
                                            </div>
                                            <div className="min-w-0 flex-1 pt-0.5">
                                                <p className="text-sm font-medium text-slate-900">Demande refusée</p>
                                                <p className="text-xs text-slate-500">Par {demande.validator}</p>
                                            </div>
                                            <span className="shrink-0 text-xs text-slate-400">{demande.updatedAt}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <ValidateDemandeDialog
                open={validateOpen}
                onOpenChange={setValidateOpen}
                demande={demande}
                onConfirm={handleValidate}
            />
            <RefuseDemandeDialog
                open={refuseOpen}
                onOpenChange={setRefuseOpen}
                demande={demande}
                onConfirm={handleRefuse}
            />
        </DashboardLayout>
    );
}
