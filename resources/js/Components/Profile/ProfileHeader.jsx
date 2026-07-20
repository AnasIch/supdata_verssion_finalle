import { motion } from "framer-motion";
import { Calendar, Clock, Building2, Shield } from "lucide-react";
import { Badge } from "@/Components/UI/Badge";
import { cn } from "@/lib/utils";
import ProfileAvatar from "./ProfileAvatar";

const roleBadgeColors = {
    "Super Admin": "bg-violet-50 text-violet-600",
    "Administrateur Local": "bg-blue-50 text-blue-600",
    "Gestion Administrative": "bg-emerald-50 text-emerald-600",
    "Responsable Commercial": "bg-amber-50 text-amber-600",
    "Responsable Stock": "bg-cyan-50 text-cyan-600",
};

export default function ProfileHeader({ profile, onAvatarUpload }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white"
        >
            <div className="h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            </div>

            <div className="relative -mt-16 px-6 pb-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                    <ProfileAvatar
                        initials={profile.initials}
                        name={profile.name}
                        size="lg"
                        editable
                        onUpload={onAvatarUpload}
                    />
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-slate-900">
                            {profile.name}
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            {profile.email}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <Badge
                                className={cn(
                                    "text-xs font-medium",
                                    roleBadgeColors[profile.role] || "bg-slate-100 text-slate-600"
                                )}
                            >
                                <Shield size={12} className="mr-1" />
                                {profile.role}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-normal text-slate-500">
                                <Building2 size={12} className="mr-1" />
                                {profile.agency}
                            </Badge>
                        </div>
                    </div>
                    <div className="hidden shrink-0 gap-4 text-xs text-slate-500 sm:flex">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-slate-400" />
                            Membre depuis {profile.created_at}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-slate-400" />
                            Dernière connexion : {profile.last_login_at || "Jamais"}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
