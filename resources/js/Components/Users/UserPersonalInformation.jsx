import { motion } from "framer-motion";
import { User, Mail, Phone, Camera } from "lucide-react";
import { Input } from "@/Components/UI/Input";

export default function UserPersonalInformation({ form, onChange, errors }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Informations personnelles</h3>

            <div className="mb-5 flex items-center gap-4">
                <div className="relative group">
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-400 overflow-hidden">
                        {form.avatarPreview ? (
                            <img src={form.avatarPreview} alt="Aperçu" className="size-20 rounded-2xl object-cover" />
                        ) : (
                            <span>{(form.firstName?.[0] || "") + (form.lastName?.[0] || "")}</span>
                        )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity cursor-pointer group-hover:opacity-100">
                        <Camera className="size-5 text-white" />
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => onChange("avatar", e.target.files?.[0] || null)}
                        />
                    </label>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-700">Photo de profil</p>
                    <p className="text-xs text-slate-400">JPG, PNG. Max 2 Mo.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="lastName" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Nom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            id="lastName"
                            placeholder="Ex: Alami"
                            value={form.lastName}
                            onChange={(e) => onChange("lastName", e.target.value)}
                            className="pl-9"
                            aria-required="true"
                            aria-invalid={!!errors.lastName}
                        />
                    </div>
                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                </div>
                <div>
                    <label htmlFor="firstName" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Prénom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            id="firstName"
                            placeholder="Ex: Youssef"
                            value={form.firstName}
                            onChange={(e) => onChange("firstName", e.target.value)}
                            className="pl-9"
                            aria-required="true"
                            aria-invalid={!!errors.firstName}
                        />
                    </div>
                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Adresse email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Ex: youssef@supdata.fr"
                            value={form.email}
                            onChange={(e) => onChange("email", e.target.value)}
                            className="pl-9"
                            aria-required="true"
                            aria-invalid={!!errors.email}
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-slate-600">
                        Téléphone
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            id="phone"
                            placeholder="Ex: +212 6 12 34 56 78"
                            value={form.phone}
                            onChange={(e) => onChange("phone", e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
