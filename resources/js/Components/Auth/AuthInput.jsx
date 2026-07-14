import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const AuthInput = forwardRef(({ className, icon: Icon, ...props }, ref) => {
    return (
        <div className="relative group">
            {Icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors duration-200 group-focus-within:text-blue-500">
                    <Icon className="size-[1.1rem] text-slate-400 group-focus-within:text-blue-500" />
                </div>
            )}
            <input
                ref={ref}
                className={cn(
                    "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[0.935rem] text-slate-900 shadow-[0_1px_2px_rgb(0,0,0,0.04)] outline-none transition-all duration-200 placeholder:text-slate-400/70 hover:border-slate-300 hover:shadow-[0_2px_8px_rgb(0,0,0,0.06)] focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08),0_2px_8px_rgb(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-50",
                    Icon && "pl-11",
                    className
                )}
                {...props}
            />
        </div>
    );
});
AuthInput.displayName = "AuthInput";

export { AuthInput };
