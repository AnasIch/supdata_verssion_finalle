import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Head, router, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { useToast } from "@/Components/UI/Toast";
import ReservationsTable from "@/Components/Commercial/Reservations/ReservationsTable";
import CreateReservationDialog from "@/Components/Commercial/Reservations/CreateReservationDialog";
import EditReservationDialog from "@/Components/Commercial/Reservations/EditReservationDialog";
import DeleteReservationDialog from "@/Components/Commercial/Reservations/DeleteReservationDialog";

export default function CommercialReservationsIndex({
    user,
    reservations,
    reservationsMeta,
    stats,
    products,
    filters,
}) {
    const { props } = usePage();
    const toast = useToast();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const flash = props.flash;
        if (flash?.success) toast(flash.success, "success");
        if (flash?.error) toast(flash.error, "error");
    }, [props.flash]);

    useEffect(() => {
        const errors = props.errors;
        if (errors) {
            const firstError = Object.values(errors)[0];
            if (firstError) toast(firstError, "error");
        }
    }, [props.errors]);

    const handleCreate = useCallback((data) => {
        router.post(route("rc.reservations.store"), data, {
            preserveState: true,
            onFinish: () => setCreateOpen(false),
        });
    }, []);

    const handleEdit = useCallback((reservation) => {
        setSelected(reservation);
        setEditOpen(true);
    }, []);

    const handleEditConfirm = useCallback((id, data) => {
        router.put(route("rc.reservations.update", id), data, {
            preserveState: true,
            onFinish: () => {
                setEditOpen(false);
                setSelected(null);
            },
        });
    }, []);

    const handleDelete = useCallback((reservation) => {
        setSelected(reservation);
        setDeleteOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback((id) => {
        router.delete(route("rc.reservations.destroy", id), {
            preserveState: true,
            onFinish: () => {
                setDeleteOpen(false);
                setSelected(null);
            },
        });
    }, []);

    return (
        <DashboardLayout
            title="Réservation de stock"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-commercial" },
                { label: "Réservation de stock" },
            ]}
            user={user}
        >
            <Head title="Réservation de stock — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Réservation de stock"
                        description="Gestion des réservations de matériel destinées aux clients."
                    />
                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Plus className="size-4" />
                        Nouvelle réservation
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="flex flex-wrap gap-3"
                >
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-4 py-2.5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                        <span className="text-sm text-slate-500">Total</span>
                        <Badge variant="secondary">{stats.total}</Badge>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-4 py-2.5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                        <span className="text-sm text-slate-500">Réservé</span>
                        <Badge variant="info">{stats.reserved}</Badge>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-4 py-2.5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                        <span className="text-sm text-slate-500">Livré</span>
                        <Badge variant="success">{stats.delivered}</Badge>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-4 py-2.5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                        <span className="text-sm text-slate-500">Annulé</span>
                        <Badge variant="destructive">{stats.cancelled}</Badge>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <div className="hidden sm:block">
                        <ReservationsTable
                            data={reservations}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:hidden">
                        {reservations.map((r) => (
                            <div
                                key={r.id}
                                className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-900">{r.reference}</span>
                                    <Badge variant={r.status === "reserved" ? "info" : r.status === "delivered" ? "success" : "destructive"}>
                                        {r.status === "reserved" ? "Réservé" : r.status === "delivered" ? "Livré" : "Annulé"}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-sm text-slate-600">{r.client_name}</p>
                                <p className="text-xs text-slate-500">{r.product?.name}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                    <span>Qté: {r.quantity}</span>
                                    <span>·</span>
                                    <span>{r.agency?.name}</span>
                                </div>
                                {r.status === "reserved" && (
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(r)}
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(r)}
                                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {reservationsMeta.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                router.get(
                                    route("rc.reservations"),
                                    { ...filters, page: Math.max(1, reservationsMeta.currentPage - 1) },
                                    { preserveState: true, replace: true }
                                )
                            }
                            disabled={reservationsMeta.currentPage === 1}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Précédent
                        </button>
                        <span className="px-3 text-sm text-slate-500">
                            Page {reservationsMeta.currentPage} / {reservationsMeta.lastPage}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                router.get(
                                    route("rc.reservations"),
                                    { ...filters, page: Math.min(reservationsMeta.lastPage, reservationsMeta.currentPage + 1) },
                                    { preserveState: true, replace: true }
                                )
                            }
                            disabled={reservationsMeta.currentPage === reservationsMeta.lastPage}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Suivant
                        </button>
                    </div>
                )}

                <div className="text-sm text-slate-500">
                    {reservationsMeta.total} réservation{reservationsMeta.total !== 1 ? "s" : ""}
                </div>
            </div>

            <CreateReservationDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onConfirm={handleCreate}
                products={products}
            />
            <EditReservationDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                reservation={selected}
                onConfirm={handleEditConfirm}
            />
            <DeleteReservationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                reservation={selected}
                onConfirm={handleDeleteConfirm}
            />
        </DashboardLayout>
    );
}
