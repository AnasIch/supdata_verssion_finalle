import { cn } from "@/lib/utils";

const config = {
    active: {
        dot: "bg-emerald-400",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        label: "Actif",
    },
    inactive: {
        dot: "bg-slate-400",
        bg: "bg-slate-100",
        text: "text-slate-500",
        label: "Inactif",
    },
    suspended: {
        dot: "bg-red-400",
        bg: "bg-red-50",
        text: "text-red-600",
        label: "Suspendu",
    },
};

export default function UserStatusBadge({ status = "active" }) {
    const s = config[status] || config.active;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                s.bg,
                s.text
            )}
        >
            <span className={cn("size-1.5 rounded-full", s.dot)} />
            {s.label}
        </span>
    );
}
