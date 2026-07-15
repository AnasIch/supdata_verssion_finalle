export const stockMovements = {
    // ── Serveur Dell PowerEdge R750 ──────────────────────────
    "STK-001": [
        { id: 1, date: "15 jul. 2026", time: "09:15", author: "Mohammed Tazi", type: "entree", quantity: 5, description: "Réception commande Dell — 5 serveurs PowerEdge R750" },
        { id: 2, date: "10 jul. 2026", time: "14:30", author: "Rachid Mouline", type: "sortie", quantity: 2, description: "Installation datacenter Casablanca Sud" },
        { id: 3, date: "5 jul. 2026", time: "11:00", author: "Sara Filali", type: "transfert", quantity: 1, description: "Transfert vers agence Marrakech" },
        { id: 4, date: "1 jul. 2026", time: "08:45", author: "Amina Berrada", type: "inventaire", quantity: 0, description: "Inventaire trimestriel — stock vérifié" },
    ],
    "STK-001-R": [
        { id: 1, date: "14 jul. 2026", time: "10:00", author: "Youssef Benali", type: "entree", quantity: 3, description: "Réception serveurs Dell — agence Rabat" },
        { id: 2, date: "8 jul. 2026", time: "14:00", author: "Amina Berrada", type: "sortie", quantity: 1, description: "Installation datacenter Rabat" },
    ],
    "STK-001-T": [
        { id: 1, date: "10 jul. 2026", time: "09:30", author: "Rachid Mouline", type: "entree", quantity: 3, description: "Réception serveurs Dell — agence Tanger" },
        { id: 2, date: "5 jul. 2026", time: "11:00", author: "Sara Filali", type: "sortie", quantity: 1, description: "Déploiement infrastructure Tanger" },
    ],

    // ── Ordinateur Dell OptiPlex 7090 ────────────────────────
    "STK-002": [
        { id: 1, date: "14 jul. 2026", time: "10:00", author: "Mohammed Tazi", type: "sortie", quantity: 4, description: "Installation nouveaux postes — Bureau Sud" },
        { id: 2, date: "8 jul. 2026", time: "16:20", author: "Rachid Mouline", type: "entree", quantity: 10, description: "Réception commande Dell — 10 OptiPlex 7090" },
        { id: 3, date: "1 jul. 2026", time: "09:00", author: "Amina Berrada", type: "inventaire", quantity: 0, description: "Inventaire trimestriel — stock vérifié" },
    ],
    "STK-002-R": [
        { id: 1, date: "13 jul. 2026", time: "11:30", author: "Youssef Benali", type: "entree", quantity: 8, description: "Réception OptiPlex 7090 — agence Rabat" },
        { id: 2, date: "7 jul. 2026", time: "14:00", author: "Amina Berrada", type: "sortie", quantity: 2, description: "Installation postes — Bureau direction" },
    ],
    "STK-002-T": [
        { id: 1, date: "12 jul. 2026", time: "10:15", author: "Rachid Mouline", type: "entree", quantity: 6, description: "Réception OptiPlex 7090 — agence Tanger" },
        { id: 2, date: "6 jul. 2026", time: "09:00", author: "Sara Filali", type: "sortie", quantity: 1, description: "Poste de travail — Service commercial" },
    ],
    "STK-002-M": [
        { id: 1, date: "11 jul. 2026", time: "15:00", author: "Mohammed Tazi", type: "entree", quantity: 2, description: "Réception OptiPlex 7090 — agence Marrakech" },
    ],

    // ── Écran LG 27" 4K ─────────────────────────────────────
    "STK-003": [
        { id: 1, date: "13 jul. 2026", time: "15:45", author: "Sara Filali", type: "sortie", quantity: 3, description: "Installation salles de réunion" },
        { id: 2, date: "6 jul. 2026", time: "11:30", author: "Mohammed Tazi", type: "entree", quantity: 3, description: "Réception écrans LG 27\" — commande validée" },
    ],
    "STK-003-M": [
        { id: 1, date: "10 jul. 2026", time: "14:00", author: "Rachid Mouline", type: "entree", quantity: 6, description: "Réception écrans LG — agence Marrakech" },
        { id: 2, date: "4 jul. 2026", time: "10:30", author: "Sara Filali", type: "sortie", quantity: 2, description: "Installation salles réunion Marrakech" },
    ],
    "STK-003-R": [
        { id: 1, date: "8 jul. 2026", time: "09:00", author: "Youssef Benali", type: "entree", quantity: 1, description: "Réception écran LG — stock Rabat" },
    ],

    // ── Imprimante Canon IR-2530 ─────────────────────────────
    "STK-004": [
        { id: 1, date: "12 jul. 2026", time: "13:15", author: "Rachid Mouline", type: "sortie", quantity: 1, description: "Remplacement imprimante comptabilité" },
        { id: 2, date: "5 jul. 2026", time: "10:00", author: "Amina Berrada", type: "entree", quantity: 3, description: "Réception imprimantes Canon" },
    ],
    "STK-004-R": [
        { id: 1, date: "9 jul. 2026", time: "11:00", author: "Youssef Benali", type: "entree", quantity: 3, description: "Réception imprimantes Canon — Rabat" },
    ],

    // ── Onduleur APC Smart-UPS 3000VA ────────────────────────
    "STK-005": [
        { id: 1, date: "11 jul. 2026", time: "14:00", author: "Mohammed Tazi", type: "sortie", quantity: 2, description: "Installation datacenter — protection serveurs" },
        { id: 2, date: "4 jul. 2026", time: "09:30", author: "Rachid Mouline", type: "entree", quantity: 4, description: "Réception onduleurs APC" },
    ],
    "STK-005-T": [
        { id: 1, date: "8 jul. 2026", time: "10:00", author: "Rachid Mouline", type: "entree", quantity: 4, description: "Réception onduleurs APC — Tanger" },
    ],

    // ── Téléphone Yealink T54W ───────────────────────────────
    "STK-006": [
        { id: 1, date: "10 jul. 2026", time: "11:45", author: "Sara Filali", type: "entree", quantity: 15, description: "Réception téléphones Yealink" },
    ],
    "STK-006-F": [
        { id: 1, date: "7 jul. 2026", time: "14:30", author: "Amina Berrada", type: "entree", quantity: 10, description: "Réception téléphones Yealink — Fès" },
    ],

    // ── Switch Cisco Catalyst 9200 ───────────────────────────
    "STK-007": [
        { id: 1, date: "9 jul. 2026", time: "16:00", author: "Mohammed Tazi", type: "sortie", quantity: 2, description: "Installation réseau Bâtiment B" },
        { id: 2, date: "3 jul. 2026", time: "10:15", author: "Rachid Mouline", type: "entree", quantity: 3, description: "Réception switches Cisco" },
    ],
    "STK-007-T": [
        { id: 1, date: "6 jul. 2026", time: "09:00", author: "Rachid Mouline", type: "entree", quantity: 3, description: "Réception switches Cisco — Tanger" },
    ],
    "STK-007-R": [
        { id: 1, date: "5 jul. 2026", time: "11:30", author: "Youssef Benali", type: "entree", quantity: 2, description: "Réception switches Cisco — Rabat" },
    ],

    // ── Clavier Logitech MX Keys ─────────────────────────────
    "STK-008": [
        { id: 1, date: "8 jul. 2026", time: "14:30", author: "Amina Berrada", type: "entree", quantity: 20, description: "Réception claviers Logitech MX Keys" },
    ],
    "STK-008-R": [
        { id: 1, date: "6 jul. 2026", time: "10:00", author: "Youssef Benali", type: "entree", quantity: 15, description: "Réception claviers Logitech — Rabat" },
    ],
    "STK-008-M": [
        { id: 1, date: "4 jul. 2026", time: "14:00", author: "Mohammed Tazi", type: "entree", quantity: 10, description: "Réception claviers Logitech — Marrakech" },
    ],

    // ── Souris Logitech MX Master 3S ─────────────────────────
    "STK-009": [
        { id: 1, date: "7 jul. 2026", time: "09:00", author: "Sara Filali", type: "sortie", quantity: 8, description: "Distribution postes de travail" },
        { id: 2, date: "1 jul. 2026", time: "11:00", author: "Rachid Mouline", type: "entree", quantity: 8, description: "Réception souris Logitech MX Master" },
    ],
    "STK-009-M": [
        { id: 1, date: "5 jul. 2026", time: "10:30", author: "Rachid Mouline", type: "entree", quantity: 8, description: "Réception souris Logitech — Marrakech" },
    ],

    // ── Câble RJ45 Cat6 ─────────────────────────────────────
    "STK-010": [
        { id: 1, date: "6 jul. 2026", time: "15:30", author: "Rachid Mouline", type: "entree", quantity: 200, description: "Réception câbles RJ45 Cat6" },
        { id: 2, date: "3 jul. 2026", time: "13:00", author: "Mohammed Tazi", type: "sortie", quantity: 50, description: "Câblage réseau Bâtiment B" },
    ],
    "STK-010-T": [
        { id: 1, date: "4 jul. 2026", time: "09:00", author: "Rachid Mouline", type: "entree", quantity: 200, description: "Réception câbles RJ45 — Tanger" },
    ],
    "STK-010-R": [
        { id: 1, date: "2 jul. 2026", time: "14:00", author: "Youssef Benali", type: "entree", quantity: 80, description: "Réception câbles RJ45 — Rabat" },
    ],

    // ── Onduleur Eaton 5P 1500VA ─────────────────────────────
    "STK-011": [
        { id: 1, date: "5 jul. 2026", time: "10:30", author: "Sara Filali", type: "sortie", quantity: 2, description: "Installation salles serveurs" },
    ],
    "STK-011-T": [
        { id: 1, date: "3 jul. 2026", time: "11:00", author: "Rachid Mouline", type: "entree", quantity: 5, description: "Réception onduleurs Eaton — Tanger" },
    ],
    "STK-011-F": [
        { id: 1, date: "1 jul. 2026", time: "09:00", author: "Amina Berrada", type: "entree", quantity: 2, description: "Réception onduleurs Eaton — Fès" },
    ],

    // ── Projecteur Epson EB-X51 ──────────────────────────────
    "STK-012": [
        { id: 1, date: "4 jul. 2026", time: "14:00", author: "Amina Berrada", type: "entree", quantity: 4, description: "Réception projecteurs Epson" },
    ],
    "STK-012-R": [
        { id: 1, date: "2 jul. 2026", time: "10:00", author: "Youssef Benali", type: "entree", quantity: 2, description: "Réception projecteur Epson — Rabat" },
    ],

    // ── Pare-feu Fortinet FortiGate 60F ──────────────────────
    "STK-013": [
        { id: 1, date: "3 jul. 2026", time: "09:45", author: "Mohammed Tazi", type: "sortie", quantity: 1, description: "Installation salle réseau" },
        { id: 2, date: "28 jun. 2026", time: "11:00", author: "Rachid Mouline", type: "entree", quantity: 2, description: "Réception pare-feu Fortinet" },
    ],
    "STK-013-T": [
        { id: 1, date: "1 jul. 2026", time: "14:00", author: "Rachid Mouline", type: "entree", quantity: 2, description: "Réception pare-feu Fortinet — Tanger" },
    ],
    "STK-013-F": [
        { id: 1, date: "29 jun. 2026", time: "10:30", author: "Amina Berrada", type: "entree", quantity: 1, description: "Réception pare-feu Fortinet — Fès" },
    ],

    // ── SSD Samsung 990 Pro 1To ──────────────────────────────
    "STK-014": [
        { id: 1, date: "2 jul. 2026", time: "16:00", author: "Rachid Mouline", type: "entree", quantity: 10, description: "Réception SSD Samsung 990 Pro" },
        { id: 2, date: "28 jun. 2026", time: "14:15", author: "Mohammed Tazi", type: "sortie", quantity: 2, description: "Mise à niveau serveurs" },
    ],
    "STK-014-T": [
        { id: 1, date: "30 jun. 2026", time: "09:00", author: "Rachid Mouline", type: "entree", quantity: 12, description: "Réception SSD Samsung — Tanger" },
    ],
    "STK-014-F": [
        { id: 1, date: "28 jun. 2026", time: "11:30", author: "Amina Berrada", type: "entree", quantity: 4, description: "Réception SSD Samsung — Fès" },
    ],

    // ── Tablette Samsung Galaxy Tab A9 ────────────────────────
    "STK-015": [
        { id: 1, date: "1 jul. 2026", time: "10:00", author: "Sara Filali", type: "entree", quantity: 6, description: "Réception tablettes Samsung" },
    ],
    "STK-015-R": [
        { id: 1, date: "29 jun. 2026", time: "14:00", author: "Youssef Benali", type: "entree", quantity: 4, description: "Réception tablettes Samsung — Rabat" },
    ],
    "STK-015-M": [
        { id: 1, date: "27 jun. 2026", time: "09:30", author: "Mohammed Tazi", type: "entree", quantity: 3, description: "Réception tablettes Samsung — Marrakech" },
    ],
};
