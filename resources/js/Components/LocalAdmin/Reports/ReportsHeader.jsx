import { RefreshCw } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export default function ReportsHeader({ isRefreshing, onRefresh }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Rapports de l'agence
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Données de l'agence Casablanca — Vue d'ensemble et statistiques
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
            >
                <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Actualiser
            </Button>
        </div>
    );
}
