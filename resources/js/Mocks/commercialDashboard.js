export const commercialUser = {
    name: "Karim Benjelloun",
    email: "k.benjelloun@supdata.ma",
    role: "Responsable Commercial",
    agency: "SUPDATA Casablanca",
};

export const kpiData = [
    {
        id: "created",
        label: "Demandes d'achat créées",
        value: "24",
        description: "Ce mois-ci",
        trend: "+6",
        trendUp: true,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "pending",
        label: "Demandes en attente",
        value: "8",
        description: "En cours de traitement",
        trend: "+2",
        trendUp: true,
        color: "bg-amber-50 text-amber-600",
    },
    {
        id: "reserved",
        label: "Produits réservés",
        value: "12",
        description: "Réservations actives",
        trend: "+3",
        trendUp: true,
        color: "bg-violet-50 text-violet-600",
    },
    {
        id: "notifications",
        label: "Notifications non lues",
        value: "3",
        description: "À traiter",
        trend: "-1",
        trendUp: false,
        color: "bg-emerald-50 text-emerald-600",
    },
];

export const demandesEvolutionData = [
    { mois: "Jan", demandes: 18, validees: 14, refusees: 2 },
    { mois: "Fév", demandes: 22, validees: 17, refusees: 3 },
    { mois: "Mar", demandes: 16, validees: 12, refusees: 2 },
    { mois: "Avr", demandes: 28, validees: 22, refusees: 4 },
    { mois: "Mai", demandes: 25, validees: 20, refusees: 3 },
    { mois: "Jun", demandes: 24, validees: 19, refusees: 3 },
];

export const recentActivities = [
    {
        id: 1,
        type: "demande",
        text: "Demande créée",
        detail: "DEM-2026-0084 — Pack Équipements IT — TechnoPro SARL",
        time: "Il y a 15 min",
    },
    {
        id: 2,
        type: "reservation",
        text: "Produit réservé",
        detail: "Écran 27\" Dell — Réf. PRD-0412 — Stock Casablanca",
        time: "Il y a 40 min",
    },
    {
        id: 3,
        type: "validation",
        text: "Demande validée",
        detail: "DEM-2026-0081 — Infrastructure Réseau — Atlas Construction",
        time: "Il y a 1h",
    },
    {
        id: 4,
        type: "refus",
        text: "Demande refusée",
        detail: "DEM-2026-0078 — Mobilier Bureau — Budget dépassé",
        time: "Il y a 2h",
    },
    {
        id: 5,
        type: "demande",
        text: "Demande créée",
        detail: "DEM-2026-0083 — Sécurité Informatique — LogiTrans SA",
        time: "Il y a 3h",
    },
];

export const quickActions = [
    { label: "Nouvelle demande", href: "/demandes/creer", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "Voir mes demandes", href: "/demandes", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
    { label: "Consulter le stock", href: "/stock", color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
    { label: "Voir les notifications", href: "/notifications", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
];
