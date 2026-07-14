import { motion } from "framer-motion";
import { MoreHorizontal, Eye, Pencil, MapPin, Users, Package } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/Components/UI/DropdownMenu";
import UserStatusBadge from "@/Components/Users/UserStatusBadge";

export default function AgencesTable({ agences, onViewDetails }) {
    if (agences.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200/70 bg-white p-12 text-center shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100">
                    <MapPin className="size-7 text-slate-400" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Aucune agence trouvée</h3>
                <p className="mt-1 text-sm text-slate-500">Aucune agence ne correspond à votre recherche.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-3 font-medium text-slate-500">Agence</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Ville</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Directeur</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Utilisateurs</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Articles</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Statut</th>
                            <th className="px-4 py-3 font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agences.map((agence, i) => (
                            <motion.tr
                                key={agence.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                className="border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">
                                            <MapPin className="size-4" />
                                        </div>
                                        <span className="font-medium text-slate-900">{agence.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500">{agence.city}</td>
                                <td className="px-4 py-3 text-slate-600">{agence.director}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Users className="size-3.5 text-slate-400" />
                                        {agence.userCount}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Package className="size-3.5 text-slate-400" />
                                        {agence.stockItems}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <UserStatusBadge status={agence.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                                aria-label={`Actions pour ${agence.name}`}
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onViewDetails?.(agence)}>
                                                <Eye className="size-4" />
                                                Voir les détails
                                            </DropdownMenuItem>
                                            <DropdownMenuItem disabled>
                                                <Pencil className="size-4" />
                                                Modifier
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
