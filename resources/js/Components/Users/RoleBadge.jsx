import { cn } from "@/lib/utils";

const config = {
    "Super Admin": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    "Administrateur Local": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    "Gestion Administrative": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    "Responsable Commercial": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    "Responsable Stock": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
};

export default function RoleBadge({ role = "Super Admin" }) {
    const c = config[role] || config["Super Admin"];
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                c.bg,
                c.text,
                c.border
            )}
        >
            {role}
        </span>
    );
}
