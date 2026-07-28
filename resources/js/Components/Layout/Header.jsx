import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import SearchBar from "./SearchBar";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

export default function Header({ breadcrumbs = [], user, onMobileMenuOpen, showNotifications = true }) {
    const [dark, setDark] = useState(false);
    useEffect(() => { const saved = localStorage.getItem('supdata-theme'); const enabled = saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches); setDark(enabled); document.documentElement.classList.toggle('dark', enabled); }, []);
    const toggleTheme = () => { const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next); localStorage.setItem('supdata-theme', next ? 'dark' : 'light'); };
    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <button
                onClick={onMobileMenuOpen}
                className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 lg:hidden"
                aria-label="Ouvrir le menu"
            >
                <Menu className="size-5" />
            </button>

            <div className="hidden lg:block">
                <Breadcrumbs items={breadcrumbs} />
            </div>

            <div className="flex-1" />

            <SearchBar className="hidden w-full max-w-xs md:block lg:max-w-sm" />

            {showNotifications && <NotificationDropdown />}
            <button onClick={toggleTheme} className="flex size-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"}>{dark ? <Sun className="size-5" /> : <Moon className="size-5" />}</button>

            <div className="hidden border-l border-slate-200 pl-2 md:block">
                <UserDropdown user={user} hideSettings={user?.role === "Super Admin" || user?.role === "Responsable Commercial" || user?.role === "Administrateur Local" || user?.role === "Responsable Stock" || user?.role === "Gestion Administrative"} />
            </div>
        </header>
    );
}
