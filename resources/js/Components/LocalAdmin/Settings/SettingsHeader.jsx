import { Save, RotateCcw } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { cn } from "@/lib/utils";

export default function SettingsHeader({ hasChanges, onSave, onReset, saving }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Centre de configuration</h1>
                <p className="mt-1 text-sm text-slate-500">Gérez les paramètres et la configuration de votre agence.</p>
            </div>
            <div className="flex items-center gap-2">
                {hasChanges && (
                    <span className="mr-2 hidden text-xs font-medium text-amber-600 sm:inline">Modifications non enregistrées</span>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    disabled={!hasChanges}
                    className={cn(!hasChanges && "opacity-40")}
                >
                    <RotateCcw className="size-3.5" />
                    Annuler
                </Button>
                <Button
                    size="sm"
                    onClick={onSave}
                    disabled={!hasChanges || saving}
                    className={cn(!hasChanges && "opacity-40")}
                >
                    <Save className="size-3.5" />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </div>
        </div>
    );
}
