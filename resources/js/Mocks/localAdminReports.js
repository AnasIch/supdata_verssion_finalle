export const localAdminReportKpis = [
    {
        id: "total",
        label: "Total demandes",
        value: "156",
        description: "Depuis le début de l'année",
        trend: "+23%",
        trendUp: true,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "validated",
        label: "Demandes validées",
        value: "118",
        description: "75,6% du total",
        trend: "+18%",
        trendUp: true,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "rejected",
        label: "Demandes refusées",
        value: "22",
        description: "14,1% du total",
        trend: "-5%",
        trendUp: false,
        color: "bg-red-50 text-red-600",
    },
    {
        id: "pending",
        label: "En attente",
        value: "16",
        description: "À traiter",
        trend: "+3",
        trendUp: true,
        color: "bg-amber-50 text-amber-600",
    },
    {
        id: "stockValue",
        label: "Valeur du stock",
        value: "1 247 500",
        unit: "MAD",
        description: "Agence Casablanca",
        trend: "+8%",
        trendUp: true,
        color: "bg-violet-50 text-violet-600",
    },
    {
        id: "critical",
        label: "Produits critiques",
        value: "5",
        description: "Sous le seuil minimum",
        trend: "+2",
        trendUp: true,
        color: "bg-orange-50 text-orange-600",
    },
];

export const demandesEvolution = [
    { mois: "Jan", demandes: 10, validees: 8, refusees: 2 },
    { mois: "Fév", demandes: 14, validees: 11, refusees: 3 },
    { mois: "Mar", demandes: 18, validees: 14, refusees: 4 },
    { mois: "Avr", demandes: 15, validees: 12, refusees: 3 },
    { mois: "Mai", demandes: 22, validees: 18, refusees: 4 },
    { mois: "Jun", demandes: 19, validees: 15, refusees: 4 },
    { mois: "Jul", demandes: 26, validees: 22, refusees: 4 },
    { mois: "Aoû", demandes: 24, validees: 20, refusees: 4 },
    { mois: "Sep", demandes: 28, validees: 24, refusees: 4 },
    { mois: "Oct", demandes: 25, validees: 20, refusees: 5 },
    { mois: "Nov", demandes: 30, validees: 26, refusees: 4 },
    { mois: "Déc", demandes: 32, validees: 28, refusees: 4 },
];

export const decisionsBreakdown = [
    { name: "Validées", value: 118, color: "#10b981" },
    { name: "En attente", value: 16, color: "#f59e0b" },
    { name: "Refusées", value: 22, color: "#ef4444" },
];

export const stockByCategory = [
    { name: "Serveurs", count: 12, color: "#3b82f6" },
    { name: "Postes", count: 3, color: "#8b5cf6" },
    { name: "Écrans", count: 0, color: "#06b6d4" },
    { name: "Imprimantes", count: 7, color: "#f59e0b" },
    { name: "Alimentation", count: 2, color: "#ef4444" },
    { name: "Téléphonie", count: 15, color: "#10b981" },
    { name: "Réseau", count: 2, color: "#ec4899" },
    { name: "Périphériques", count: 20, color: "#6366f1" },
    { name: "Câblage", count: 150, color: "#14b8a6" },
    { name: "Audiovisuel", count: 4, color: "#f97316" },
];

export const stockStatusBreakdown = [
    { name: "Disponible", value: 31, color: "#10b981" },
    { name: "Stock bas", value: 7, color: "#f59e0b" },
    { name: "Rupture", value: 3, color: "#ef4444" },
];

export const periodOptions = [
    { value: "today", label: "Aujourd'hui" },
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "year", label: "Cette année" },
    { value: "custom", label: "Période personnalisée" },
];
