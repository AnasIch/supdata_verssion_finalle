export const stockSectionConfig = {
    produits: { titre: "Produits", description: "Gérez le catalogue et les disponibilités par agence.", action: "Nouveau produit", canCrud: true, idPrefix: "PRD", createStatus: "Disponible" },
    categories: { titre: "Catégories", description: "Organisez les produits par famille.", action: "Nouvelle catégorie", canCrud: true, idPrefix: "CAT", createStatus: "Active" },
    mouvements: { titre: "Mouvements de stock", description: "Tracez les entrées, sorties et transferts.", action: "Nouveau mouvement", canCreate: true, idPrefix: "MVT", createStatus: "Enregistré" },
    receptions: { titre: "Réceptions", description: "Réceptionnez, contrôlez et validez les marchandises arrivées.", action: "Nouvelle réception", canCreate: true, idPrefix: "REC", createStatus: "Marchandise reçue", workflow: "reception" },
    livraisons: { titre: "Livraisons clients", description: "Confirmez la remise des marchandises au client.", action: null, workflow: "livraison" },
    alertes: { titre: "Alertes de stock", description: "Traitez les ruptures et informez les commerciaux concernés.", action: null, workflow: "alerte" },
};
