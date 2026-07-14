import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/Components/UI/Input";

function getStrength(pw) {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 2) return { level: 1, label: "Faible", color: "bg-red-400" };
    if (score <= 3) return { level: 2, label: "Moyen", color: "bg-amber-400" };
    return { level: 3, label: "Fort", color: "bg-emerald-400" };
}

export default function UserSecurityCard({ form, onChange, errors, isEdit = false }) {
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const strength = getStrength(form.password);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Sécurité</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Mot de passe {isEdit ? "" : <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            id="password"
                            type={showPw ? "text" : "password"}
                            placeholder={isEdit ? "Laisser vide pour conserver" : "Minimum 8 caractères"}
                            value={form.password}
                            onChange={(e) => onChange("password", e.target.value)}
                            className="pl-9 pr-10"
                            aria-required={!isEdit}
                            aria-invalid={!!errors.password}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}

                    {form.password && (
                        <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-1 gap-1">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                strength.level >= i ? strength.color : "bg-slate-100"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-slate-500">{strength.label}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="passwordConfirm" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Confirmer le mot de passe {isEdit ? "" : <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            id="passwordConfirm"
                            type={showConfirm ? "text" : "password"}
                            placeholder={isEdit ? "Laisser vide pour conserver" : "Répétez le mot de passe"}
                            value={form.passwordConfirm}
                            onChange={(e) => onChange("passwordConfirm", e.target.value)}
                            className="pl-9 pr-10"
                            aria-required={!isEdit}
                            aria-invalid={!!errors.passwordConfirm}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={showConfirm ? "Masquer la confirmation" : "Afficher la confirmation"}
                        >
                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    {errors.passwordConfirm && <p className="mt-1 text-xs text-red-500">{errors.passwordConfirm}</p>}
                </div>
            </div>
        </motion.div>
    );
}
