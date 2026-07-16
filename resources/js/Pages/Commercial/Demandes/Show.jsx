import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Printer,
    FileText,
    User,
    Calendar,
    Building2,
    Tag,
    AlertTriangle,
    CheckCircle2,
    Send,
    Clock,
    Download,
    Paperclip,
    MessageSquare,
} from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { commercialDemandes } from "@/Mocks/commercialDemandes";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

const statusLabels = {
    pending: "En attente",
    accepted: "Acceptée",
    refused: "Refusée",
    in_progress: "En cours",
};

const statusVariants = {
    pending: "warning",
    accepted: "success",
    refused: "destructive",
    in_progress: "info",
};

const priorityVariants = {
    Urgente: "destructive",
    Haute: "warning",
    Moyenne: "info",
    Basse: "secondary",
    Faible: "secondary",
};

const historyIcons = {
    "Demande créée": { icon: FileText, color: "bg-blue-50 text-blue-600" },
    "Transmise à la Gestion Administrative": { icon: Send, color: "bg-indigo-50 text-indigo-600" },
    "Validation en attente": { icon: Clock, color: "bg-amber-50 text-amber-600" },
    "Acceptée": { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    "Refusée": { icon: AlertTriangle, color: "bg-red-50 text-red-500" },
    "En cours de traitement": { icon: Clock, color: "bg-cyan-50 text-cyan-600" },
};

export default function CommercialDemandeShow({ demandeId }) {
    const user = useMemo(() => getCurrentUser(), []);
    const demande = useMemo(() => {
        const found = commercialDemandes.find((d) => String(d.id) === String(demandeId));
        return found || commercialDemandes[0];
    }, [demandeId]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardLayout
            title={`Demande ${demande.id}`}
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Demandes d'achat", href: `${getDashboardPath(user.role)}/demandes` },
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
                        title={demande.product}
                        description={`Détail de la demande ${demande.id}`}
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`${getDashboardPath(user.role)}/demandes`}>
                                <ArrowLeft className="size-4" />
                                Retour
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="size-4" />
                            Imprimer
                        </Button>
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
                                            <p className="text-sm text-slate-500">{demande.product}</p>
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
                                                <p className="text-xs text-slate-500">Service</p>
                                                <p className="text-sm font-medium text-slate-900">{demande.service}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Calendar className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Date</p>
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
                            <CardTitle className="text-sm font-semibold text-slate-900">Produits demandés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-xl border border-slate-200/70">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            <th className="px-4 py-3 text-left font-medium text-slate-600">Produit</th>
                                            <th className="px-4 py-3 text-center font-medium text-slate-600">Quantité</th>
                                            <th className="px-4 py-3 text-left font-medium text-slate-600">Observation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demande.products.map((item, i) => (
                                            <tr key={i} className="border-b border-slate-50 last:border-0">
                                                <td className="px-4 py-3 font-medium text-slate-900">{item.product}</td>
                                                <td className="px-4 py-3 text-center text-slate-700">{item.quantity}</td>
                                                <td className="px-4 py-3 text-slate-500">{item.observation || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-900">Historique</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                                    <div className="flex flex-col gap-4">
                                        {demande.history.map((step, i) => {
                                            const style = historyIcons[step.action] || historyIcons["Demande créée"];
                                            const Icon = style.icon;
                                            return (
                                                <div key={i} className="relative flex items-start gap-3">
                                                    <div className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${style.color}`}>
                                                        <Icon className="size-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1 pt-0.5">
                                                        <p className="text-sm font-medium text-slate-900">{step.action}</p>
                                                        <p className="text-xs text-slate-500">{step.person}</p>
                                                    </div>
                                                    <span className="shrink-0 text-xs text-slate-400">{step.date}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.25 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <MessageSquare className="size-4" />
                                    Remarque du commercial
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-slate-600">{demande.comment}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {demande.rejectReason && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.3 }}
                    >
                        <Card className="border-red-100 bg-red-50/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-red-700">
                                    <AlertTriangle className="size-4" />
                                    Motif du refus
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-red-600">{demande.rejectReason}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {demande.attachments.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.35 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <Paperclip className="size-4" />
                                    Pièces jointes ({demande.attachments.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    {demande.attachments.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50">
                                                    <FileText className="size-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => window.alert(`Téléchargement de « ${file.name} » simulé.`)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                                            >
                                                <Download className="size-3.5" />
                                                Télécharger
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
