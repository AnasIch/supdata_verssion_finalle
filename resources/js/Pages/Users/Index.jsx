import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { useToast } from "@/Components/UI/Toast";
import UsersStats from "@/Components/Users/UsersStats";
import UsersFilters from "@/Components/Users/UsersFilters";
import UsersTable from "@/Components/Users/UsersTable";
import UserCard from "@/Components/Users/UserCard";
import DeleteUserDialog from "@/Components/Users/DeleteUserDialog";
import ToggleStatusDialog from "@/Components/Users/ToggleStatusDialog";

const initialUsers = [
    { id: 1, name: "Youssef Alami", email: "youssef@supdata.fr", role: "Super Admin", agency: "Casablanca", status: "active", createdAt: "12 jan. 2024" },
    { id: 2, name: "Fatima Zahra Benani", email: "fatima@supdata.fr", role: "Admin", agency: "Marrakech", status: "active", createdAt: "3 mar. 2024" },
    { id: 3, name: "Omar Tazi", email: "omar@supdata.fr", role: "Gestionnaire", agency: "Rabat", status: "active", createdAt: "18 avr. 2024" },
    { id: 4, name: "Sara Idrissi", email: "sara@supdata.fr", role: "Technicien", agency: "Tanger", status: "inactive", createdAt: "22 mai 2024" },
    { id: 5, name: "Karim Berrada", email: "karim@supdata.fr", role: "Admin", agency: "Fès", status: "active", createdAt: "1 jul. 2024" },
    { id: 6, name: "Nadia Alaoui", email: "nadia@supdata.fr", role: "Gestionnaire", agency: "Casablanca", status: "active", createdAt: "15 jul. 2024" },
    { id: 7, name: "Rachid Mouline", email: "rachid@supdata.fr", role: "Technicien", agency: "Marrakech", status: "suspended", createdAt: "30 jul. 2024" },
    { id: 8, name: "Amina Filali", email: "amina@supdata.fr", role: "Viewer", agency: "Rabat", status: "active", createdAt: "14 août 2024" },
    { id: 9, name: "Hassan Benjelloun", email: "hassan@supdata.fr", role: "Admin", agency: "Casablanca", status: "active", createdAt: "1 sep. 2024" },
    { id: 10, name: "Leila Chraibi", email: "leila@supdata.fr", role: "Gestionnaire", agency: "Tanger", status: "active", createdAt: "18 sep. 2024" },
    { id: 11, name: "Mehdi Zouhair", email: "mehdi@supdata.fr", role: "Technicien", agency: "Fès", status: "inactive", createdAt: "2 oct. 2024" },
    { id: 12, name: "Samira Bennani", email: "samira@supdata.fr", role: "Viewer", agency: "Marrakech", status: "active", createdAt: "20 oct. 2024" },
    { id: 13, name: "Driss El Fassi", email: "driss@supdata.fr", role: "Admin", agency: "Rabat", status: "active", createdAt: "5 nov. 2024" },
    { id: 14, name: "Khadija Ouazzani", email: "khadija@supdata.fr", role: "Gestionnaire", agency: "Casablanca", status: "active", createdAt: "22 nov. 2024" },
    { id: 15, name: "Aziz Lamrani", email: "aziz@supdata.fr", role: "Technicien", agency: "Tanger", status: "suspended", createdAt: "10 déc. 2024" },
];

const PAGE_SIZE = 8;

export default function UsersIndex() {
    const toast = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [filters, setFilters] = useState({ search: "", role: "all", agency: "all", status: "all" });
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [toggleTarget, setToggleTarget] = useState(null);
    const [toggleOpen, setToggleOpen] = useState(false);

    const filtered = useMemo(() => {
        return users.filter((u) => {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
            }
            if (filters.role !== "all" && u.role !== filters.role) return false;
            if (filters.agency !== "all" && u.agency !== filters.agency) return false;
            if (filters.status !== "all" && u.status !== filters.status) return false;
            return true;
        });
    }, [users, filters]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleReset = () => {
        setFilters({ search: "", role: "all", agency: "all", status: "all" });
        setCurrentPage(1);
    };

    const handleDelete = (user) => {
        setDeleteTarget(user);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteTarget) {
            setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
            toast(`Utilisateur « ${deleteTarget.name} » supprimé.`, "success");
        }
        setDeleteOpen(false);
        setDeleteTarget(null);
    };

    const handleToggleStatus = (user) => {
        setToggleTarget(user);
        setToggleOpen(true);
    };

    const handleConfirmToggle = (user, newStatus) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
        const label = newStatus === "active" ? "activé" : "désactivé";
        toast(`Utilisateur « ${user.name} » ${label}.`, "success");
        setToggleOpen(false);
        setToggleTarget(null);
    };

    return (
        <DashboardLayout
            title="Utilisateurs"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Utilisateurs" }]}
        >
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Gestion des utilisateurs"
                        description="Créer, consulter et gérer les comptes utilisateurs."
                    />
                    <Button className="w-full sm:w-auto" asChild>
                        <a href="/utilisateurs/creer">
                            <UserPlus className="size-4" />
                            Nouvel utilisateur
                        </a>
                    </Button>
                </motion.div>

                <UsersStats users={users} />

                <UsersFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />

                <UsersTable
                    users={paged}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

                <div className="sm:hidden">
                    {paged.map((user, i) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            delay={i * 0.03}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                    <p>
                        {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <DeleteUserDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                user={deleteTarget}
                onConfirm={handleConfirmDelete}
            />

            <ToggleStatusDialog
                open={toggleOpen}
                onOpenChange={setToggleOpen}
                user={toggleTarget}
                onConfirm={handleConfirmToggle}
            />
        </DashboardLayout>
    );
}
