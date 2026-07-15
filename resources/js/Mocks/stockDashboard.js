export const stockUser = { name: "Rachid Amrani", email: "r.amrani@supdata.ma", role: "Responsable Stock", agency: "Casablanca" };
export const stockStats = [
    { id: "products", label: "Produits actifs", value: "1 247", detail: "32 catégories", tone: "blue" },
    { id: "units", label: "Unités disponibles", value: "8 642", detail: "1 184 réservées", tone: "emerald" },
    { id: "low", label: "Stock faible", value: 18, detail: "5 seuils critiques", tone: "amber" },
    { id: "out", label: "Ruptures", value: 5, detail: "3 demandes impactées", tone: "red" },
    { id: "receptions", label: "Réceptions en attente", value: 7, detail: "Arrivées aujourd’hui", tone: "violet" },
    { id: "delivery", label: "Livraisons à confirmer", value: 9, detail: "2 en retard", tone: "cyan" },
];
export const stockHealth = [{ label: "Disponible", value: 78, color: "#10b981" }, { label: "Réservé", value: 13, color: "#2563eb" }, { label: "Stock faible", value: 6, color: "#f59e0b" }, { label: "Rupture", value: 3, color: "#ef4444" }];
export const movementTrend = [{ day: "Lun", entrees: 42, sorties: 31 }, { day: "Mar", entrees: 28, sorties: 38 }, { day: "Mer", entrees: 55, sorties: 34 }, { day: "Jeu", entrees: 36, sorties: 41 }, { day: "Ven", entrees: 64, sorties: 47 }, { day: "Sam", entrees: 22, sorties: 18 }];
export const stockAlerts = [
    { id: "PRD-0412", product: "Dell Latitude 5540", category: "Informatique", agency: "Casablanca", available: 0, reserved: 3, threshold: 5, status: "Rupture", impact: "2 demandes" },
    { id: "PRD-0387", product: "Chaise ergonomique Pro", category: "Mobilier", agency: "Marrakech", available: 4, reserved: 2, threshold: 10, status: "Critique", impact: "1 demande" },
    { id: "PRD-0523", product: "Écran Dell 27 pouces", category: "Informatique", agency: "Casablanca", available: 6, reserved: 4, threshold: 12, status: "Faible", impact: "Aucun" },
    { id: "PRD-0291", product: "Ramette papier A4", category: "Fournitures", agency: "Marrakech", available: 14, reserved: 5, threshold: 40, status: "Critique", impact: "Aucun" },
];
export const pendingReceptions = [
    { id: "REC-2026-0189", supplier: "Tech Distribution Maroc", agency: "Casablanca", items: "45 unités · 3 références", expected: "Aujourd’hui, 14:30", status: "À contrôler" },
    { id: "REC-2026-0187", supplier: "Office Pro", agency: "Marrakech", items: "80 unités · 5 références", expected: "Aujourd’hui, 16:00", status: "En transit" },
    { id: "REC-2026-0184", supplier: "Network Systems", agency: "Casablanca", items: "24 unités · 2 références", expected: "Reçue à 09:15", status: "À valider" },
];
export const inventories = [{ agency: "Casablanca", progress: 72, differences: 4, due: "18 juillet" }, { agency: "Marrakech", progress: 46, differences: 2, due: "21 juillet" }];
export const stockActivity = [
    { id: 1, type: "Entrée", text: "+24 écrans Dell · REC-2026-0184", author: "Rachid Amrani", time: "Il y a 18 min", tone: "success" },
    { id: 2, type: "Sortie", text: "−8 ordinateurs · LIV-2026-0098", author: "Sara Lahlou", time: "Il y a 42 min", tone: "warning" },
    { id: 3, type: "Alerte", text: "Rupture Dell Latitude · 2 commerciaux informés", author: "Système", time: "Il y a 1 h", tone: "danger" },
    { id: 4, type: "Transfert", text: "12 chaises vers Marrakech", author: "Yassine Idrissi", time: "Il y a 2 h", tone: "info" },
];
