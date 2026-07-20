import { useState } from "react";
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

export default function ProfileInformationForm({
    profile,
    isEditing,
    onStartEditing,
    onCancelEditing,
    onSave,
}) {
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
                        <Button variant="outline" size="sm" onClick={onCancelEditing}>
                            <X size={14} className="mr-1.5" />
                            Annuler
                        </Button>
                        <Button size="sm" type="submit" form="profile-form">
                            <Save size={14} className="mr-1.5" />
                            Enregistrer
                        </Button>
                    </div>
                )}
            </div>

            <hr className="my-5 border-slate-100" />

            <form id="profile-form" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                onSave({
                    name: fd.get("name"),
                    phone: fd.get("phone"),
                });
            }} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Nom complet <span className="ml-0.5 text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                name="name"
                                defaultValue={profile.name}
                                disabled={!isEditing}
                                required
                                aria-required="true"
                                className={cn(
                                    "pl-9",
                                    !isEditing && "cursor-default border-transparent bg-slate-50 text-slate-700"
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Téléphone
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                name="phone"
                                type="tel"
                                defaultValue={profile.phone}
                                disabled={!isEditing}
                                className={cn(
                                    "pl-9",
                                    !isEditing && "cursor-default border-transparent bg-slate-50 text-slate-700"
                                )}
                            />
                        </div>
                    </div>
                </div>

                <hr className="!my-6 border-slate-100" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Adresse email
                        </label>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{profile.email}</span>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Rôle
                        </label>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                            <Shield size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{profile.role}</span>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Agence
                        </label>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                            <Building2 size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{profile.agency}</span>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Membre depuis
                        </label>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{profile.created_at}</span>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Dernière connexion
                        </label>
                        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                            <Clock size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{profile.last_login_at || "Jamais"}</span>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
