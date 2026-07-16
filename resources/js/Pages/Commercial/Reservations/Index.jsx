import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Head } from "@inertiajs/react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import ReservationsTable from "@/Components/Commercial/Reservations/ReservationsTable";
import CreateReservationDialog from "@/Components/Commercial/Reservations/CreateReservationDialog";
import EditReservationDialog from "@/Components/Commercial/Reservations/EditReservationDialog";
import DeleteReservationDialog from "@/Components/Commercial/Reservations/DeleteReservationDialog";
import { useToast } from "@/Components/UI/Toast";
import { useCommercialReservations } from "@/Hooks/useCommercialReservations";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

export default function CommercialReservationsIndex() {
    const user = useMemo(() => getCurrentUser(), []);
    const toast = useToast();
    const {
        reservations,
        stats,
        createReservation,
        editReservation,
        deleteReservation,
    } = useCommercialReservations();

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleCreate = (data) => {
        createReservation(data);
        setCreateOpen(false);
        toast("Réservation créée avec succès.", "success");
    };

    const handleEdit = (reservation) => {
        setSelected(reservation);
        setEditOpen(true);
    };

    const handleEditConfirm = (id, data) => {
        editReservation(id, data);
        setEditOpen(false);
        setSelected(null);
        toast("Réservation modifiée avec succès.", "success");
    };

    const handleDelete = (reservation) => {
        setSelected(reservation);
        setDeleteOpen(true);
    };

    const handleDeleteConfirm = (id) => {
        deleteReservation(id);
        setDeleteOpen(false);
        setSelected(null);
        toast("Réservation supprimée.", "success");
    };

    return (
        <DashboardLayout
            title="Réservation de stock"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
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
                                    <span className="text-sm font-medium text-slate-900">{r.id}</span>
                                    <Badge variant={r.status === "Réservé" ? "info" : r.status === "Livré" ? "success" : "destructive"}>
                                        {r.status}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-sm text-slate-600">{r.clientName}</p>
                                <p className="text-xs text-slate-500">{r.productName}</p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                    <span>Qté: {r.quantity}</span>
                                    <span>·</span>
                                    <span>{r.agency}</span>
                                    <span>·</span>
                                    <span>{r.date}</span>
                                </div>
                                {r.status === "Réservé" && (
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

                <div className="text-sm text-slate-500">
                    {reservations.length} réservation{reservations.length !== 1 ? "s" : ""}
                </div>
            </div>

            <CreateReservationDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onConfirm={handleCreate}
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
