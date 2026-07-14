import * as React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

const EmptyState = React.forwardRef(
    ({ className, icon, title, description, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-col items-center justify-center py-12 text-center",
                className
            )}
            {...props}
        >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                {icon ? (
                    <div className="text-muted-foreground">{icon}</div>
                ) : (
                    <Inbox className="h-10 w-10 text-muted-foreground" />
                )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            {description && (
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {children && <div className="mt-6">{children}</div>}
        </div>
    )
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
