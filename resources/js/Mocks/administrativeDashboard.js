export const administrativeUser = {
    name: "Fatima Zahra El Mansouri",
    email: "f.elmansouri@supdata.ma",
    role: "Gestion Administrative",
    agency: "Toutes les agences",
};

export const administrativeStats = [
    { id: "review", label: "À vérifier", value: 12, detail: "4 demandes urgentes", tone: "amber" },
    { id: "approval", label: "Validation finale", value: 7, detail: "Chez l’administrateur local", tone: "blue" },
    { id: "orders", label: "Commandes à créer", value: 5, detail: "186 400 MAD engagés", tone: "violet" },
    { id: "processed", label: "Traitées ce mois", value: 84, detail: "+12 % par rapport à juin", tone: "emerald" },
    { id: "rejected", label: "Rejetées", value: 6, detail: "7,1 % des demandes", tone: "red" },
    { id: "delay", label: "Délai moyen", value: "1,8 j", detail: "Objectif : moins de 2 jours", tone: "cyan" },
];

export const administrativeRequests = [
    { id: "DA-2026-0248", requester: "Nadia El Amrani", client: "Atlas Digital", agency: "Casablanca", amount: "48 900 MAD", submitted: "Aujourd’hui, 09:42", priority: "Urgente", completeness: 100, status: "À vérifier", products: "8 ordinateurs portables" },
    { id: "DA-2026-0247", requester: "Mehdi Alaoui", client: "Riad Partners", agency: "Marrakech", amount: "21 750 MAD", submitted: "Aujourd’hui, 08:15", priority: "Haute", completeness: 75, status: "Informations manquantes", products: "Mobilier de bureau" },
    { id: "DA-2026-0244", requester: "Salma Bennis", client: "Nova Conseil", agency: "Casablanca", amount: "73 200 MAD", submitted: "Hier, 16:30", priority: "Normale", completeness: 100, status: "À vérifier", products: "Équipements réseau" },
    { id: "DA-2026-0241", requester: "Omar Tazi", client: "Palm Hospitality", agency: "Marrakech", amount: "16 800 MAD", submitted: "Hier, 11:05", priority: "Normale", completeness: 100, status: "À vérifier", products: "Fournitures diverses" },
];

export const administrativeFlow = [
    { label: "Reçues", value: 96, color: "#2563eb" },
    { label: "Validées", value: 84, color: "#10b981" },
    { label: "En attente", value: 12, color: "#f59e0b" },
    { label: "Rejetées", value: 6, color: "#ef4444" },
];

export const administrativeTrend = [
    { week: "S1", recues: 18, traitees: 15 }, { week: "S2", recues: 24, traitees: 21 },
    { week: "S3", recues: 20, traitees: 22 }, { week: "S4", recues: 27, traitees: 26 },
    { week: "S5", recues: 19, traitees: 18 }, { week: "S6", recues: 25, traitees: 23 },
];

export const supplierOrders = [
    { id: "DA-2026-0232", supplier: "Tech Distribution Maroc", agency: "Casablanca", amount: "92 500 MAD", approved: "15 juil. 2026", status: "À créer" },
    { id: "DA-2026-0229", supplier: "Office Pro", agency: "Marrakech", amount: "34 600 MAD", approved: "14 juil. 2026", status: "À créer" },
    { id: "DA-2026-0225", supplier: "Network Systems", agency: "Casablanca", amount: "59 300 MAD", approved: "14 juil. 2026", status: "Brouillon" },
];

export const administrativeNotifications = [
    { id: 1, title: "Validation finale reçue", text: "La demande DA-2026-0232 peut être transformée en commande.", time: "Il y a 12 min", tone: "success" },
    { id: 2, title: "Dossier incomplet", text: "Une pièce justificative manque sur la demande DA-2026-0247.", time: "Il y a 38 min", tone: "warning" },
    { id: 3, title: "Échéance proche", text: "La demande DA-2026-0244 doit être traitée avant 16 h.", time: "Il y a 1 h", tone: "danger" },
];
