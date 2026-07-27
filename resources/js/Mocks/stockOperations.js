export const stockOperationsData = {
    produits: [
        { id: "PRD-0412", nom: "Dell Latitude 5540", detail: "Informatique", agence: "Casablanca", quantite: 0, statut: "Rupture" },
        { id: "PRD-0387", nom: "Chaise ergonomique Pro", detail: "Mobilier", agence: "Marrakech", quantite: 4, statut: "Stock faible" },
        { id: "PRD-0523", nom: "Écran Dell 27 pouces", detail: "Informatique", agence: "Casablanca", quantite: 26, statut: "Disponible" },
    ],
    categories: [
        { id: "CAT-001", nom: "Informatique", detail: "42 produits", agence: "Toutes", quantite: 42, statut: "Active" },
        { id: "CAT-002", nom: "Mobilier", detail: "28 produits", agence: "Toutes", quantite: 28, statut: "Active" },
        { id: "CAT-003", nom: "Fournitures", detail: "61 produits", agence: "Toutes", quantite: 61, statut: "Active" },
    ],
    mouvements: [
        { id: "MVT-0214", nom: "Entrée · Dell Latitude 5540", detail: "+45 unités · Tech Distribution", agence: "Casablanca", quantite: 45, statut: "Validé" },
        { id: "MVT-0211", nom: "Sortie · Chaise ergonomique", detail: "−12 unités · Livraison client", agence: "Marrakech", quantite: 12, statut: "Validé" },
        { id: "MVT-0208", nom: "Transfert · Écran Dell", detail: "8 unités vers Marrakech", agence: "Casablanca", quantite: 8, statut: "En transit" },
    ],
    receptions: [
        { id: "REC-0189", nom: "Tech Distribution Maroc", detail: "45 unités · 3 références", agence: "Casablanca", quantite: 45, statut: "À contrôler" },
        { id: "REC-0187", nom: "Office Pro", detail: "80 unités · 5 références", agence: "Marrakech", quantite: 80, statut: "En transit" },
        { id: "REC-0184", nom: "Network Systems", detail: "24 unités · 2 références", agence: "Casablanca", quantite: 24, statut: "À valider" },
    ],
    inventaires: [
        { id: "INV-014", nom: "Inventaire trimestriel", detail: "72 % · 4 écarts", agence: "Casablanca", quantite: 72, statut: "En cours" },
        { id: "INV-013", nom: "Inventaire trimestriel", detail: "46 % · 2 écarts", agence: "Marrakech", quantite: 46, statut: "En cours" },
        { id: "INV-009", nom: "Contrôle ciblé IT", detail: "100 % · aucun écart", agence: "Casablanca", quantite: 100, statut: "Terminé" },
    ],
    livraisons: [
        { id: "LIV-0098", nom: "Atlas Digital", detail: "8 ordinateurs portables", agence: "Casablanca", quantite: 8, statut: "À confirmer" },
        { id: "LIV-0096", nom: "Riad Partners", detail: "12 chaises ergonomiques", agence: "Marrakech", quantite: 12, statut: "En préparation" },
        { id: "LIV-0092", nom: "Nova Conseil", detail: "6 écrans Dell", agence: "Casablanca", quantite: 6, statut: "Confirmée" },
    ],
    alertes: [
        { id: "ALT-0412", nom: "Dell Latitude 5540", detail: "0 disponible · 3 réservés", agence: "Casablanca", quantite: 0, statut: "Rupture" },
        { id: "ALT-0387", nom: "Chaise ergonomique Pro", detail: "4 disponibles · seuil 10", agence: "Marrakech", quantite: 4, statut: "Critique" },
        { id: "ALT-0523", nom: "Écran Dell 27 pouces", detail: "6 disponibles · seuil 12", agence: "Casablanca", quantite: 6, statut: "Stock faible" },
    ],
};

export const stockSectionConfig = {
    produits: { titre: "Produits", description: "Gérez le catalogue et les disponibilités par agence.", action: "Nouveau produit", canCrud: true, idPrefix: "PRD", createStatus: "Disponible" },
    categories: { titre: "Catégories", description: "Organisez les produits par famille.", action: "Nouvelle catégorie", canCrud: true, idPrefix: "CAT", createStatus: "Active" },
    mouvements: { titre: "Mouvements de stock", description: "Tracez les entrées, sorties et transferts.", action: "Nouveau mouvement", canCreate: true, idPrefix: "MVT", createStatus: "Enregistré" },
    receptions: { titre: "Réceptions", description: "Réceptionnez, contrôlez et validez les marchandises arrivées.", action: "Nouvelle réception", canCreate: true, idPrefix: "REC", createStatus: "Marchandise reçue", workflow: "reception" },
    inventaires: { titre: "Inventaires", description: "Suivez les comptages physiques et les écarts.", action: "Nouvel inventaire", canCreate: true, canCrud: true, idPrefix: "INV", createStatus: "En cours" },
    livraisons: { titre: "Livraisons clients", description: "Confirmez la remise des marchandises au client.", action: null, workflow: "livraison" },
    alertes: { titre: "Alertes de stock", description: "Traitez les ruptures et informez les commerciaux concernés.", action: null, workflow: "alerte" },
};
