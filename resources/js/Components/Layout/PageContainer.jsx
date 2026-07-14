import { cn } from "@/lib/utils";

export default function PageContainer({ children, className = "" }) {
    return (
        <main
            className={cn(
                "flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8",
                className
            )}
        >
            {children}
        </main>
    );
}
