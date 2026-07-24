import { motion } from "framer-motion";
import { MoreHorizontal, Eye, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/Components/UI/DropdownMenu";
import UserStatusBadge from "./UserStatusBadge";
import RoleBadge from "./RoleBadge";
import AgencyBadge from "./AgencyBadge";
import { getDashboardBaseFromUrl } from "@/lib/utils";

export default function UserCard({ user, onDelete, onToggleStatus, delay = 0 }) {
    const base = getDashboardBaseFromUrl(window.location.pathname);
    const initials = user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const isActive = user.status === "active";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            whileHover={{ y: -1, transition: { duration: 0.15 } }}
            className="group rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgb(0,0,0,0.06)] sm:hidden"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                        {user.avatar ? (
                            <img src={user.avatar} alt="" className="size-10 rounded-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Actions"
                        >
                            <MoreHorizontal className="size-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href={`${base}/utilisateurs/${user.id}`}>
                                <Eye className="size-4" />
                                Voir
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={`${base}/utilisateurs/${user.id}/modifier`}>
                                <Pencil className="size-4" />
                                Modifier
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onToggleStatus?.(user)}>
                            {isActive ? (
                                <>
                                    <UserX className="size-4 text-amber-500" />
                                    <span className="text-amber-600">Désactiver</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck className="size-4 text-emerald-500" />
                                    <span className="text-emerald-600">Activer</span>
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => onDelete?.(user)}
                        >
                            <Trash2 className="size-4" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <RoleBadge role={user.role} />
                <AgencyBadge agency={user.agency} />
                <UserStatusBadge status={user.status} />
            </div>
            <p className="mt-2 text-xs text-slate-400">Créé le {user.createdAt}</p>
        </motion.div>
    );
}
