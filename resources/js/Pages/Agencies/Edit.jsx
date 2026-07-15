import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, RotateCcw, Building2 } from "lucide-react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { Label } from "@/Components/UI/Label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { Skeleton } from "@/Components/UI/Skeleton";
import { useToast } from "@/Components/UI/Toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/Components/UI/Dialog";
import { useAgencyForm } from "@/Hooks/useAgencies";
import { agencies } from "@/Mocks/agencies";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

function FormSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
            <CardContent className="flex flex-col gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function AgencyEdit({ agencyId }) {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    const agence = agencies.find((a) => a.id === agencyId);

    const { form, resetForm } = useAgencyForm(agence);

    const { register, handleSubmit, formState: { errors, isDirty }, setValue, watch } = form;

    const statusValue = watch("status");

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const onSubmit = useCallback(() => {
        toast("Agence enregistrée avec succès.", "success");
    }, [toast]);

    const handleReset = useCallback(() => {
        resetForm();
        toast("Modification annulée.", "info");
    }, [resetForm, toast]);

    const handleBackClick = useCallback(() => {
        if (isDirty) {
            setPendingNavigation(`/agences/${agencyId}`);
            setLeaveDialogOpen(true);
        } else {
            window.location.href = `/agences/${agencyId}`;
        }
    }, [isDirty, agencyId]);

    if (!agence) {
        return (
            <DashboardLayout title="Modifier" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Agences", href: "/agences" }, { label: "Introuvable" }]}>
                <div className="py-12 text-center text-sm text-slate-500">Agence introuvable.</div>
            </DashboardLayout>
        );
    }

    const fieldClass = "w-full";
    const errorClass = "mt-1 text-xs text-red-500";

    return (
        <DashboardLayout
            title="Modifier l'agence"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Agences", href: "/agences" },
                { label: agence.name, href: `/agences/${agence.id}` },
                { label: "Modifier" },
            ]}
        >
            <Head title="Modifier agence — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageTitle title={`Modifier — ${agence.name}`} description="Modifiez les informations de cette agence." />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleBackClick}>
                            <ArrowLeft className="size-4" />
                            Retour
                        </Button>
                        <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
                            <RotateCcw className="size-4" />
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
                            <Save className="size-4" />
                            Enregistrer
                        </Button>
                    </div>
                </motion.div>

                {loading ? <FormSkeleton /> : (
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Building2 className="size-5" />
                                    </div>
                                    <CardTitle className="text-base">Informations de l'agence</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" id="agency-form">
                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="name">Nom de l'agence</Label>
                                            <Input id="name" {...register("name")} placeholder="Nom de l'agence" className={fieldClass} aria-required="true" aria-invalid={!!errors.name} />
                                            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="city">Ville</Label>
                                            <Input id="city" {...register("city")} placeholder="Ville" className={fieldClass} aria-required="true" aria-invalid={!!errors.city} />
                                            {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2 sm:col-span-2">
                                            <Label htmlFor="address">Adresse</Label>
                                            <Input id="address" {...register("address")} placeholder="Adresse complète" className={fieldClass} aria-required="true" aria-invalid={!!errors.address} />
                                            {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input id="phone" {...register("phone")} placeholder="+212 5 XX XX XX XX" className={fieldClass} aria-required="true" aria-invalid={!!errors.phone} />
                                            {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" {...register("email")} placeholder="agence@supdata.fr" className={fieldClass} aria-required="true" aria-invalid={!!errors.email} />
                                            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="director">Responsable</Label>
                                            <Input id="director" {...register("director")} placeholder="Nom du responsable" className={fieldClass} aria-required="true" aria-invalid={!!errors.director} />
                                            {errors.director && <p className={errorClass}>{errors.director.message}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="status">Statut</Label>
                                            <Select value={statusValue} onValueChange={(v) => setValue("status", v, { shouldDirty: true })}>
                                                <SelectTrigger id="status" aria-label="Statut" aria-invalid={!!errors.status}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Actif</SelectItem>
                                                    <SelectItem value="inactive">Inactif</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status && <p className={errorClass}>{errors.status.message}</p>}
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>

            <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50">
                            <Building2 className="size-6 text-amber-500" />
                        </div>
                        <DialogTitle className="mt-2 text-center">Modifications non enregistrées</DialogTitle>
                        <DialogDescription className="text-center">
                            Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button variant="outline">Continuer l'édition</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setLeaveDialogOpen(false);
                                window.location.href = pendingNavigation || `/agences/${agencyId}`;
                            }}
                        >
                            Quitter sans enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
