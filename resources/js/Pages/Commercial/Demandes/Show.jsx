import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Printer,
    FileText,
    User,
    Calendar,
    Building2,
    AlertTriangle,
    Clock,
    MessageSquare,
} from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

const statusLabels = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Rejetée",
    in_progress: "En cours",
    completed: "Terminée",
};

const statusVariants = {
    pending: "warning",
    approved: "success",
    rejected: "destructive",
    in_progress: "info",
    completed: "secondary",
};

const priorityLabels = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    urgent: "Urgente",
};

const priorityVariants = {
    low: "secondary",
    medium: "info",
    high: "warning",
    urgent: "destructive",
};

export default function CommercialDemandeShow({ user, demande }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardLayout
            title={`Demande ${demande.title}`}
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-commercial" },
                {
                    label: "Demandes d'achat",
                    href: "/dashboard-commercial/demandes",
                },
                { label: demande.title },
            ]}
            user={user}
        >
            <Head title={`${demande.title} — SUPDATA`} />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title={demande.title}
                        description={`Détail de la demande #${demande.id}`}
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route("rc.demandes")}>
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
                                            <h3 className="text-lg font-bold text-slate-900">
                                                #{demande.id}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {demande.product_name ||
                                                    "Multi-produits"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <User className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Demandeur
                                                </p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {demande.user?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Building2 className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Agence
                                                </p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {demande.agency?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <Calendar className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Date
                                                </p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {demande.created_at}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100">
                                                <AlertTriangle className="size-4 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Priorité
                                                </p>
                                                <Badge
                                                    variant={
                                                        priorityVariants[
                                                            demande.priority
                                                        ] || "secondary"
                                                    }
                                                >
                                                    {priorityLabels[
                                                        demande.priority
                                                    ] || demande.priority}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 lg:w-56">
                                    <div className="rounded-xl border border-slate-100 p-4 text-center">
                                        <p className="text-xs text-slate-500">
                                            Statut
                                        </p>
                                        <Badge
                                            variant={
                                                statusVariants[
                                                    demande.status
                                                ] || "secondary"
                                            }
                                            className="mt-1"
                                        >
                                            {statusLabels[demande.status] ||
                                                demande.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {demande.products && demande.products.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-900">
                                    Produits demandés ({demande.products.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl border border-slate-200/70">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                                <th className="px-4 py-3 text-left font-medium text-slate-600">
                                                    Produit
                                                </th>
                                                <th className="px-4 py-3 text-center font-medium text-slate-600">
                                                    Quantité
                                                </th>
                                                <th className="px-4 py-3 text-left font-medium text-slate-600">
                                                    Observation
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {demande.products.map((item, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b border-slate-50 last:border-0"
                                                >
                                                    <td className="px-4 py-3 font-medium text-slate-900">
                                                        {item.product?.name ||
                                                            item.product}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-slate-700">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500">
                                                        {item.observation ||
                                                            "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {demande.description && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <MessageSquare className="size-4" />
                                    Remarque du commercial
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-slate-600">
                                    {demande.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
