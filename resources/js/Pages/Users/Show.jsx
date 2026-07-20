import { motion } from "framer-motion";
import { Pencil, ArrowLeft } from "lucide-react";
import { Head, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getDashboardBaseFromUrl } from "@/lib/utils";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import UserProfileCard from "@/Components/Users/UserProfileCard";
import UserInformationCard from "@/Components/Users/UserInformationCard";
import UserSystemCard from "@/Components/Users/UserSystemCard";
import UserStatsCards from "@/Components/Users/UserStatsCards";

export default function UserShow() {
    const { user } = usePage().props;
    const { url } = usePage();
    const base = getDashboardBaseFromUrl(url);

    return (
        <DashboardLayout
            title="Détail utilisateur"
            breadcrumbs={[
                { label: "Dashboard", href: base },
                { label: "Utilisateurs", href: `${base}/utilisateurs` },
                { label: "Détail utilisateur" },
            ]}
        >
            <Head title="Détail utilisateur — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Détail de l'utilisateur"
                        description="Consultez les informations complètes de cet utilisateur."
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <a href={`${base}/utilisateurs`}>
                                <ArrowLeft className="size-4" />
                                Retour à la liste
                            </a>
                        </Button>
                        <Button asChild>
                            <a href={`${base}/utilisateurs/${user.id}/modifier`}>
                                <Pencil className="size-4" />
                                Modifier
                            </a>
                        </Button>
                    </div>
                </motion.div>

                <UserProfileCard user={user} />

                <UserStatsCards user={user} />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <UserInformationCard user={user} />
                    <UserSystemCard user={user} />
                </div>
            </div>
        </DashboardLayout>
    );
}