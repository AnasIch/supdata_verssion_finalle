import { useMemo } from "react";
import { motion } from "framer-motion";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { useToast } from "@/Components/UI/Toast";
import CreatePurchaseRequestForm from "@/Components/Commercial/CreatePurchaseRequestForm";
import RequestSummaryCard from "@/Components/Commercial/RequestSummaryCard";
import { useCreatePurchaseRequest } from "@/Hooks/useCreatePurchaseRequest";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

export default function CommercialDemandeCreate() {
    const user = useMemo(() => getCurrentUser(), []);
    const toast = useToast();
    const {
        form,
        errors,
        reference,
        today,
        summary,
        handleChange,
        updateProduct,
        validate,
        reset,
    } = useCreatePurchaseRequest();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        toast("Votre demande d'achat a été envoyée avec succès.", "success");
        setTimeout(() => {
            window.location.href = `${getDashboardPath(user.role)}/demandes`;
        }, 1500);
    };

    return (
        <DashboardLayout
            title="Nouvelle demande"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Demandes d'achat", href: `${getDashboardPath(user.role)}/demandes` },
                { label: "Nouvelle demande" },
            ]}
            user={user}
        >
            <Head title="Nouvelle demande — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PageTitle
                        title="Nouvelle demande d'achat"
                        description={`Référence : ${reference}`}
                        actions={
                            <Button variant="outline" asChild>
                                <Link href={`${getDashboardPath(user.role)}/demandes`}>
                                    <ArrowLeft className="size-4" />
                                    Retour
                                </Link>
                            </Button>
                        }
                    />
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
                    <CreatePurchaseRequestForm
                        form={form}
                        errors={errors}
                        reference={reference}
                        today={today}
                        user={user}
                        onUpdateProduct={updateProduct}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onReset={reset}
                    />
                    <div className="order-first lg:order-last">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.15 }}
                        >
                            <RequestSummaryCard summary={summary} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
