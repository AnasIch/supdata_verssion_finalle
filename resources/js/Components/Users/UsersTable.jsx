import { motion } from "framer-motion";
import { MoreHorizontal, Eye, Pencil, Trash2, UserCheck, UserX, ChevronLeft, ChevronRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/Components/UI/DropdownMenu";
import { Button } from "@/Components/UI/Button";
import { Skeleton } from "@/Components/UI/Skeleton";
import UserStatusBadge from "./UserStatusBadge";
import RoleBadge from "./RoleBadge";
import AgencyBadge from "./AgencyBadge";

export default function UsersTable({
    users,
    onDelete,
    onToggleStatus,
    currentPage,
    totalPages,
    onPageChange,
    loading,
}) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                <div className="p-4">
                    <Skeleton className="mb-4 h-8 w-48" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-slate-50 py-3 last:border-0">
                            <Skeleton className="size-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="mb-1.5 h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="size-8 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100">
                    <svg className="size-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucun utilisateur trouvé</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Essayez de modifier vos filtres ou créez un nouvel utilisateur.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-3 font-medium text-slate-500">Utilisateur</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Email</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Rôle</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Agence</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Statut</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Créé le</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => {
                            const initials = user.name
                                .split(" ")
                                .map((w) => w[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase();

                            const isActive = user.status === "active";

                            return (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                    className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="" className="size-9 rounded-full object-cover" />
                                                ) : (
                                                    initials
                                                )}
                                            </div>
                                            <span className="font-medium text-slate-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <AgencyBadge agency={user.agency} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <UserStatusBadge status={user.status} />
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">{user.createdAt}</td>
                                    <td className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                                    aria-label={`Actions pour ${user.name}`}
                                                >
                                                    <MoreHorizontal className="size-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <a href={`/utilisateurs/${user.id}`}>
                                                        <Eye className="size-4" />
                                                        Voir
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <a href={`/utilisateurs/${user.id}/modifier`}>
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
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-500">
                        Page {currentPage} sur {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={currentPage <= 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            aria-label="Page précédente"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                variant={p === currentPage ? "outline" : "ghost"}
                                size="icon"
                                className="size-8 text-xs"
                                onClick={() => onPageChange(p)}
                                aria-label={`Page ${p}`}
                                aria-current={p === currentPage ? "page" : undefined}
                            >
                                {p}
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={currentPage >= totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            aria-label="Page suivante"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
