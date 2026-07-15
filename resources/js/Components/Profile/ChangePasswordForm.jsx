import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Save, KeyRound, Shield } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";

import { cn } from "@/lib/utils";

export default function ChangePasswordForm({ form, onSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordFields = [
        {
            name: "currentPassword",
            label: "Mot de passe actuel",
            icon: Lock,
            show: showCurrent,
            toggle: () => setShowCurrent((p) => !p),
        },
        {
            name: "newPassword",
            label: "Nouveau mot de passe",
            icon: KeyRound,
            show: showNew,
            toggle: () => setShowNew((p) => !p),
        },
        {
            name: "confirmPassword",
            label: "Confirmer le mot de passe",
            icon: Shield,
            show: showConfirm,
            toggle: () => setShowConfirm((p) => !p),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6"
        >
            <div>
                <h3 className="text-base font-semibold text-slate-900">
                    Changer le mot de passe
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                    Assurez-vous d'utiliser un mot de passe fort
                </p>
            </div>

            <hr className="my-5 border-slate-100" />

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {passwordFields.map((field) => (
                    <div key={field.name}>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            {field.label}
                        </label>
                        <div className="relative">
                            <field.icon
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <Input
                                {...register(field.name)}
                                type={field.show ? "text" : "password"}
                                placeholder="••••••••"
                                aria-invalid={errors[field.name] ? "true" : "false"}
                                aria-required="true"
                                className={cn(
                                    "pl-9 pr-10",
                                    errors[field.name] && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                )}
                            />
                            <button
                                type="button"
                                onClick={field.toggle}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                aria-label={field.show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            >
                                {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors[field.name] && (
                            <p className="mt-1 text-xs text-red-500" role="alert">
                                {errors[field.name].message}
                            </p>
                        )}
                    </div>
                ))}

                <div className="rounded-lg bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-700">
                        Exigences du mot de passe
                    </p>
                    <ul className="mt-1.5 flex flex-col gap-1 text-xs text-amber-600">
                        <li>• Minimum 8 caractères</li>
                        <li>• Au moins une majuscule</li>
                        <li>• Au moins un chiffre</li>
                        <li>• Au moins un caractère spécial</li>
                    </ul>
                </div>

                <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                >
                    <Save size={14} className="mr-1.5" />
                    {isSubmitting ? "Modification en cours…" : "Modifier le mot de passe"}
                </Button>
            </form>
        </motion.div>
    );
}
