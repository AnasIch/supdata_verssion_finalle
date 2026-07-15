import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    RotateCcw,
    Save,
    Globe,
    Bell,
    Shield,
    Palette,
    Sun,
    Moon,
    Monitor,
    AlertTriangle,
    Info,
    ExternalLink,
    Mail,
} from "lucide-react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { Label } from "@/Components/UI/Label";
import { Switch } from "@/Components/UI/Switch";
import { Skeleton } from "@/Components/UI/Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/UI/Tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/Components/UI/Dialog";
import { useToast } from "@/Components/UI/Toast";
import { useSettingsForm } from "@/Hooks/useSettings";
import {
    languages,
    sessionDurations,
    themeOptions,
} from "@/Mocks/settings";
import { systemInfo } from "@/Mocks/systemInfo";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

function LoadingSkeleton() {
    return (
        <DashboardLayout title="Paramètres" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Paramètres" }]}>
            <div className="flex flex-col gap-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Card>
                    <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function FieldGroup({ label, error, children, className }) {
    return (
        <div className={`flex flex-col gap-2 ${className || ""}`}>
            <Label>{label}</Label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function SwitchRow({ label, description, checked, onCheckedChange }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-slate-900">{label}</span>
                {description && <span className="text-xs text-slate-500">{description}</span>}
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
        </div>
    );
}

function GeneralTab({ form }) {
    const { register, formState: { errors } } = form;
    return (
        <div className="flex flex-col gap-5">
            <FieldGroup label="Nom de la plateforme" error={errors.platformName?.message}>
                <Input {...register("platformName")} placeholder="SUPDATA ERP" aria-required="true" aria-invalid={!!errors.platformName} />
            </FieldGroup>
            <FieldGroup label="Description" error={errors.description?.message}>
                <Input {...register("description")} placeholder="Description de la plateforme" aria-required="true" aria-invalid={!!errors.description} />
            </FieldGroup>
            <FieldGroup label="Langue" error={errors.language?.message}>
                <Select defaultValue={form.getValues("language")} onValueChange={(v) => form.setValue("language", v, { shouldDirty: true })}>
                    <SelectTrigger aria-label="Langue"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {languages.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </FieldGroup>
        </div>
    );
}

function NotificationsTab({ notifications, toggleNotification }) {
    const items = [
        { key: "emailNotifications", label: "Notifications Email", description: "Recevoir les notifications par email" },
        { key: "browserNotifications", label: "Notifications navigateur", description: "Recevoir les notifications dans le navigateur" },
        { key: "creationConfirmation", label: "Confirmation de création", description: "Notification lors de la création d'un élément" },
        { key: "modificationConfirmation", label: "Confirmation de modification", description: "Notification lors de la modification d'un élément" },
        { key: "deletionConfirmation", label: "Confirmation de suppression", description: "Notification lors de la suppression d'un élément" },
        { key: "stockAlerts", label: "Notifications de rupture de stock", description: "Alerte quand le stock est bas" },
        { key: "validationNotifications", label: "Notifications de validation", description: "Notification lors de la validation d'une demande" },
        { key: "rejectionNotifications", label: "Notifications de refus", description: "Notification lors du refus d'une demande" },
    ];
    return (
        <div className="flex flex-col gap-3">
            {items.map((item) => (
                <SwitchRow
                    key={item.key}
                    label={item.label}
                    description={item.description}
                    checked={notifications[item.key]}
                    onCheckedChange={() => toggleNotification(item.key)}
                />
            ))}
        </div>
    );
}

function SecurityTab({ form }) {
    const { register, formState: { errors }, setValue, watch } = form;
    return (
        <div className="flex flex-col gap-5">
            <FieldGroup label="Durée de session" error={errors.sessionDuration?.message}>
                <Select defaultValue={String(watch("sessionDuration"))} onValueChange={(v) => setValue("sessionDuration", Number(v), { shouldDirty: true })}>
                    <SelectTrigger aria-label="Durée de session"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {sessionDurations.map((d) => <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>)}
                    </SelectContent>
                </Select>
            </FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldGroup label="Longueur minimale du mot de passe" error={errors.minPasswordLength?.message}>
                    <Input type="number" {...register("minPasswordLength", { valueAsNumber: true })} min={8} max={32} aria-required="true" aria-invalid={!!errors.minPasswordLength} />
                </FieldGroup>
                <FieldGroup label="Nombre maximal de tentatives" error={errors.maxLoginAttempts?.message}>
                    <Input type="number" {...register("maxLoginAttempts", { valueAsNumber: true })} min={1} max={10} aria-required="true" aria-invalid={!!errors.maxLoginAttempts} />
                </FieldGroup>
            </div>
            <div className="flex flex-col gap-3">
                <SwitchRow
                    label="Exiger des caractères spéciaux"
                    description="Les mots de passe doivent contenir au moins un caractère spécial"
                    checked={watch("requireSpecialChars")}
                    onCheckedChange={(v) => setValue("requireSpecialChars", v, { shouldDirty: true })}
                />
                <SwitchRow
                    label="Exiger des majuscules"
                    description="Les mots de passe doivent contenir au moins une majuscule"
                    checked={watch("requireUppercase")}
                    onCheckedChange={(v) => setValue("requireUppercase", v, { shouldDirty: true })}
                />
                <SwitchRow
                    label="Double authentification"
                    description="Activer la verification en deux étapes (2FA)"
                    checked={watch("twoFactorAuth")}
                    onCheckedChange={(v) => setValue("twoFactorAuth", v, { shouldDirty: true })}
                />
                <SwitchRow
                    label="Déconnexion automatique"
                    description="Déconnecter les utilisateurs après inactivité"
                    checked={watch("autoLogout")}
                    onCheckedChange={(v) => setValue("autoLogout", v, { shouldDirty: true })}
                />
            </div>
        </div>
    );
}

function AppearanceTab({ appearance, updateAppearance }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <Label>Thème</Label>
                <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateAppearance("theme", opt.value)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                                appearance.theme === opt.value
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                            aria-pressed={appearance.theme === opt.value}
                        >
                            {opt.value === "light" && <Sun className="size-5 text-amber-500" />}
                            {opt.value === "dark" && <Moon className="size-5 text-indigo-500" />}
                            {opt.value === "system" && <Monitor className="size-5 text-slate-600" />}
                            <span className="text-sm font-medium text-slate-900">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AboutTab() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-5">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/20">
                    <svg viewBox="0 0 32 32" fill="none" className="size-7">
                        <rect x="6" y="6" width="9" height="9" rx="2" fill="white" opacity="0.9" />
                        <rect x="17" y="6" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                        <rect x="6" y="17" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                        <rect x="17" y="17" width="9" height="9" rx="2" fill="white" opacity="0.4" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">SUPDATA ERP</h3>
                    <p className="text-sm text-slate-500">Version {systemInfo.version}</p>
                </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
                Plateforme de gestion intégré pour les opérations SUPDATA.
                Conçue pour optimiser la gestion des achats, du stock, des clients et des agences.
            </p>

            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-slate-900">Équipe de développement</h4>
                <p className="text-sm text-slate-500">
                    Développé par l'équipe technique SUPDATA pour les besoins internes de l'entreprise.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-slate-900">Contact support</h4>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                    <Mail className="size-4 text-slate-400" />
                    <span className="text-sm text-slate-600">support@supdata.ma</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold text-slate-900">Liens utiles</h4>
                <div className="flex flex-col gap-1">
                    <a href="#" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <ExternalLink className="size-3.5" />
                        Documentation
                    </a>
                    <a href="#" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <ExternalLink className="size-3.5" />
                        Conditions d'utilisation
                    </a>
                    <a href="#" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <ExternalLink className="size-3.5" />
                        Politique de confidentialité
                    </a>
                </div>
            </div>
        </div>
    );
}

const tabItems = [
    { value: "general", label: "Général", icon: Globe },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "security", label: "Sécurité", icon: Shield },
    { value: "appearance", label: "Apparence", icon: Palette },
    { value: "about", label: "À propos", icon: Info },
];

export default function SettingsIndex() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [pendingTab, setPendingTab] = useState(null);
    const [activeTab, setActiveTab] = useState("general");

    const {
        generalForm,
        securityForm,
        notifications,
        appearance,
        isDirty,
        resetAll,
        toggleNotification,
        updateAppearance,
    } = useSettingsForm();

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

    const handleTabChange = useCallback((value) => {
        if (isDirty) {
            setPendingTab(value);
            setLeaveDialogOpen(true);
        } else {
            setActiveTab(value);
        }
    }, [isDirty]);

    const handleSave = useCallback(() => {
        toast("Paramètres enregistrés avec succès.", "success");
        generalForm.reset(generalForm.getValues());
        securityForm.reset(securityForm.getValues());
    }, [toast, generalForm, securityForm]);

    const handleRestore = useCallback(() => {
        resetAll();
        toast("Paramètres restaurés.", "info");
    }, [resetAll, toast]);

    if (loading) return <LoadingSkeleton />;

    return (
        <DashboardLayout
            title="Paramètres"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Paramètres" }]}
        >
            <Head title="Paramètres — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PageTitle title="Paramètres" description="Configurez votre plateforme SUPDATA ERP." />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleRestore}>
                            <RotateCcw className="size-4" />
                            Restaurer
                        </Button>
                        <Button onClick={handleSave} disabled={!isDirty}>
                            <Save className="size-4" />
                            Enregistrer
                        </Button>
                    </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-1 rounded-xl bg-slate-100 p-1 sm:flex-nowrap">
                            {tabItems.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 text-xs sm:text-sm">
                                    <tab.icon className="size-3.5 sm:size-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Paramètres généraux</CardTitle>
                                    <CardDescription>Configuration de base de la plateforme.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <GeneralTab form={generalForm} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Notifications</CardTitle>
                                    <CardDescription>Gérez vos préférences de notification.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <NotificationsTab notifications={notifications} toggleNotification={toggleNotification} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Sécurité</CardTitle>
                                    <CardDescription>Paramètres de sécurité et d'authentification.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SecurityTab form={securityForm} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="appearance">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Apparence</CardTitle>
                                    <CardDescription>Personnalisez l'apparence de la plateforme.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AppearanceTab appearance={appearance} updateAppearance={updateAppearance} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="about">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">À propos</CardTitle>
                                    <CardDescription>Informations sur la plateforme SUPDATA ERP.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AboutTab />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50">
                            <AlertTriangle className="size-6 text-amber-500" />
                        </div>
                        <DialogTitle className="mt-2 text-center">Modifications non enregistrées</DialogTitle>
                        <DialogDescription className="text-center">
                            Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cet onglet ?
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
                                resetAll();
                                setActiveTab(pendingTab);
                                setPendingTab(null);
                            }}
                        >
                            Quitter
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
