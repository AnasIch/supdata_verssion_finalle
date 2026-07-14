import * as React from "react";
import { cn } from "@/lib/utils";

const PageHeader = React.forwardRef(
    ({ className, title, description, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                className
            )}
            {...props}
        >
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
    )
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
