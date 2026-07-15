export const commercialUser = {
    name: "Karim Benjelloun",
    email: "k.benjelloun@supdata.ma",
    role: "Responsable Commercial",
    agency: "SUPDATA Casablanca",
};

export const kpiData = [
    {
        id: "revenue",
        label: "Chiffre d'affaires",
        value: "2 845 000",
        unit: "MAD",
        description: "Ce mois-ci",
        trend: "+18%",
        trendUp: true,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "clients",
        label: "Nouveaux clients",
        value: "14",
        description: "Acquis ce mois",
        trend: "+6",
        trendUp: true,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "quotes",
        label: "Devis en cours",
        value: "31",
        description: "En attente de réponse",
        trend: "+8",
        trendUp: true,
        color: "bg-amber-50 text-amber-600",
    },
    {
        id: "conversion",
        label: "Taux de conversion",
        value: "67",
        unit: "%",
        description: "Devis → Commandes",
        trend: "+3%",
        trendUp: true,
        color: "bg-violet-50 text-violet-600",
    },
    {
        id: "pipeline",
        label: "Pipeline commercial",
        value: "4 120 000",
        unit: "MAD",
        description: "Valeur totale en cours",
        trend: "+12%",
        trendUp: true,
        color: "bg-cyan-50 text-cyan-600",
    },
    {
        id: "lost",
        label: "Devis refusés",
        value: "5",
        description: "Ce mois-ci",
        trend: "-2",
        trendUp: false,
        color: "bg-red-50 text-red-600",
    },
];

export const revenueEvolutionData = [
    { mois: "Jan", ca: 1850000, objectif: 2000000 },
    { mois: "Fév", ca: 2100000, objectif: 2100000 },
    { mois: "Mar", ca: 1950000, objectif: 2200000 },
    { mois: "Avr", ca: 2400000, objectif: 2300000 },
    { mois: "Mai", ca: 2650000, objectif: 2400000 },
    { mois: "Jun", ca: 2300000, objectif: 2500000 },
    { mois: "Jul", ca: 2845000, objectif: 2600000 },
    { mois: "Aoû", ca: 2200000, objectif: 2600000 },
    { mois: "Sep", ca: 2700000, objectif: 2700000 },
    { mois: "Oct", ca: 2550000, objectif: 2700000 },
    { mois: "Nov", ca: 2900000, objectif: 2800000 },
    { mois: "Déc", ca: 3100000, objectif: 2800000 },
];

export const performanceData = [
    { name: "ATTEINT", value: 67, color: "#10b981" },
    { name: "EN COURS", value: 24, color: "#3b82f6" },
    { name: "NON ATTEINT", value: 9, color: "#ef4444" },
];

export const pendingQuotes = [
    {
        id: "DEV-2026-0098",
        client: "TechnoPro SARL",
        montant: "185 000 MAD",
        produit: "Pack Équipements IT",
        date: "15/07/2026",
        statut: "En attente",
    },
    {
        id: "DEV-2026-0097",
        client: "Atlas Construction",
        montant: "320 000 MAD",
        produit: "Infrastructure Réseau",
        date: "14/07/2026",
        statut: "En attente",
    },
    {
        id: "DEV-2026-0096",
        client: "MédiaVision",
        montant: "78 500 MAD",
        produit: "Écrans & Vidéoprojecteurs",
        date: "14/07/2026",
        statut: "En attente",
    },
    {
        id: "DEV-2026-0095",
        client: "LogiTrans SA",
        montant: "45 200 MAD",
        produit: "Matériel de Bureau",
        date: "13/07/2026",
        statut: "En attente",
    },
    {
        id: "DEV-2026-0094",
        client: "AgroPlus",
        montant: "92 000 MAD",
        produit: "Sécurité Informatique",
        date: "13/07/2026",
        statut: "En attente",
    },
];

export const recentActivities = [
    {
        id: 1,
        type: "deal",
        text: "Nouveau devis envoyé",
        detail: "DEV-2026-0098 — TechnoPro SARL — 185 000 MAD",
        time: "Il y a 15 min",
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: 2,
        type: "conversion",
        text: "Devis converti en commande",
        detail: "DEV-2026-0090 — MarocTech — 245 000 MAD",
        time: "Il y a 40 min",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: 3,
        type: "client",
        text: "Nouveau client ajouté",
        detail: "Atlas Construction — Contact : Ahmed Rami",
        time: "Il y a 1h",
        color: "bg-violet-50 text-violet-600",
    },
    {
        id: 4,
        type: "refused",
        text: "Devis refusé",
        detail: "DEV-2026-0088 — BioFarm — Hors budget",
        time: "Il y a 2h",
        color: "bg-red-50 text-red-600",
    },
    {
        id: 5,
        type: "followup",
        text: "Relance automatique",
        detail: "3 devis sans réponse depuis 7 jours",
        time: "Il y a 3h",
        color: "bg-amber-50 text-amber-600",
    },
];

export const importantNotifications = [
    {
        id: 1,
        type: "info",
        title: "Devis à suivre",
        description: "DEV-2026-0098 — TechnoPro — Pas de réponse depuis 3 jours",
        time: "Il y a 20 min",
        badge: "Nouveau",
    },
    {
        id: 2,
        type: "success",
        title: "Objectif mensuel atteint",
        description: "CA : 2 845 000 MAD — Objectif : 2 600 000 MAD",
        time: "Il y a 1h",
        badge: "Validé",
    },
    {
        id: 3,
        type: "warning",
        title: "Devis expirant",
        description: "DEV-2026-0095 — LogiTrans — expire dans 2 jours",
        time: "Il y a 2h",
        badge: "Critique",
    },
    {
        id: 4,
        type: "info",
        title: "Nouveau lead",
        description: "Inscription site web — SmartLogistics SARL",
        time: "Il y a 4h",
        badge: "Nouveau",
    },
    {
        id: 5,
        type: "success",
        title: "Commande confirmée",
        description: "CMD-2026-0156 — Atlas Construction — 320 000 MAD",
        time: "Il y a 5h",
        badge: "Validé",
    },
];

export const quickActions = [
    { label: "Nouveau devis", href: "/devis/creer", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "Liste des clients", href: "/clients", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
    { label: "Rapports commerciaux", href: "/rapports", color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
    { label: "Pipeline", href: "/pipeline", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
];
