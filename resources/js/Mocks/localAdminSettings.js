export function getLocalAdminSettingsData() {
    return {
        requests: {
            mandatoryValidation: true,
            allowDrafts: true,
            editBeforeValidation: true,
            maxProducts: 50,
            expiryDays: 7,
        },
        stock: {
            criticalThreshold: 5,
            autoAlerts: true,
            mandatoryExitValidation: true,
            allowManualMovements: false,
            inventoryFrequency: "monthly",
        },
        notifications: {
            nouvelleDemande: true,
            validation: true,
            refus: true,
            stockCritique: true,
            nouvelArrivage: true,
            emailNotifications: true,
            internalNotifications: true,
        },
        security: {
            mfaEnabled: false,
            sessions: [
                { id: 1, device: "Chrome / Windows 11", ip: "192.168.1.45", lastActive: "15/07/2026 09:15", current: true },
                { id: 2, device: "Safari / macOS", ip: "10.0.0.12", lastActive: "14/07/2026 17:30", current: false },
            ],
        },
        auditLog: [
            { id: 1, user: "Youssef Benali", action: "Activation de la validation obligatoire des sorties", date: "15/07/2026 09:00" },
            { id: 2, user: "Youssef Benali", action: "Modification du seuil critique à 5 unités", date: "14/07/2026 16:30" },
            { id: 3, user: "Amina Tazi", action: "Activation des alertes automatiques de stock", date: "14/07/2026 11:20" },
            { id: 4, user: "Youssef Benali", action: "Modification du délai d'expiration à 7 jours", date: "13/07/2026 14:45" },
            { id: 5, user: "Karim Idrissi", action: "Changement de la fréquence d'inventaire", date: "12/07/2026 10:10" },
            { id: 6, user: "Youssef Benali", action: "Désactivation des notifications email", date: "11/07/2026 15:00" },
        ],
    };
}

export const inventoryFrequencyOptions = [
    { value: "weekly", label: "Hebdomadaire" },
    { value: "monthly", label: "Mensuel" },
    { value: "quarterly", label: "Trimestriel" },
];
