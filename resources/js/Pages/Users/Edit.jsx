import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import CreateUserForm from "@/Components/Users/CreateUserForm";
import UserSummaryCard from "@/Components/Users/UserSummaryCard";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/UI/Dialog";

const mockUser = {
    id: 1,
    firstName: "Youssef",
    lastName: "Alami",
    email: "youssef.alami@supdata.fr",
    phone: "+212 6 12 34 56 78",
    avatar: null,
    avatarPreview: null,
    agency: "Casablanca",
    role: "Super Admin",
    status: "active",
    password: "",
    passwordConfirm: "",
    permissions: [
        "Créer utilisateur",
        "Modifier utilisateur",
        "Supprimer utilisateur",
        "Consulter rapports",
        "Gérer permissions",
        "Gérer agences",
        "Gérer les stocks",
        "Approuver demandes",
    ],
};

function shallowEqual(a, b) {
    if (a === b) return true;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
        if (Array.isArray(a[k])) {
            if (!Array.isArray(b[k]) || a[k].length !== b[k].length) return false;
            if (a[k].some((v, i) => v !== b[k][i])) return false;
        } else if (a[k] !== b[k]) {
            return false;
        }
    }
    return true;
}

export default function UserEdit() {
    const [summary, setSummary] = useState(mockUser);
    const [isDirty, setIsDirty] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const pendingNavigation = useRef(null);

    const handleFormChange = useCallback((form) => {
        setSummary(form);
        const { password, passwordConfirm, avatar, ...rest } = form;
        const { password: _, passwordConfirm: __, avatar: ___, ...initialRest } = mockUser;
        setIsDirty(!shallowEqual(rest, initialRest) || form.password.length > 0);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (isDirty) {
                e.preventDefault();
                pendingNavigation.current = () => window.location.reload();
            }
        };
        const handlePopState = () => {
            if (isDirty) {
                setLeaveDialogOpen(true);
            }
        };
        window.addEventListener("beforeunload", handler);
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("beforeunload", handler);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isDirty]);

    const handleLeave = () => {
        setLeaveDialogOpen(false);
        if (pendingNavigation.current) {
            pendingNavigation.current();
        } else {
            window.location.href = "/utilisateurs";
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            setLeaveDialogOpen(true);
        } else {
            window.location.href = "/utilisateurs";
        }
    };

    return (
        <DashboardLayout
            title="Modifier un utilisateur"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-super-admin" },
                { label: "Utilisateurs", href: "/utilisateurs" },
                { label: "Modifier un utilisateur" },
            ]}
        >
            <Head title="Modifier un utilisateur — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Modifier un utilisateur"
                        description="Modifiez les informations d'un utilisateur existant."
                    />
                    <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                        <ArrowLeft className="size-4" />
                        Retour à la liste
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <CreateUserForm
                        onFormChange={handleFormChange}
                        initialValues={mockUser}
                        mode="edit"
                    />
                    <div className="order-first lg:order-last">
                        <UserSummaryCard form={summary} />
                    </div>
                </div>
            </div>

            <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Modifications non enregistrées</DialogTitle>
                        <DialogDescription>
                            Vous avez des modifications non enregistrées.
                            Voulez-vous vraiment quitter cette page ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>
                            Continuer la modification
                        </Button>
                        <Button variant="destructive" onClick={handleLeave}>
                            Quitter sans enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
