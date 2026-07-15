export const administrativeUser = {
    name: "Fatima Zahra El Mansouri",
    email: "f.elmansouri@supdata.ma",
    role: "Gestion Administrative",
    agency: "SUPDATA Rabat",
};

export const kpiData = [
    {
        id: "documents",
        label: "Documents en attente",
        value: "23",
        description: "À traiter cette semaine",
        trend: "+5",
        trendUp: true,
        color: "bg-amber-50 text-amber-600",
    },
    {
        id: "conformity",
        label: "Taux de conformité",
        value: "94",
        unit: "%",
        description: "Documents conformes",
        trend: "+2%",
        trendUp: true,
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "expenses",
        label: "Dépenses du mois",
        value: "1 245 000",
        unit: "MAD",
        description: "Budget consommé",
        trend: "-8%",
        trendUp: false,
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: "notes",
        label: "Notes de service",
        value: "8",
        description: "En cours d'envoi",
        trend: "+3",
        trendUp: true,
        color: "bg-violet-50 text-violet-600",
    },
    {
        id: "contracts",
        label: "Contrats à renouveler",
        value: "4",
        description: "Avant fin du mois",
        trend: "-1",
        trendUp: false,
        color: "bg-orange-50 text-orange-600",
    },
    {
        id: "validated",
        label: "Validés aujourd'hui",
        value: "15",
        description: "Documents approuvés",
        trend: "+7",
        trendUp: true,
        color: "bg-cyan-50 text-cyan-600",
    },
];

export const documentsEvolutionData = [
    { mois: "Jan", traites: 85, enAttente: 12, refus: 3 },
    { mois: "Fév", traites: 92, enAttente: 15, refus: 5 },
    { mois: "Mar", traites: 78, enAttente: 18, refus: 4 },
    { mois: "Avr", traites: 105, enAttente: 10, refus: 2 },
    { mois: "Mai", traites: 118, enAttente: 8, refus: 6 },
    { mois: "Jun", traites: 95, enAttente: 14, refus: 3 },
    { mois: "Jul", traites: 130, enAttente: 6, refus: 1 },
    { mois: "Aoû", traites: 88, enAttente: 20, refus: 8 },
    { mois: "Sep", traites: 112, enAttente: 9, refus: 4 },
    { mois: "Oct", traites: 105, enAttente: 11, refus: 5 },
    { mois: "Nov", traites: 125, enAttente: 7, refus: 2 },
    { mois: "Déc", traites: 98, enAttente: 16, refus: 6 },
];

export const conformityData = [
    { name: "Conformes", value: 94, color: "#10b981" },
    { name: "En révision", value: 4, color: "#f59e0b" },
    { name: "Non conformes", value: 2, color: "#ef4444" },
];

export const pendingDocuments = [
    {
        id: "DOC-2026-0187",
        type: "Bon de commande",
        agency: "Casablanca",
        montant: "67 500 MAD",
        date: "15/07/2026",
        statut: "En attente",
    },
    {
        id: "DOC-2026-0186",
        type: "Facture fournisseur",
        agency: "Marrakech",
        montant: "23 800 MAD",
        date: "14/07/2026",
        statut: "En attente",
    },
    {
        id: "DOC-2026-0185",
        type: "Contrat client",
        agency: "Fès",
        montant: "145 000 MAD",
        date: "14/07/2026",
        statut: "En attente",
    },
    {
        id: "DOC-2026-0184",
        type: "Note de service",
        agency: "Rabat",
        montant: "—",
        date: "13/07/2026",
        statut: "En attente",
    },
    {
        id: "DOC-2026-0183",
        type: "Bon de livraison",
        agency: "Tanger",
        montant: "34 200 MAD",
        date: "13/07/2026",
        statut: "En attente",
    },
];

export const recentActivities = [
    {
        id: 1,
        type: "document",
        text: "Document validé",
        detail: "DOC-2026-0182 — Facture Approuvée",
        time: "Il y a 20 min",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        id: 2,
        type: "notification",
        text: "Alerte conformité",
        detail: "DOC-2026-0180 — Non conforme — À corriger",
        time: "Il y a 45 min",
        color: "bg-amber-50 text-amber-600",
    },
    {
        id: 3,
        type: "document",
        text: "Nouveau document reçu",
        detail: "DOC-2026-0187 — Bon de commande — Casablanca",
        time: "Il y a 1h",
        color: "bg-blue-50 text-blue-600",
    },
    {
        id: 4,
        type: "validation",
        text: "Validation multiple",
        detail: "3 documents validés d'un coup",
        time: "Il y a 2h",
        color: "bg-cyan-50 text-cyan-600",
    },
    {
        id: 5,
        type: "connexion",
        text: "Connexion au système",
        detail: "Fatima Zahra — IP 192.168.2.22",
        time: "Il y a 3h",
        color: "bg-slate-100 text-slate-600",
    },
];

export const importantNotifications = [
    {
        id: 1,
        type: "warning",
        title: "Contrat à renouveler",
        description: "Contrat GreenTech expire le 31/07/2026 — 245 000 MAD/an",
        time: "Il y a 30 min",
        badge: "Critique",
    },
    {
        id: 2,
        type: "info",
        title: "Nouvelle facture fournisseur",
        description: "DOC-2026-0186 — 23 800 MAD — Marrakech",
        time: "Il y a 1h",
        badge: "Nouveau",
    },
    {
        id: 3,
        type: "success",
        title: "Rapport mensuel généré",
        description: "Rapport financier juin 2026 prêt à télécharger",
        time: "Il y a 2h",
        badge: "Validé",
    },
    {
        id: 4,
        type: "warning",
        title: "Budget dépassé — Agence Fès",
        description: "112% du budget alloué consommé ce mois-ci",
        time: "Il y a 3h",
        badge: "Attention",
    },
    {
        id: 5,
        type: "info",
        title: "Mise à jour réglementaire",
        description: "Nouvelles directives fiscales applicables au 01/08/2026",
        time: "Il y a 5h",
        badge: "Info",
    },
];

export const quickActions = [
    { label: "Documents à traiter", href: "/documents", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
    { label: "Rapports financiers", href: "/rapports", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "Notes de service", href: "/notes-service", color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
    { label: "Contrats", href: "/contrats", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
];
