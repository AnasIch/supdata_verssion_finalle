import { mockUsers } from "@/Data/mockUsers";

const STORAGE_KEY = "supdata_current_user";

const dashboardPaths = {
    "Super Admin": "/dashboard-super-admin",
    "Administrateur Local": "/dashboard-admin-local",
    "Gestion Administrative": "/dashboard-administrative",
    "Responsable Commercial": "/dashboard-commercial",
    "Responsable Stock": "/dashboard-stock",
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
