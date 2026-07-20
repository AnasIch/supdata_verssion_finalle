import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function getDashboardBaseFromUrl(url) {
    const match = url.match(/^\/dashboard-(super-admin|admin-local|administrative|commercial|stock)/);
    return match ? match[0] : "/dashboard-super-admin";
}
