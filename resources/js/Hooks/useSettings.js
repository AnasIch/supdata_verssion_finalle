import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    generalSettings as defaultGeneral,
    securitySettings as defaultSecurity,
    appearanceSettings as defaultAppearance,
} from "@/Mocks/settings";
import { notificationSettings as defaultNotifications } from "@/Mocks/notifications";

const generalSchema = z.object({
    platformName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
    language: z.string().min(1, "La langue est requise."),
});

const securitySchema = z.object({
    sessionDuration: z.number().min(15, "Minimum 15 minutes."),
    minPasswordLength: z.number().min(8, "Minimum 8 caractères."),
    maxLoginAttempts: z.number().min(1, "Minimum 1 tentative."),
});

export function useSettingsForm({
    general: initialGeneral = defaultGeneral,
    security: initialSecurity = defaultSecurity,
    appearance: initialAppearance = defaultAppearance,
    notifications: initialNotifications = defaultNotifications,
} = {}) {
    const defaultsRef = useRef({ initialGeneral, initialSecurity, initialAppearance, initialNotifications });

    const generalForm = useForm({
        resolver: zodResolver(generalSchema),
        defaultValues: initialGeneral,
    });

    const securityForm = useForm({
        resolver: zodResolver(securitySchema),
        defaultValues: initialSecurity,
    });

    const [notifications, setNotifications] = useState(initialNotifications);
    const [appearance, setAppearance] = useState(initialAppearance);
    const [notificationsDirty, setNotificationsDirty] = useState(false);
    const [appearanceDirty, setAppearanceDirty] = useState(false);

    const isDirty = generalForm.formState.isDirty || securityForm.formState.isDirty || notificationsDirty || appearanceDirty;

    const resetAll = useCallback(() => {
        const d = defaultsRef.current;
        generalForm.reset(d.initialGeneral);
        securityForm.reset(d.initialSecurity);
        setNotifications(d.initialNotifications);
        setAppearance(d.initialAppearance);
        setNotificationsDirty(false);
        setAppearanceDirty(false);
    }, [generalForm, securityForm]);

    const toggleNotification = useCallback((key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
        setNotificationsDirty(true);
    }, []);

    const updateAppearance = useCallback((key, value) => {
        setAppearance((prev) => ({ ...prev, [key]: value }));
        setAppearanceDirty(true);
    }, []);

    return {
        generalForm,
        securityForm,
        notifications,
        appearance,
        isDirty,
        resetAll,
        toggleNotification,
        updateAppearance,
    };
}
