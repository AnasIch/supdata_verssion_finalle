import * as React from "react";
import { cn } from "@/lib/utils";

const Drawer = ({ shouldScaleBackground = true, children, ...props }) => {
    return <div {...props}>{children}</div>;
};

const DrawerTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        {...props}
    />
));
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerPortal = ({ children }) => {
    return <>{children}</>;
};

const DrawerClose = React.forwardRef(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
            className
        )}
        {...props}
    />
));
DrawerClose.displayName = "DrawerClose";

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-black/80", className)}
        {...props}
    />
));
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <div className="fixed inset-0 z-50">
        <DrawerOverlay />
        <div
            ref={ref}
            className={cn(
                "fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col rounded-t-[10px] border bg-background shadow-lg animate-slide-in-from-bottom",
                className
            )}
            {...props}
        >
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
            {children}
        </div>
    </div>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }) => (
    <div
        className={cn(
            "flex flex-col space-y-2 p-4 text-center sm:text-left",
            className
        )}
        {...props}
    />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }) => (
    <div
        className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        {...props}
    />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DrawerDescription.displayName = "DrawerDescription";

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
};
