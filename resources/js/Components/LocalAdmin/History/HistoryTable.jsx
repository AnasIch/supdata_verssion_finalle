import { Badge } from "@/Components/UI/Badge";
import { DataTable } from "@/Components/UI/DataTable";
import {
    LogIn,
    LogOut,
    Eye,
    CheckCircle2,
    XCircle,
    KeyRound,
    ClipboardList,
    Package,
    UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actionConfig = {
    Connexion: { icon: LogIn, color: "bg-emerald-50 text-emerald-600" },
    Déconnexion: { icon: LogOut, color: "bg-slate-100 text-slate-600" },
    Consultation: { icon: Eye, color: "bg-blue-50 text-blue-600" },
    Confirmation: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
    Rejet: { icon: XCircle, color: "bg-red-50 text-red-600" },
    Modification: { icon: UserCog, color: "bg-amber-50 text-amber-600" },
    Validation: { icon: CheckCircle2, color: "bg-blue-50 text-blue-600" },
    default: { icon: ClipboardList, color: "bg-slate-100 text-slate-600" },
};

function getActionConfig(action) {
    return actionConfig[action] || actionConfig.default;
}

const columns = [
    {
        header: "Date",
        accessorKey: "timestamp",
        cell: (row) => {
            const parts = (row.timestamp || "").split(" ");
            return (
                <span className="text-sm text-slate-700">{parts[0] || "—"}</span>
            );
        },
    },
    {
        header: "Heure",
        accessorKey: "timestamp",
        cell: (row) => {
            const parts = (row.timestamp || "").split(" ");
            return (
                <span className="text-xs text-slate-400">{parts[1] || "—"}</span>
            );
        },
    },
    {
        header: "Utilisateur",
        accessorKey: "user",
        cell: (row) => (
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">{row.user || "Système"}</span>
                {row.role && row.role !== "—" && (
                    <span className="text-xs text-slate-400">{row.role}</span>
                )}
            </div>
        ),
    },
    {
        header: "Action",
        accessorKey: "action",
        cell: (row) => {
            const cfg = getActionConfig(row.action);
            const Icon = cfg.icon;
            return (
                <div className="flex items-center gap-2">
                    <div className={cn("flex size-8 items-center justify-center rounded-lg", cfg.color)}>
                        <Icon className="size-4" />
                    </div>
                    <Badge variant={row.status === "Échoué" ? "destructive" : "secondary"}>
                        {row.action}
                    </Badge>
                </div>
            );
        },
    },
    {
        header: "Description",
        accessorKey: "description",
        className: "max-w-xs",
    },
    {
        header: "Adresse IP",
        accessorKey: "ip",
        cell: (row) => (
            <span className="font-mono text-xs text-slate-500">{row.ip || "—"}</span>
        ),
    },
];

export default function HistoryTable({ data, isLoading = false }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-white">
            <DataTable
                columns={columns}
                data={data}
                isLoading={isLoading}
                emptyMessage="Aucune activité trouvée"
            />
        </div>
    );
}
