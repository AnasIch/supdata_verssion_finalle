import { motion } from "framer-motion";
import { Pencil, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import UserProfileCard from "@/Components/Users/UserProfileCard";
import UserInformationCard from "@/Components/Users/UserInformationCard";
import UserSystemCard from "@/Components/Users/UserSystemCard";
import UserPermissionsCard from "@/Components/Users/UserPermissionsCard";
import UserActivityTimeline from "@/Components/Users/UserActivityTimeline";
import UserStatsCards from "@/Components/Users/UserStatsCards";

const mockUser = {
    id: 1,
    name: "Youssef Alami",
    email: "youssef.alami@supdata.fr",
    phone: "+212 6 12 34 56 78",
    position: "Directeur des opérations",
    role: "Super Admin",
    agency: "Casablanca",
    status: "active",
    createdAt: "12 jan. 2024",
    lastLogin: "14 juil. 2026 — 09:32",
};

export default function UserShow() {
    return (
        <DashboardLayout
            title="Détail utilisateur"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Utilisateurs", href: "/utilisateurs" },
                { label: "Détail utilisateur" },
            ]}
        >
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
                            <a href="/utilisateurs">
                                <ArrowLeft className="size-4" />
                                Retour à la liste
                            </a>
                        </Button>
                        <Button>
                            <Pencil className="size-4" />
                            Modifier
                        </Button>
                    </div>
                </motion.div>

                <UserProfileCard user={mockUser} />

                <UserStatsCards />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <UserInformationCard user={mockUser} />
                    <UserSystemCard />
                </div>

                <UserPermissionsCard />

                <UserActivityTimeline />
            </div>
        </DashboardLayout>
    );
}
