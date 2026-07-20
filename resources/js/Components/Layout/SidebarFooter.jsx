import { Link } from "@inertiajs/react";
import { Avatar, AvatarFallback } from "@/Components/UI/Avatar";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarCollapse from "./SidebarCollapse";

export default function SidebarFooter({ collapsed, onToggle, user }) {
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "SA";

    return (
        <div className={cn("border-t border-slate-100 px-3 py-3", collapsed && "px-2")}>
            {!collapsed && user && (
                <div className="mb-3 flex items-center gap-3 rounded-xl px-2 py-2">
                    <Avatar className="size-9">
                        <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="truncate text-xs text-slate-500">{user.role || "Super Admin"}</p>
                    </div>
                </div>
            )}
            {collapsed && user && (
                <div className="mb-3 flex justify-center">
                    <Avatar className="size-9">
                        <AvatarFallback className="bg-slate-900 text-xs font-semibold text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}
            <SidebarCollapse collapsed={collapsed} onToggle={onToggle} />
        </div>
    );
}
