export const administrativeOperationsData = {
    demandes: [
        { id: "DA-2026-0248", nom: "Atlas Digital", demandeur: "Nadia El Amrani", agence: "Casablanca", montant: "48 900 MAD", produits: "8 ordinateurs portables", date: "16/07/2026 à 09:42", completude: 100, priorite: "Urgente", statut: "À vérifier" },
        { id: "DA-2026-0247", nom: "Riad Partners", demandeur: "Mehdi Alaoui", agence: "Marrakech", montant: "21 750 MAD", produits: "Mobilier de bureau", date: "16/07/2026 à 08:15", completude: 75, priorite: "Haute", statut: "Incomplet" },
        { id: "DA-2026-0244", nom: "Nova Conseil", demandeur: "Salma Bennis", agence: "Casablanca", montant: "73 200 MAD", produits: "Équipements réseau", date: "15/07/2026 à 16:30", completude: 100, priorite: "Normale", statut: "À vérifier" },
    ],
    stock: [
        { id: "PRD-0412", nom: "Dell Latitude 5540", categorie: "Informatique", agence: "Casablanca", disponible: 0, reserve: 3, seuil: 5, emplacement: "Zone A · Rack 04", statut: "Rupture" },
        { id: "PRD-0387", nom: "Chaise ergonomique Pro", categorie: "Mobilier", agence: "Marrakech", disponible: 4, reserve: 2, seuil: 10, emplacement: "Zone B · Allée 02", statut: "Critique" },
        { id: "PRD-0523", nom: "Écran Dell 27 pouces", categorie: "Informatique", agence: "Casablanca", disponible: 26, reserve: 6, seuil: 12, emplacement: "Zone A · Rack 07", statut: "Disponible" },
    ],
    validations: [
        { id: "DA-2026-0238", nom: "Maroc Services", demandeur: "Omar Tazi", agence: "Casablanca", montant: "31 400 MAD", date: "Transmise le 15/07/2026", auteur: "Fatima Zahra", historique: "Vérifiée puis transmise à l’Administrateur Local", statut: "En attente" },
        { id: "DA-2026-0232", nom: "Atlas Digital", demandeur: "Nadia El Amrani", agence: "Casablanca", montant: "92 500 MAD", date: "Validée le 15/07/2026", auteur: "Youssef Benali", historique: "Validation finale reçue · commande fournisseur à créer", statut: "Validation finale" },
        { id: "DA-2026-0229", nom: "Riad Partners", demandeur: "Mehdi Alaoui", agence: "Marrakech", montant: "34 600 MAD", date: "Validée le 14/07/2026", auteur: "Youssef Benali", historique: "Validation finale reçue · Responsable Commercial informé", statut: "Validation finale" },
    ],
};

export const administrativeSectionConfig = {
    demandes: { titre: "Demandes reçues", description: "Vérifiez les demandes transmises par le Responsable Commercial." },
    stock: { titre: "Consultation du stock", description: "Consultez les disponibilités en lecture seule pour vérifier une demande." },
    validations: { titre: "Suivi des validations", description: "Suivez les dossiers transmis à l’Administrateur Local jusqu’à la décision finale." },
};
