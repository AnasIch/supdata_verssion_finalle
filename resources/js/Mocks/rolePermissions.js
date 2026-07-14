export const permissionModules = [
    {
        module: "Utilisateurs",
        permissions: [
            { key: "Voir les utilisateurs", label: "Voir" },
            { key: "Créer un utilisateur", label: "Créer" },
            { key: "Modifier un utilisateur", label: "Modifier" },
            { key: "Supprimer un utilisateur", label: "Supprimer" },
        ],
    },
    {
        module: "Achats",
        permissions: [
            { key: "Voir les achats", label: "Voir" },
            { key: "Créer un achat", label: "Créer" },
            { key: "Modifier un achat", label: "Modifier" },
            { key: "Supprimer un achat", label: "Supprimer" },
        ],
    },
    {
        module: "Stock",
        permissions: [
            { key: "Voir le stock", label: "Voir" },
            { key: "Modifier le stock", label: "Modifier" },
        ],
    },
    {
        module: "Agences",
        permissions: [
            { key: "Voir les agences", label: "Voir" },
            { key: "Modifier les agences", label: "Modifier" },
        ],
    },
    {
        module: "Rapports",
        permissions: [
            { key: "Voir les rapports", label: "Voir" },
            { key: "Exporter les rapports", label: "Exporter" },
        ],
    },
    {
        module: "Paramètres",
        permissions: [
            { key: "Voir les paramètres", label: "Voir" },
            { key: "Modifier les paramètres", label: "Modifier" },
        ],
    },
    {
        module: "Audit Logs",
        permissions: [
            { key: "Voir les logs d'audit", label: "Voir" },
        ],
    },
];
