import { Bell, RotateCcw } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export default function NotificationsEmpty({ hasFilters, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/50 py-20">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
                <Bell size={32} className="text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-900">
                {hasFilters
                    ? "Aucune notification ne correspond à vos filtres"
                    : "Aucune notification pour le moment"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
                {hasFilters
                    ? "Essayez de modifier ou réinitialiser vos filtres"
                    : "Vous recevrez ici les alertes et notifications de votre agence"}
            </p>
            {hasFilters && (
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={onReset}
                >
                    <RotateCcw size={14} className="mr-1.5" />
                    Réinitialiser les filtres
                </Button>
            )}
        </div>
    );
}
