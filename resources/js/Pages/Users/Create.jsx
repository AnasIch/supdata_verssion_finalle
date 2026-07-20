import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Head, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getDashboardBaseFromUrl } from "@/lib/utils";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import CreateUserForm from "@/Components/Users/CreateUserForm";
import UserSummaryCard from "@/Components/Users/UserSummaryCard";

export default function UserCreate() {
    const { roles, agencies } = usePage().props;
    const { url } = usePage();
    const base = getDashboardBaseFromUrl(url);
    const [summary, setSummary] = useState({
        firstName: "",
        lastName: "",
        email: "",
        agency: "",
        role: "",
        status: "active",
        avatarPreview: null,
    });

    const handleFormChange = (form) => {
        setSummary((prev) => {
            if (
                prev.firstName === form.firstName &&
                prev.lastName === form.lastName &&
                prev.email === form.email &&
                prev.agency === form.agency &&
                prev.role === form.role &&
                prev.status === form.status &&
                prev.avatarPreview === form.avatarPreview
            ) {
                return prev;
            }
            return form;
        });
    };

    return (
        <DashboardLayout
            title="Créer un utilisateur"
            breadcrumbs={[
                { label: "Dashboard", href: base },
                { label: "Utilisateurs", href: `${base}/utilisateurs` },
                { label: "Créer un utilisateur" },
            ]}
        >
            <Head title="Créer un utilisateur — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Créer un utilisateur"
                        description="Ajoutez un nouvel utilisateur à la plateforme SUPDATA ERP."
                    />
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <a href={`${base}/utilisateurs`}>
                            <ArrowLeft className="size-4" />
                            Retour à la liste
                        </a>
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <CreateUserForm
                        onFormChange={handleFormChange}
                        roles={roles}
                        agencies={agencies}
                    />
                    <div className="order-first lg:order-last">
                        <UserSummaryCard form={summary} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}