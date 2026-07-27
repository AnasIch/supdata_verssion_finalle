export const administrativeFinalApprovals = [
    {
        requestId: "DA-2026-0232",
        client: "Atlas Digital",
        commercial: "Nadia El Amrani",
        agency: "Casablanca",
        amount: "92 500 MAD",
        products: "12 ordinateurs portables et accessoires",
        approvedBy: "Youssef Benali",
        approvedAt: "15/07/2026 à 16:22",
        supplierSuggestion: "Tech Distribution Maroc",
        status: "Validation finale reçue",
        orderId: null,
    },
    {
        requestId: "DA-2026-0229",
        client: "Riad Partners",
        commercial: "Mehdi Alaoui",
        agency: "Marrakech",
        amount: "34 600 MAD",
        products: "Mobilier de bureau",
        approvedBy: "Youssef Benali",
        approvedAt: "14/07/2026 à 11:05",
        supplierSuggestion: "Office Pro Maroc",
        status: "Commande créée",
        orderId: "CMD-2026-0175",
    },
    {
        requestId: "DA-2026-0238",
        client: "Maroc Services",
        commercial: "Omar Tazi",
        agency: "Casablanca",
        amount: "31 400 MAD",
        products: "Équipements réseau",
        approvedBy: null,
        approvedAt: null,
        supplierSuggestion: "Network Systems",
        status: "En attente de l’Administrateur Local",
        orderId: null,
    },
];

export const administrativeSupplierOrders = [
    {
        orderId: "CMD-2026-0175",
        requestId: "DA-2026-0229",
        client: "Riad Partners",
        commercial: "Mehdi Alaoui",
        agency: "Marrakech",
        amount: "34 600 MAD",
        supplier: "Office Pro Maroc",
        supplierReference: "OFF-7841",
        expectedDate: "24/07/2026",
        createdAt: "15/07/2026 à 09:18",
        notes: "Livraison directe à l’agence de Marrakech.",
        status: "Créée",
        commercialNotified: true,
    },
];

export const supplierOrderRules = {
    title: "Règle de création",
    description: "Une commande fournisseur peut être créée uniquement après la validation finale de l’Administrateur Local. Le Responsable Commercial est informé automatiquement après la création.",
};
