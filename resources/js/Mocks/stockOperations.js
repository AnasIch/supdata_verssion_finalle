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
    livraisons: { titre: "Livraisons clients", description: "Confirmez la remise des marchandises au client.", action: null, workflow: "livraison" },
    alertes: { titre: "Alertes de stock", description: "Traitez les ruptures et informez les commerciaux concernés.", action: null, workflow: "alerte" },
};
