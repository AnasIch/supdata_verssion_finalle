import { motion } from "framer-motion";
import { MoreHorizontal, Eye, Users, Lock } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/Components/UI/DropdownMenu";

const roleColors = {
    "Super Admin": "bg-purple-50 text-purple-700 border-purple-200",
    Admin: "bg-blue-50 text-blue-700 border-blue-200",
    Gestionnaire: "bg-amber-50 text-amber-700 border-amber-200",
    Technicien: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Viewer: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function RolesTable({ roles, onViewDetails }) {
    if (roles.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100">
                    <Lock className="size-7 text-slate-400" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucun rôle trouvé</h3>
                <p className="mt-1 text-sm text-slate-500">Aucun rôle ne correspond à votre recherche.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-3 font-medium text-slate-500">Rôle</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Description</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Utilisateurs</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Permissions</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Type</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role, i) => (
                            <motion.tr
                                key={role.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50"
                            >
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleColors[role.name] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                                        {role.name}
                                    </span>
                                </td>
                                <td className="max-w-[280px] px-4 py-3 text-slate-500">{role.description}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Users className="size-3.5 text-slate-400" />
                                        {role.userCount}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Lock className="size-3.5 text-slate-400" />
                                        {role.permissions.length}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {role.isSystem ? (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                                            Système
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                            Personnalisé
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                                aria-label={`Actions pour ${role.name}`}
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onViewDetails?.(role)}>
                                                <Eye className="size-4" />
                                                Voir les permissions
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
