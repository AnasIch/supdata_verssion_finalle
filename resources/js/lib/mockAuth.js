import { mockUsers } from "@/Data/mockUsers";

const STORAGE_KEY = "supdata_current_user";

const dashboardPaths = {
    "Super Admin": "/dashboard-super-admin",
    "super_admin": "/dashboard-super-admin",
    "Administrateur Local": "/dashboard-admin-local",
    "admin_local": "/dashboard-admin-local",
    "Gestion Administrative": "/dashboard-administrative",
    "gestion_administrative": "/dashboard-administrative",
    "Responsable Commercial": "/dashboard-commercial",
    "responsable_commercial": "/dashboard-commercial",
    "Responsable Stock": "/dashboard-stock",
    "responsable_stock": "/dashboard-stock",
};

export function setCurrentUser(user) {
    if (!user) return;
    const slim = { name: user.name, email: user.email, role: user.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
}

export function getCurrentUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        // ignore
    }
    return mockUsers["Super Admin"];
}

export function getDashboardPath(role) {
    return dashboardPaths[role] || "/dashboard-super-admin";
}
