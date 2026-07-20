import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { User, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getDashboardBaseFromUrl } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/UI/Tabs";
import ProfileHeader from "@/Components/Profile/ProfileHeader";
import ProfileInformationForm from "@/Components/Profile/ProfileInformationForm";
import ChangePasswordForm from "@/Components/Profile/ChangePasswordForm";
import { Button } from "@/Components/UI/Button";

const tabItems = [
    { value: "info", label: "Informations personnelles", icon: User },
    { value: "security", label: "Sécurité", icon: Shield },
];

export default function ProfileIndex({ profile: initialProfile }) {
    const { url, props } = usePage();
    const authUser = props.auth?.user;
    const mustChange = authUser?.must_change_password ?? false;
    const flash = props.flash;
    const base = getDashboardBaseFromUrl(url);

    const [profile, setProfile] = useState(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = "success", title = null) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, title }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };

    const saveProfile = (data) => {
        router.put("/profil", data, {
            preserveState: true,
            onSuccess: () => {
                setIsEditing(false);
                setProfile((prev) => ({ ...prev, name: data.name, phone: data.phone }));
                addToast("Profil mis àjour avec succès.");
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                addToast(first || "Une erreur est survenue.", "error");
            },
        });
    };

    const changePassword = (data) => {
        router.patch("/profil/password", data, {
            preserveState: true,
            onSuccess: () => {
                addToast("Votre mot de passe a été modifié avec succès.", "success", "Mot de passe modifié");
                setTimeout(() => {
                    router.get(base, {}, { replace: true });
                }, 1500);
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                addToast(first || "Une erreur est survenue.", "error", "Erreur");
            },
        });
    };

    useEffect(() => {
        if (flash?.success) addToast(flash.success, "success");
        if (flash?.error) addToast(flash.error, "error");
    }, [flash]);

    const defaultTab = mustChange ? "security" : "info";

    return (
        <DashboardLayout
            title="Mon profil"
            breadcrumbs={[
                { label: "Dashboard", href: base },
                { label: "Mon profil" },
            ]}
            user={authUser}
        >
            <Head title="Mon profil — SUPDATA" />

            <div className="flex flex-col gap-6">
                {mustChange && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-amber-200 bg-amber-50 p-5"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                <AlertTriangle size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-amber-900">
                                    Sécurité
                                </h4>
                                <p className="mt-1 text-sm text-amber-700">
                                    Pour des raisons de sécurité, vous devez modifier votre mot de passe avant de pouvoir accéder à votre espace de travail.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <ProfileHeader profile={profile} onAvatarUpload={() => addToast("Photo de profil mise à jour (simulé).")} />

                <Tabs defaultValue={defaultTab}>
                    <TabsList className="w-full justify-start rounded-xl border border-slate-100 bg-white p-1">
                        {tabItems.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                            >
                                <tab.icon size={16} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="info" className="mt-0">
                        <ProfileInformationForm
                            profile={profile}
                            isEditing={isEditing}
                            onStartEditing={() => setIsEditing(true)}
                            onCancelEditing={() => setIsEditing(false)}
                            onSave={saveProfile}
                        />
                    </TabsContent>

                    <TabsContent value="security" className="mt-0">
                        <ChangePasswordForm onSubmit={changePassword} mustChange={mustChange} />
                    </TabsContent>
                </Tabs>
            </div>

            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        className={
                            toast.type === "success"
                                ? "flex items-start gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg"
                                : "flex items-start gap-3 rounded-xl bg-red-600 px-4 py-3 text-white shadow-lg"
                        }
                    >
                        {toast.type === "success" ? (
                            <CheckCircle size={18} className="mt-0.5 shrink-0" />
                        ) : (
                            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                        )}
                        <div>
                            {toast.title && (
                                <p className="text-sm font-semibold">{toast.title}</p>
                            )}
                            <p className="text-sm">{toast.message}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
}
