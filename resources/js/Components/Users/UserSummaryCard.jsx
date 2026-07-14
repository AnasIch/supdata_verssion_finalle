import { motion } from "framer-motion";
import { User, Mail, Building2, Shield, BadgeCheck, Key } from "lucide-react";
import RoleBadge from "./RoleBadge";
import AgencyBadge from "./AgencyBadge";
import UserStatusBadge from "./UserStatusBadge";

export default function UserSummaryCard({ form }) {
    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ") || "—";
    const initials = [form.firstName?.[0], form.lastName?.[0]].filter(Boolean).join("").toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="sticky top-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-6"
        >
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Résumé</h3>

            <div className="flex flex-col items-center gap-3">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-500 overflow-hidden">
                    {form.avatarPreview ? (
                        <img src={form.avatarPreview} alt="" className="size-16 rounded-2xl object-cover" />
                    ) : initials !== "" ? (
                        initials
                    ) : (
                        <User className="size-7 text-slate-300" />
                    )}
                </div>

                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-900">{fullName}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{form.email || "email@exemple.com"}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {form.role && <RoleBadge role={form.role} />}
                    {form.agency && <AgencyBadge agency={form.agency} />}
                    {form.status && <UserStatusBadge status={form.status} />}
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2.5 text-sm">
                    <Building2 className="size-4 text-slate-400" />
                    <span className="text-slate-500">Agence</span>
                    <span className="ml-auto font-medium text-slate-700">{form.agency || "—"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                    <Shield className="size-4 text-slate-400" />
                    <span className="text-slate-500">Rôle</span>
                    <span className="ml-auto font-medium text-slate-700">{form.role || "—"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                    <BadgeCheck className="size-4 text-slate-400" />
                    <span className="text-slate-500">Statut</span>
                    <span className="ml-auto font-medium text-slate-700">
                        {form.status === "active" ? "Actif" : form.status === "inactive" ? "Inactif" : "—"}
                    </span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                    <Key className="size-4 text-slate-400" />
                    <span className="text-slate-500">Permissions</span>
                    <span className="ml-auto font-medium text-slate-700">{form.permissions.length}</span>
                </div>
            </div>
        </motion.div>
    );
}
