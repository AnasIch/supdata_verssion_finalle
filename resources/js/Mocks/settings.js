export const generalSettings = {
    platformName: "SUPDATA ERP",
    description: "Système de gestion intégré pour les opérations SUPDATA",
    language: "fr",
};

export const securitySettings = {
    sessionDuration: 480,
    minPasswordLength: 12,
    requireSpecialChars: true,
    requireUppercase: true,
    twoFactorAuth: false,
    maxLoginAttempts: 5,
    autoLogout: true,
};

export const appearanceSettings = {
    theme: "light",
};

export const languages = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
];

export const sessionDurations = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 heure" },
    { value: 120, label: "2 heures" },
    { value: 240, label: "4 heures" },
    { value: 480, label: "8 heures" },
    { value: 1440, label: "24 heures" },
];

export const themeOptions = [
    { value: "light", label: "Clair" },
    { value: "dark", label: "Sombre" },
    { value: "system", label: "Système" },
];
