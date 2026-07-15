import { cn } from "@/lib/utils";
import { Button } from "@/Components/UI/Button";

export default function PeriodFilter({ options, value, onChange }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        value === opt.value
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
