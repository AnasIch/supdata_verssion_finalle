import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const PasswordInput = forwardRef(({ className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors duration-200 group-focus-within:text-blue-500">
                <Lock className="size-[1.1rem] text-slate-400 group-focus-within:text-blue-500" />
            </div>
            <input
                ref={ref}
                type={show ? "text" : "password"}
                className={cn(
                    "flex h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-[0.935rem] text-slate-900 shadow-[0_1px_2px_rgb(0,0,0,0.04)] outline-none transition-all duration-200 placeholder:text-slate-400/70 hover:border-slate-300 hover:shadow-[0_2px_8px_rgb(0,0,0,0.06)] focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08),0_2px_8px_rgb(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors duration-150 hover:text-slate-600 focus-visible:outline-none"
                tabIndex={-1}
            >
                {show ? (
                    <EyeOff className="size-[1.1rem]" />
                ) : (
                    <Eye className="size-[1.1rem]" />
                )}
                <span className="sr-only">
                    {show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                </span>
            </button>
        </div>
    );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
