import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Activity, Monitor } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useProfile } from "@/Hooks/useProfile";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/UI/Tabs";
import ProfileHeader from "@/Components/Profile/ProfileHeader";
import ProfileStatistics from "@/Components/Profile/ProfileStatistics";
import ProfileInformationForm from "@/Components/Profile/ProfileInformationForm";
import ChangePasswordForm from "@/Components/Profile/ChangePasswordForm";
import ProfileActivity from "@/Components/Profile/ProfileActivity";
import SessionList from "@/Components/Profile/SessionList";

const tabItems = [
    { value: "info", label: "Informations personnelles", icon: User },
    { value: "security", label: "Sécurité", icon: Shield },
    { value: "activity", label: "Activité", icon: Activity },
    { value: "sessions", label: "Sessions", icon: Monitor },
];

export default function ProfileIndex() {
    const {
        profile,
        sessions,
        activities,
        isEditing,
        toasts,
        profileForm,
        passwordForm,
        saveProfile,
        changePassword,
        startEditing,
        cancelEditing,
        terminateSession,
        terminateAllOtherSessions,
        addToast,
    } = useProfile();

    return (
        <DashboardLayout
            title="Mon profil"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Mon profil" },
            ]}
        >
            <Head title="Mon profil — SUPDATA" />

            <div className="flex flex-col gap-6">
                <ProfileHeader
                    profile={profile}
                    onAvatarUpload={() =>
                        addToast("Photo de profil mise à jour (simulé).")
                    }
                />

                <ProfileStatistics />

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

                    <TabsContent value="activity" className="mt-0">
                        <ProfileActivity activities={activities} />
                    </TabsContent>

                    <TabsContent value="sessions" className="mt-0">
                        <SessionList
                            sessions={sessions}
                            onTerminate={terminateSession}
                            onTerminateAll={terminateAllOtherSessions}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Toasts */}
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
