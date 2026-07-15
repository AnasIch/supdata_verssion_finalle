import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Shield,
    Building2,
    Calendar,
    Clock,
    Save,
    X,
    Pencil,
} from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";

import { cn } from "@/lib/utils";

const fieldConfig = [
    { name: "firstName", label: "Prénom", icon: User, required: true },
    { name: "lastName", label: "Nom", icon: User, required: true },
    { name: "email", label: "Adresse email", icon: Mail, type: "email", required: true },
    { name: "phone", label: "Téléphone", icon: Phone, type: "tel" },
];

const metaFields = [
    { label: "Rôle", icon: Shield, value: "role" },
    { label: "Agence", icon: Building2, value: "agency" },
    { label: "Membre depuis", icon: Calendar, value: "createdAt" },
    { label: "Dernière connexion", icon: Clock, value: "lastLogin" },
];

export default function ProfileInformationForm({
    form,
    profile,
    isEditing,
    onStartEditing,
    onCancelEditing,
    onSave,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">
                        Informations personnelles
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Gérez vos informations de profil
                    </p>
                </div>
                {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={onStartEditing}>
                        <Pencil size={14} className="mr-1.5" />
                        Modifier
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onCancelEditing}
                        >
                            <X size={14} className="mr-1.5" />
                            Annuler
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSubmit(onSave)}
                            disabled={isSubmitting}
                        >
                            <Save size={14} className="mr-1.5" />
                            {isSubmitting ? "Enregistrement…" : "Enregistrer"}
                        </Button>
                    </div>
                )}
            </div>

            <hr className="my-5 border-slate-100" />

            <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {fieldConfig.map((field) => (
                        <div key={field.name}>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                {field.label}
                                {field.required && (
                                    <span className="ml-0.5 text-red-500">*</span>
                                )}
                            </label>
                            <div className="relative">
                                <field.icon
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <Input
                                    {...register(field.name)}
                                    type={field.type || "text"}
                                    disabled={!isEditing}
                                    aria-invalid={errors[field.name] ? "true" : "false"}
                                    aria-required={field.required ? "true" : undefined}
                                    className={cn(
                                        "pl-9",
                                        !isEditing && "cursor-default border-transparent bg-slate-50 text-slate-700"
                                    )}
                                />
                            </div>
                            {errors[field.name] && (
                                <p className="mt-1 text-xs text-red-500" role="alert">
                                    {errors[field.name].message}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <hr className="!my-6 border-slate-100" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {metaFields.map((field) => (
                        <div key={field.name || field.label}>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                {field.label}
                            </label>
                            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                                <field.icon size={16} className="text-slate-400" />
                                <span className="text-sm text-slate-700">
                                    {profile[field.value]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </motion.div>
    );
}
