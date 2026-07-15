const defaultStats = {
    totalLogins: 347,
    lastLogin: "14/07/2026 09:45",
    avgSessionDuration: "42 min",
    lastActivity: "Il y a 12 min",
};

const profileMeta = {
    createdAt: "15/01/2024",
    phone: "+212 6 12 34 56 78",
};

export function getProfileData(user) {
    const name = user?.name || "Utilisateur";
    const parts = name.split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    const initials = parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);

    return {
        id: user?.id || 1,
        firstName,
        lastName,
        name,
        email: user?.email || "user@supdata.ma",
        phone: profileMeta.phone,
        role: user?.role || "Super Admin",
        agency: user?.agency || "SUPDATA Casablanca",
        agencyId: user?.id || 1,
        createdAt: profileMeta.createdAt,
        lastLogin: defaultStats.lastLogin,
        lastActivity: defaultStats.lastActivity,
        avatar: null,
        initials,
        stats: { ...defaultStats },
    };
}

export const profileData = getProfileData({
    name: "Super Admin",
    email: "admin@supdata.fr",
    role: "Super Admin",
    agency: "SUPDATA Casablanca",
});
