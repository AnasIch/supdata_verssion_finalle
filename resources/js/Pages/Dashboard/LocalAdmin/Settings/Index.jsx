import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";
import { Skeleton } from "@/Components/UI/Skeleton";
import { useToast } from "@/Components/UI/Toast";
import { useLocalAdminSettings } from "@/Hooks/useLocalAdminSettings";
import SettingsHeader from "@/Components/LocalAdmin/Settings/SettingsHeader";
import RequestsSection from "@/Components/LocalAdmin/Settings/RequestsSection";
import StockSection from "@/Components/LocalAdmin/Settings/StockSection";
import NotificationsSection from "@/Components/LocalAdmin/Settings/NotificationsSection";
import SecuritySection from "@/Components/LocalAdmin/Settings/SecuritySection";
import AuditTimelineSection from "@/Components/LocalAdmin/Settings/AuditTimelineSection";

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

function LoadingSkeleton() {
    const skeletonUser = getCurrentUser();
    return (
        <DashboardLayout title="Paramètres" breadcrumbs={[{ label: "Dashboard", href: getDashboardPath(skeletonUser.role) }, { label: "Paramètres" }]}>
            <div className="flex flex-col gap-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        </DashboardLayout>
    );
}

export default function LocalAdminSettingsIndex() {
    const user = useMemo(() => getCurrentUser(), []);
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { data, isDirty, updateField, toggleField, resetChanges, saveChanges } = useLocalAdminSettings();

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (isDirty) { e.preventDefault(); e.returnValue = ""; }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const handleSave = useCallback(() => {
        setSaving(true);
        setTimeout(() => {
            saveChanges();
            setSaving(false);
            toast("Paramètres enregistrés.", "success");
        }, 400);
    }, [saveChanges, toast]);

    const handleReset = useCallback(() => {
        resetChanges();
        toast("Modifications annulées.", "info");
    }, [resetChanges, toast]);

    if (loading) return <LoadingSkeleton />;

    return (
        <DashboardLayout
            title="Paramètres"
            breadcrumbs={[{ label: "Dashboard", href: getDashboardPath(user.role) }, { label: "Paramètres" }]}
            user={user}
        >
            <Head title="Paramètres — Agence" />
            <div className="flex flex-col gap-6">
                <motion.div {...fadeUp}>
                    <SettingsHeader hasChanges={isDirty} onSave={handleSave} onReset={handleReset} saving={saving} />
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
                    <RequestsSection
                        data={data.requests}
                        onUpdate={(k, v) => updateField("requests", k, v)}
                        onToggle={(k) => toggleField("requests", k)}
                    />
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                    <StockSection
                        data={data.stock}
                        onUpdate={(k, v) => updateField("stock", k, v)}
                        onToggle={(k) => toggleField("stock", k)}
                    />
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                    <NotificationsSection
                        data={data.notifications}
                        onToggle={(k) => toggleField("notifications", k)}
                    />
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                    <SecuritySection
                        data={data.security}
                        onToggle={(k) => toggleField("security", k)}
                    />
                </motion.div>

                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.25 }}>
                    <AuditTimelineSection data={data.auditLog} />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
