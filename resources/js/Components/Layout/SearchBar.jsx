import { useState } from "react";
import { Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchBar({ className }) {
    const [focused, setFocused] = useState(false);

    return (
        <div className={cn("relative", className)}>
            <Search
                className={cn(
                    "absolute left-3 top-1/2 size-4 -translate-y-1/2 transition-colors duration-200",
                    focused ? "text-blue-500" : "text-slate-400"
                )}
            />
            <input
                type="search"
                placeholder="Rechercher..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={cn(
                    "flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-20 text-sm text-slate-900 shadow-[0_1px_2px_rgb(0,0,0,0.03)] outline-none transition-all duration-200 placeholder:text-slate-400/70 hover:border-slate-300 focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.06)]",
                    focused && "border-blue-300 bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.06)]"
                )}
                aria-label="Recherche globale"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                <kbd className="inline-flex h-5 items-center rounded border border-slate-200 bg-slate-100 px-1.5 text-[0.6rem] font-medium text-slate-500">
                    <Command className="mr-0.5 size-2.5" />K
                </kbd>
            </div>
        </div>
    );
}
