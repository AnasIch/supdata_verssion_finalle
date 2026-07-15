export const mockUsers = {
    "Super Admin": {
        id: 1,
        name: "Super Admin",
        email: "admin@supdata.fr",
        role: "Super Admin",
        agency: null,
        permissions: ["*"],
    },

    "Administrateur Local": {
        id: 2,
        name: "Youssef Benali",
        email: "y.benali@supdata.ma",
        role: "Administrateur Local",
        agency: "SUPDATA Casablanca",
        permissions: ["demandes.*", "stock.*", "rapports.read", "notifications.*"],
    },

    "Gestion Administrative": {
        id: 3,
        name: "Fatima Zahra El Mansouri",
        email: "f.elmansouri@supdata.ma",
        role: "Gestion Administrative",
        agency: "SUPDATA Rabat",
        permissions: ["documents.*", "notes-service.*", "contrats.*", "rapports.*", "notifications.*"],
    },

    "Responsable Commercial": {
        id: 4,
        name: "Karim Benjelloun",
        email: "k.benjelloun@supdata.ma",
        role: "Responsable Commercial",
        agency: "SUPDATA Casablanca",
        permissions: ["devis.*", "clients.*", "pipeline.*", "rapports.*", "notifications.*"],
    },

    "Responsable Stock": {
        id: 5,
        name: "Rachid Amrani",
        email: "r.amrani@supdata.ma",
        role: "Responsable Stock",
        agency: "SUPDATA Tanger",
        permissions: ["stock.*", "commandes.*", "rapports.*", "notifications.*"],
    },
};

export default mockUsers;
