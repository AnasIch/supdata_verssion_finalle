export const commercialReportKpis = [
    {
        id: "totalDemandes",
        label: "Total demandes d'achat",
        value: "87",
        description: "Ce trimestre",
        trend: "+12%",
        trendUp: true,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "validated",
        label: "Demandes validées",
        value: "64",
        description: "73,6% du total",
        trend: "+9%",
        trendUp: true,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "totalReservations",
        label: "Réservations",
        value: "31",
        description: "Produits réservés ce trimestre",
        trend: "+5",
        trendUp: true,
        color: "bg-violet-50 text-violet-600",
    },
    {
        id: "pending",
        label: "En attente",
        value: "14",
        description: "À traiter",
        trend: "+3",
        trendUp: true,
        color: "bg-amber-50 text-amber-600",
    },
    {
        id: "rejected",
        label: "Refusées",
        value: "9",
        description: "10,3% du total",
        trend: "-2",
        trendUp: false,
        color: "bg-red-50 text-red-600",
    },
    {
        id: "avgProcessing",
        label: "Délai moyen",
        value: "2,4",
        unit: "jours",
        description: "Traitement des demandes",
        trend: "-0,3j",
        trendUp: false,
        color: "bg-cyan-50 text-cyan-600",
    },
];

export const demandesEvolution = [
    { mois: "Jan", demandes: 12, validees: 9, refusees: 1 },
    { mois: "Fév", demandes: 15, validees: 11, refusees: 2 },
    { mois: "Mar", demandes: 18, validees: 14, refusees: 2 },
    { mois: "Avr", demandes: 22, validees: 17, refusees: 3 },
    { mois: "Mai", demandes: 19, validees: 15, refusees: 2 },
    { mois: "Jun", demandes: 16, validees: 12, refusees: 2 },
];

export const reservationsByMonth = [
    { mois: "Jan", reservations: 5, confirmées: 4 },
    { mois: "Fév", reservations: 7, confirmées: 5 },
    { mois: "Mar", reservations: 4, confirmées: 3 },
    { mois: "Avr", reservations: 6, confirmées: 5 },
    { mois: "Mai", reservations: 5, confirmées: 4 },
    { mois: "Jun", reservations: 4, confirmées: 3 },
];

export const demandesByAgency = [
    { name: "Casablanca", value: 32, color: "#3b82f6" },
    { name: "Rabat", value: 21, color: "#8b5cf6" },
    { name: "Tanger", value: 14, color: "#06b6d4" },
    { name: "Marrakech", value: 11, color: "#f59e0b" },
    { name: "Fès", value: 9, color: "#10b981" },
];

export const topProducts = [
    { name: "Écran 27\" Dell", count: 18, color: "#3b82f6" },
    { name: "Clavier sans fil", count: 15, color: "#8b5cf6" },
    { name: "Souris ergonomique", count: 13, color: "#06b6d4" },
    { name: "Casque Jabra 550", count: 11, color: "#f59e0b" },
    { name: "Hub USB-C 7 ports", count: 9, color: "#10b981" },
    { name: "Câble Ethernet 3m", count: 8, color: "#ec4899" },
];

export const recentCommercialActivities = [
    {
        id: 1,
        type: "demande",
        text: "Demande créée",
        detail: "DEM-2026-0112 — Pack Équipements IT — TechnoPro SARL",
        time: "Il y a 20 min",
    },
    {
        id: 2,
        type: "reservation",
        text: "Réservation confirmée",
        detail: "Écran 27\" Dell — Réf. PRD-0412 — Stock Casablanca",
        time: "Il y a 1h",
    },
    {
        id: 3,
        type: "validation",
        text: "Demande validée",
        detail: "DEM-2026-0108 — Infrastructure Réseau — Atlas Construction",
        time: "Il y a 2h",
    },
    {
        id: 4,
        type: "demande",
        text: "Demande créée",
        detail: "DEM-2026-0111 — Sécurité Informatique — LogiTrans SA",
        time: "Il y a 3h",
    },
    {
        id: 5,
        type: "refus",
        text: "Demande refusée",
        detail: "DEM-2026-0105 — Mobilier Bureau — Budget dépassé",
        time: "Il y a 5h",
    },
    {
        id: 6,
        type: "reservation",
        text: "Réservation expirée",
        detail: "Casque Jabra 550 — Réf. PRD-0298 — Non récupéré",
        time: "Il y a 8h",
    },
];

export const periodOptions = [
    { value: "month", label: "Ce mois" },
    { value: "quarter", label: "Ce trimestre" },
    { value: "year", label: "Cette année" },
    { value: "custom", label: "Période personnalisée" },
];
