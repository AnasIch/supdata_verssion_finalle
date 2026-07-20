import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { Head, router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getDashboardBaseFromUrl } from "@/lib/utils";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { useToast } from "@/Components/UI/Toast";
import UsersStats from "@/Components/Users/UsersStats";
import UsersFilters from "@/Components/Users/UsersFilters";
import UsersTable from "@/Components/Users/UsersTable";
import UserCard from "@/Components/Users/UserCard";
import DeleteUserDialog from "@/Components/Users/DeleteUserDialog";
import ToggleStatusDialog from "@/Components/Users/ToggleStatusDialog";

export default function UsersIndex() {
    const { url } = usePage();
    const { users, pagination, stats, roles, agencies, filters: serverFilters, flash } = usePage().props;
    const toast = useToast();
    const base = getDashboardBaseFromUrl(url);

    useEffect(() => {
        if (flash?.success) {
            toast(flash.success, "success");
        }
        if (flash?.warning) {
            toast(flash.warning, "warning");
        }
        if (flash?.error) {
            toast(flash.error, "error");
        }
    }, [flash, toast]);

    const [filters, setFilters] = useState({
        search: serverFilters?.search || "",
        role: serverFilters?.role || "all",
        agency: serverFilters?.agency || "all",
        status: serverFilters?.status || "all",
    });

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [toggleTarget, setToggleTarget] = useState(null);
    const [toggleOpen, setToggleOpen] = useState(false);

    const fetchUsers = useCallback((params) => {
        const query = {};
        if (params.search) query.search = params.search;
        if (params.role && params.role !== "all") query.role = params.role;
        if (params.agency && params.agency !== "all") query.agency = params.agency;
        if (params.status && params.status !== "all") query.status = params.status;
        if (params.page) query.page = params.page;

        router.get(`${base}/utilisateurs`, query, {
            preserveState: true,
            replace: true,
        });
    }, [base]);

    const handleFilterChange = useCallback((key, value) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        fetchUsers({ ...next, page: 1 });
    }, [filters, fetchUsers]);

    const handleReset = useCallback(() => {
        const reset = { search: "", role: "all", agency: "all", status: "all" };
        setFilters(reset);
        fetchUsers({ ...reset, page: 1 });
    }, [fetchUsers]);

    const handlePageChange = useCallback((page) => {
        fetchUsers({ ...filters, page });
    }, [filters, fetchUsers]);

    const handleDelete = useCallback((user) => {
        setDeleteTarget(user);
        setDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (deleteTarget) {
            router.delete(`${base}/utilisateurs/${deleteTarget.id}`, {
                onSuccess: () => {
                    fetchUsers({ ...filters, page: pagination.currentPage });
                },
            });
        }
        setDeleteOpen(false);
        setDeleteTarget(null);
    }, [deleteTarget, filters, pagination, fetchUsers]);

    const handleToggleStatus = useCallback((user) => {
        setToggleTarget(user);
        setToggleOpen(true);
    }, []);

    const handleConfirmToggle = useCallback((user, newStatus) => {
        router.patch(`${base}/utilisateurs/${user.id}/toggle-status`, {}, {
            onSuccess: () => {
                fetchUsers({ ...filters, page: pagination.currentPage });
            },
        });
        setToggleOpen(false);
        setToggleTarget(null);
    }, [filters, pagination, fetchUsers]);

    return (
        <DashboardLayout
            title="Utilisateurs"
            breadcrumbs={[{ label: "Dashboard", href: base }, { label: "Utilisateurs" }]}
        >
            <Head title="Utilisateurs — SUPDATA" />
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
                        <a href={`${base}/utilisateurs/creer`}>
                            <UserPlus className="size-4" />
                            Nouvel utilisateur
                        </a>
                    </Button>
                </motion.div>

                <UsersStats stats={stats} />

                <UsersFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} roles={roles} agencies={agencies} />

                <UsersTable
                    users={users}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    currentPage={pagination.currentPage}
                    totalPages={pagination.lastPage}
                    onPageChange={handlePageChange}
                />

                <div className="sm:hidden">
                    {users.map((user, i) => (
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
                        {pagination.total} utilisateur{pagination.total !== 1 ? "s" : ""}
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