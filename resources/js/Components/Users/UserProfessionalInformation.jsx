import { motion } from "framer-motion";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/Components/UI/Select";

export default function UserProfessionalInformation({ form, onChange, errors, roles = [], agencies = [] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Informations professionnelles</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Agence <span className="text-red-500">*</span>
                    </label>
                    <Select value={form.agency} onValueChange={(v) => onChange("agency", v)}>
                        <SelectTrigger aria-label="Sélectionner une agence" aria-invalid={!!errors.agency}>
                            <SelectValue placeholder="Choisir une agence" />
                        </SelectTrigger>
                        <SelectContent>
                            {agencies.map((a) => (
                                <SelectItem key={a.id} value={a.city}>{a.city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.agency && <p className="mt-1 text-xs text-red-500">{errors.agency}</p>}
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Rôle <span className="text-red-500">*</span>
                    </label>
                    <Select value={form.role} onValueChange={(v) => onChange("role", v)}>
                        <SelectTrigger aria-label="Sélectionner un rôle" aria-invalid={!!errors.role}>
                            <SelectValue placeholder="Choisir un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((r) => (
                                <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Statut <span className="text-red-500">*</span>
                    </label>
                    <Select value={form.status} onValueChange={(v) => onChange("status", v)}>
                        <SelectTrigger aria-label="Sélectionner un statut">
                            <SelectValue placeholder="Choisir un statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </motion.div>
    );
}