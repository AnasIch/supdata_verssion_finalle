import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const agencySchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    city: z.string().min(2, "La ville est requise."),
    address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères."),
    phone: z.string().min(10, "Le numéro de téléphone n'est pas valide."),
    email: z.string().email("L'adresse email n'est pas valide."),
    director: z.string().min(2, "Le nom du responsable est requis."),
    status: z.enum(["active", "inactive"], { message: "Statut invalide." }),
});

export function useAgencyForm(defaultValues) {
    const form = useForm({
        resolver: zodResolver(agencySchema),
        defaultValues: {
            name: defaultValues?.name || "",
            city: defaultValues?.city || "",
            address: defaultValues?.address || "",
            phone: defaultValues?.phone || "",
            email: defaultValues?.email || "",
            director: defaultValues?.director || "",
            status: defaultValues?.status || "active",
        },
    });

    const resetForm = useCallback(() => {
        form.reset({
            name: defaultValues?.name || "",
            city: defaultValues?.city || "",
            address: defaultValues?.address || "",
            phone: defaultValues?.phone || "",
            email: defaultValues?.email || "",
            director: defaultValues?.director || "",
            status: defaultValues?.status || "active",
        });
    }, [form, defaultValues]);

    return { form, resetForm };
}
