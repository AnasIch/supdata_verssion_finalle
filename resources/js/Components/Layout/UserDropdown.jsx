import { Link } from "@inertiajs/react";
import { Avatar, AvatarFallback } from "@/Components/UI/Avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/UI/DropdownMenu";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";

export default function UserDropdown({ user }) {
    const name = user?.name || "Super Admin";
    const email = user?.email || "admin@supdata.fr";
    const role = user?.role || "Super Admin";
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
                    <Avatar className="size-9">
                        <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left md:block">
                        <p className="text-sm font-semibold leading-tight text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">{role}</p>
                    </div>
                    <ChevronDown className="hidden size-4 text-slate-400 md:block" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)]">
                <DropdownMenuLabel className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs font-normal text-slate-500">{email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-0.5 cursor-pointer px-3 py-2">
                    <Link href="/profil">
                        <User className="size-4 text-slate-400" />
                        Mon profil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-0.5 cursor-pointer px-3 py-2">
                    <Link href="/parametres">
                        <Settings className="size-4 text-slate-400" />
                        Paramètres
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-0.5 cursor-pointer px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-700">
                    <Link href="/logout" method="post" as="button">
                        <LogOut className="size-4" />
                        Déconnexion
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
