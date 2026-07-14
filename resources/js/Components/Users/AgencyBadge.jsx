import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const colors = {
    Casablanca: "bg-blue-50 text-blue-600 border-blue-200",
    Marrakech: "bg-indigo-50 text-indigo-600 border-indigo-200",
    Rabat: "bg-violet-50 text-violet-600 border-violet-200",
    Tanger: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Fès: "bg-amber-50 text-amber-600 border-amber-200",
};

export default function AgencyBadge({ agency = "—" }) {
    const c = colors[agency] || "bg-slate-50 text-slate-500 border-slate-200";
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                c
            )}
        >
            <Building2 className="size-3" />
            {agency}
        </span>
    );
}
