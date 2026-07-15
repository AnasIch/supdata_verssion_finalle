import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { profileData as defaultProfile } from "@/Mocks/profile";
import { sessions as defaultSessions } from "@/Mocks/sessions";
import { activityLog as defaultActivities } from "@/Mocks/activity";

const profileSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    email: z.string().email("Adresse email invalide."),
    phone: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
    newPassword: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
        .regex(/[A-Z]/, "Doit contenir au moins une majuscule.")
        .regex(/[0-9]/, "Doit contenir au moins un chiffre.")
        .regex(/[^A-Za-z0-9]/, "Doit contenir au moins un caractère spécial."),
    confirmPassword: z.string().min(1, "La confirmation est requise."),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
});

export function useProfile({ profile = defaultProfile, sessions: initialSessions = defaultSessions, activities: initialActivities = defaultActivities } = {}) {
    const [sessions, setSessions] = useState(initialSessions);
    const [isEditing, setIsEditing] = useState(false);
    const [toasts, setToasts] = useState([]);

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
        },
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const addToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const saveProfile = useCallback(
        async (data) => {
            await new Promise((r) => setTimeout(r, 800));
            setIsEditing(false);
            addToast("Profil mis à jour avec succès.");
        },
        [addToast]
    );

    const changePassword = useCallback(
        async (data) => {
            await new Promise((r) => setTimeout(r, 800));
            passwordForm.reset();
            addToast("Mot de passe modifié avec succès.");
        },
        [passwordForm, addToast]
    );

    const startEditing = useCallback(() => {
        setIsEditing(true);
    }, []);

    const cancelEditing = useCallback(() => {
        profileForm.reset({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
        });
        setIsEditing(false);
    }, [profileForm, profile]);

    const terminateSession = useCallback(
        async (sessionId) => {
            await new Promise((r) => setTimeout(r, 500));
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            addToast("Session déconnectée.");
        },
        [addToast]
    );

    const terminateAllOtherSessions = useCallback(async () => {
        await new Promise((r) => setTimeout(r, 500));
        setSessions((prev) => prev.filter((s) => s.isCurrent));
        addToast("Toutes les autres sessions ont été déconnectées.");
    }, [addToast]);

    return {
        profile,
        sessions,
        activities: initialActivities,
        isEditing,
        toasts,
        profileForm,
        passwordForm,
        profileSchema,
        passwordSchema,
        saveProfile,
        changePassword,
        startEditing,
        cancelEditing,
        terminateSession,
        terminateAllOtherSessions,
        addToast,
    };
}
