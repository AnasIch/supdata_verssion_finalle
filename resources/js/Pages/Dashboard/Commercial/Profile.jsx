import { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Palette, Globe, Sun, Moon, Monitor } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { useProfile } from "@/Hooks/useProfile";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/UI/Tabs";
import { Button } from "@/Components/UI/Button";
import ProfileHeader from "@/Components/Profile/ProfileHeader";
import ProfileInformationForm from "@/Components/Profile/ProfileInformationForm";
import ChangePasswordForm from "@/Components/Profile/ChangePasswordForm";

const tabItems = [
    { value: "info", label: "Informations personnelles", icon: User },
    { value: "security", label: "Sécurité", icon: Shield },
    { value: "preferences", label: "Préférences", icon: Palette },
];

const themeOptions = [
    { value: "light", label: "Clair", icon: Sun },
    { value: "dark", label: "Sombre", icon: Moon },
    { value: "system", label: "Système", icon: Monitor },
];

const languageOptions = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
];

function PreferencesSection() {
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("fr");
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6"
        >
            <div>
                <h3 className="text-base font-semibold text-slate-900">
                    Préférences
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                    Personnalisez votre expérience utilisateur
                </p>
            </div>

            <hr className="my-5 border-slate-100" />

            <div className="flex flex-col gap-6">
                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        <Globe size={14} className="mr-1 inline" />
                        Langue
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {languageOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setLanguage(opt.value)}
                                className={cn(
                                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                    language === opt.value
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-medium text-slate-600">
                        <Palette size={14} className="mr-1 inline" />
                        Thème
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {themeOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setTheme(opt.value)}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                    theme === opt.value
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                <opt.icon size={14} />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button size="sm" onClick={handleSave}>
                        Enregistrer
                    </Button>
                    {saved && (
                        <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xs font-medium text-emerald-600"
                        >
                            Préférences enregistrées.
                        </motion.span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function CommercialProfile() {
    const user = useMemo(() => getCurrentUser(), []);
    const {
        profile,
        isEditing,
        toasts,
        profileForm,
        passwordForm,
        saveProfile,
        changePassword,
        startEditing,
        cancelEditing,
        addToast,
    } = useProfile();

    return (
        <DashboardLayout
            title="Mon profil"
            breadcrumbs={[
                { label: "Dashboard", href: getDashboardPath(user.role) },
                { label: "Mon profil" },
            ]}
            user={user}
        >
            <Head title="Mon profil — SUPDATA" />

            <div className="flex flex-col gap-6">
                <ProfileHeader
                    profile={profile}
                    onAvatarUpload={() =>
                        addToast("Photo de profil mise à jour (simulé).")
                    }
                />

                <Tabs defaultValue="info">
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
                            form={profileForm}
                            profile={profile}
                            isEditing={isEditing}
                            onStartEditing={startEditing}
                            onCancelEditing={cancelEditing}
                            onSave={saveProfile}
                        />
                    </TabsContent>

                    <TabsContent value="security" className="mt-0">
                        <ChangePasswordForm
                            form={passwordForm}
                            onSubmit={changePassword}
                        />
                    </TabsContent>

                    <TabsContent value="preferences" className="mt-0">
                        <PreferencesSection />
                    </TabsContent>
                </Tabs>
            </div>

            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            className={cn(
                                "rounded-xl px-4 py-3 text-sm font-medium shadow-lg",
                                toast.type === "success" &&
                                    "bg-emerald-600 text-white",
                                toast.type === "error" &&
                                    "bg-red-600 text-white"
                            )}
                        >
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
