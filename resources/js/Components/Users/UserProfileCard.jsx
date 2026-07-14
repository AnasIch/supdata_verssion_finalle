import { motion } from "framer-motion";
import { Mail, Building2, Shield, Calendar, Clock } from "lucide-react";
import UserStatusBadge from "./UserStatusBadge";
import RoleBadge from "./RoleBadge";
import AgencyBadge from "./AgencyBadge";

export default function UserProfileCard({ user }) {
    const initials = user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgb(0,0,0,0.04)] sm:p-8"
        >
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="relative">
                    <div className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl font-bold text-slate-600 sm:size-28">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="size-28 rounded-2xl object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <span
                        className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white ${
                            user.status === "active" ? "bg-emerald-400" : user.status === "suspended" ? "bg-red-400" : "bg-slate-400"
                        }`}
                    />
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">{user.name}</h2>
                    <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
                        <Mail className="size-3.5" />
                        {user.email}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                        <RoleBadge role={user.role} />
                        <AgencyBadge agency={user.agency} />
                        <UserStatusBadge status={user.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Calendar className="size-3.5" />
                            <span>Créé le <span className="font-medium text-slate-700">{user.createdAt}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Clock className="size-3.5" />
                            <span>Connexion <span className="font-medium text-slate-700">{user.lastLogin}</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
