import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { priorityOptions } from "@/Mocks/commercialCreateRequest";

export default function PrioritySelector({ value, onChange, error }) {
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Priorité</h3>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex flex-wrap gap-2">
                {priorityOptions.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-150",
                            value === opt.value
                                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-500/20"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                    >
                        <AlertTriangle className={cn("size-3.5", value === opt.value ? "text-blue-600" : "text-slate-400")} />
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
