export const stockProducts = [
    // ── Serveur Dell PowerEdge R750 ──────────────────────────
    { id: "STK-001", reference: "REF-SRV-001", name: "Serveur Dell PowerEdge R750", category: "Serveurs", agency: "Casablanca", quantity: 12, minThreshold: 5, status: "available", location: "Datacenter — Rack A3", updatedAt: "15 jul. 2026", unitPrice: "45 000" },
    { id: "STK-001-R", reference: "REF-SRV-001", name: "Serveur Dell PowerEdge R750", category: "Serveurs", agency: "Rabat", quantity: 5, minThreshold: 3, status: "available", location: "Datacenter — Rack B1", updatedAt: "14 jul. 2026", unitPrice: "45 000" },
    { id: "STK-001-T", reference: "REF-SRV-001", name: "Serveur Dell PowerEdge R750", category: "Serveurs", agency: "Tanger", quantity: 3, minThreshold: 3, status: "low", location: "Salle serveurs — Baie 2", updatedAt: "10 jul. 2026", unitPrice: "45 000" },

    // ── Ordinateur Dell OptiPlex 7090 ────────────────────────
    { id: "STK-002", reference: "REF-PC-002", name: "Ordinateur Dell OptiPlex 7090", category: "Postes", agency: "Casablanca", quantity: 3, minThreshold: 5, status: "low", location: "Stock principal — Étagère B2", updatedAt: "14 jul. 2026", unitPrice: "8 500" },
    { id: "STK-002-R", reference: "REF-PC-002", name: "Ordinateur Dell OptiPlex 7090", category: "Postes", agency: "Rabat", quantity: 8, minThreshold: 5, status: "available", location: "Stock local — Étagère A2", updatedAt: "13 jul. 2026", unitPrice: "8 500" },
    { id: "STK-002-T", reference: "REF-PC-002", name: "Ordinateur Dell OptiPlex 7090", category: "Postes", agency: "Tanger", quantity: 6, minThreshold: 4, status: "available", location: "Réserve — Zone C", updatedAt: "12 jul. 2026", unitPrice: "8 500" },
    { id: "STK-002-M", reference: "REF-PC-002", name: "Ordinateur Dell OptiPlex 7090", category: "Postes", agency: "Marrakech", quantity: 2, minThreshold: 3, status: "low", location: "Bureau stock — RC 1", updatedAt: "11 jul. 2026", unitPrice: "8 500" },

    // ── Écran LG 27" 4K ─────────────────────────────────────
    { id: "STK-003", reference: "REF-ECR-003", name: "Écran LG 27\" 4K", category: "Écrans", agency: "Casablanca", quantity: 0, minThreshold: 3, status: "out_of_stock", location: "—", updatedAt: "13 jul. 2026", unitPrice: "6 200" },
    { id: "STK-003-M", reference: "REF-ECR-003", name: "Écran LG 27\" 4K", category: "Écrans", agency: "Marrakech", quantity: 6, minThreshold: 3, status: "available", location: "Stock principal — Étagère D2", updatedAt: "10 jul. 2026", unitPrice: "6 200" },
    { id: "STK-003-R", reference: "REF-ECR-003", name: "Écran LG 27\" 4K", category: "Écrans", agency: "Rabat", quantity: 1, minThreshold: 2, status: "low", location: "Magasin — Rayon 3", updatedAt: "8 jul. 2026", unitPrice: "6 200" },

    // ── Imprimante Canon IR-2530 ─────────────────────────────
    { id: "STK-004", reference: "REF-IMP-004", name: "Imprimante Canon IR-2530", category: "Imprimantes", agency: "Casablanca", quantity: 7, minThreshold: 2, status: "available", location: "Bureau comptabilité — RC 2", updatedAt: "12 jul. 2026", unitPrice: "12 000" },
    { id: "STK-004-R", reference: "REF-IMP-004", name: "Imprimante Canon IR-2530", category: "Imprimantes", agency: "Rabat", quantity: 3, minThreshold: 2, status: "available", location: "Local technique — Étage 2", updatedAt: "9 jul. 2026", unitPrice: "12 000" },

    // ── Onduleur APC Smart-UPS 3000VA ────────────────────────
    { id: "STK-005", reference: "REF-OND-005", name: "Onduleur APC Smart-UPS 3000VA", category: "Alimentation", agency: "Casablanca", quantity: 2, minThreshold: 4, status: "low", location: "Datacenter — Salle technique", updatedAt: "11 jul. 2026", unitPrice: "7 800" },
    { id: "STK-005-T", reference: "REF-OND-005", name: "Onduleur APC Smart-UPS 3000VA", category: "Alimentation", agency: "Tanger", quantity: 4, minThreshold: 3, status: "available", location: "Salle technique — Étage B", updatedAt: "8 jul. 2026", unitPrice: "7 800" },

    // ── Téléphone Yealink T54W ───────────────────────────────
    { id: "STK-006", reference: "REF-TEL-006", name: "Téléphone Yealink T54W", category: "Téléphonie", agency: "Casablanca", quantity: 15, minThreshold: 5, status: "available", location: "Stock principal — Étagère A1", updatedAt: "10 jul. 2026", unitPrice: "2 400" },
    { id: "STK-006-F", reference: "REF-TEL-006", name: "Téléphone Yealink T54W", category: "Téléphonie", agency: "Fès", quantity: 10, minThreshold: 4, status: "available", location: "Réserve — Bureau 204", updatedAt: "7 jul. 2026", unitPrice: "2 400" },

    // ── Switch Cisco Catalyst 9200 ───────────────────────────
    { id: "STK-007", reference: "REF-SW-007", name: "Switch Cisco Catalyst 9200", category: "Réseau", agency: "Casablanca", quantity: 1, minThreshold: 3, status: "low", location: "Salle réseau — Baie 1", updatedAt: "9 jul. 2026", unitPrice: "9 500" },
    { id: "STK-007-T", reference: "REF-SW-007", name: "Switch Cisco Catalyst 9200", category: "Réseau", agency: "Tanger", quantity: 3, minThreshold: 2, status: "available", location: "Salle réseau — Baie 3", updatedAt: "6 jul. 2026", unitPrice: "9 500" },
    { id: "STK-007-R", reference: "REF-SW-007", name: "Switch Cisco Catalyst 9200", category: "Réseau", agency: "Rabat", quantity: 2, minThreshold: 2, status: "low", location: "Baie réseau — Étage 1", updatedAt: "5 jul. 2026", unitPrice: "9 500" },

    // ── Clavier Logitech MX Keys ─────────────────────────────
    { id: "STK-008", reference: "REF-CLV-008", name: "Clavier sans fil Logitech MX Keys", category: "Périphériques", agency: "Casablanca", quantity: 20, minThreshold: 10, status: "available", location: "Stock principal — Étagère C3", updatedAt: "8 jul. 2026", unitPrice: "850" },
    { id: "STK-008-R", reference: "REF-CLV-008", name: "Clavier sans fil Logitech MX Keys", category: "Périphériques", agency: "Rabat", quantity: 15, minThreshold: 8, status: "available", location: "Stock local — Casier 4", updatedAt: "6 jul. 2026", unitPrice: "850" },
    { id: "STK-008-M", reference: "REF-CLV-008", name: "Clavier sans fil Logitech MX Keys", category: "Périphériques", agency: "Marrakech", quantity: 10, minThreshold: 6, status: "available", location: "Stock principal — Étagère B1", updatedAt: "4 jul. 2026", unitPrice: "850" },

    // ── Souris Logitech MX Master 3S ─────────────────────────
    { id: "STK-009", reference: "REF-SOURIS-009", name: "Souris sans fil Logitech MX Master 3S", category: "Périphériques", agency: "Casablanca", quantity: 0, minThreshold: 8, status: "out_of_stock", location: "—", updatedAt: "7 jul. 2026", unitPrice: "650" },
    { id: "STK-009-M", reference: "REF-SOURIS-009", name: "Souris sans fil Logitech MX Master 3S", category: "Périphériques", agency: "Marrakech", quantity: 8, minThreshold: 5, status: "available", location: "Stock principal — Étagère C1", updatedAt: "5 jul. 2026", unitPrice: "650" },

    // ── Câble RJ45 Cat6 ─────────────────────────────────────
    { id: "STK-010", reference: "REF-CAB-010", name: "Câble RJ45 Cat6 (3m)", category: "Câblage", agency: "Casablanca", quantity: 150, minThreshold: 50, status: "available", location: "Magasin — Zone D", updatedAt: "6 jul. 2026", unitPrice: "35" },
    { id: "STK-010-T", reference: "REF-CAB-010", name: "Câble RJ45 Cat6 (3m)", category: "Câblage", agency: "Tanger", quantity: 200, minThreshold: 60, status: "available", location: "Entrepôt — Allée 2", updatedAt: "4 jul. 2026", unitPrice: "35" },
    { id: "STK-010-R", reference: "REF-CAB-010", name: "Câble RJ45 Cat6 (3m)", category: "Câblage", agency: "Rabat", quantity: 80, minThreshold: 40, status: "available", location: "Magasin technique — Sdb B", updatedAt: "2 jul. 2026", unitPrice: "35" },

    // ── Onduleur Eaton 5P 1500VA ─────────────────────────────
    { id: "STK-011", reference: "REF-UPS-011", name: "Onduleur Eaton 5P 1500VA", category: "Alimentation", agency: "Casablanca", quantity: 0, minThreshold: 2, status: "out_of_stock", location: "—", updatedAt: "5 jul. 2026", unitPrice: "5 200" },
    { id: "STK-011-T", reference: "REF-UPS-011", name: "Onduleur Eaton 5P 1500VA", category: "Alimentation", agency: "Tanger", quantity: 5, minThreshold: 2, status: "available", location: "Salle technique — Baie 1", updatedAt: "3 jul. 2026", unitPrice: "5 200" },
    { id: "STK-011-F", reference: "REF-UPS-011", name: "Onduleur Eaton 5P 1500VA", category: "Alimentation", agency: "Fès", quantity: 2, minThreshold: 2, status: "low", location: "Réserve technique", updatedAt: "1 jul. 2026", unitPrice: "5 200" },

    // ── Projecteur Epson EB-X51 ──────────────────────────────
    { id: "STK-012", reference: "REF-PROJ-012", name: "Projecteur Epson EB-X51", category: "Audiovisuel", agency: "Casablanca", quantity: 4, minThreshold: 2, status: "available", location: "Salle de réunion — RC 1", updatedAt: "4 jul. 2026", unitPrice: "11 500" },
    { id: "STK-012-R", reference: "REF-PROJ-012", name: "Projecteur Epson EB-X51", category: "Audiovisuel", agency: "Rabat", quantity: 2, minThreshold: 1, status: "available", location: "Salle conférence — Étage 3", updatedAt: "2 jul. 2026", unitPrice: "11 500" },

    // ── Pare-feu Fortinet FortiGate 60F ──────────────────────
    { id: "STK-013", reference: "REF-FB-013", name: "Pare-feu Fortinet FortiGate 60F", category: "Réseau", agency: "Casablanca", quantity: 1, minThreshold: 1, status: "low", location: "Salle réseau — Baie 2", updatedAt: "3 jul. 2026", unitPrice: "18 000" },
    { id: "STK-013-T", reference: "REF-FB-013", name: "Pare-feu Fortinet FortiGate 60F", category: "Réseau", agency: "Tanger", quantity: 2, minThreshold: 1, status: "available", location: "Salle réseau — Baie 1", updatedAt: "1 jul. 2026", unitPrice: "18 000" },
    { id: "STK-013-F", reference: "REF-FB-013", name: "Pare-feu Fortinet FortiGate 60F", category: "Réseau", agency: "Fès", quantity: 1, minThreshold: 1, status: "low", location: "Local technique — Étage 1", updatedAt: "29 jun. 2026", unitPrice: "18 000" },

    // ── SSD Samsung 990 Pro 1To ──────────────────────────────
    { id: "STK-014", reference: "REF-SSD-014", name: "SSD Samsung 990 Pro 1To", category: "Stockage", agency: "Casablanca", quantity: 8, minThreshold: 5, status: "available", location: "Datacenter — Armoire B", updatedAt: "2 jul. 2026", unitPrice: "1 200" },
    { id: "STK-014-T", reference: "REF-SSD-014", name: "SSD Samsung 990 Pro 1To", category: "Stockage", agency: "Tanger", quantity: 12, minThreshold: 5, status: "available", location: "Stock technique — Casier 7", updatedAt: "30 jun. 2026", unitPrice: "1 200" },
    { id: "STK-014-F", reference: "REF-SSD-014", name: "SSD Samsung 990 Pro 1To", category: "Stockage", agency: "Fès", quantity: 4, minThreshold: 4, status: "low", location: "Réserve — Étagère 2", updatedAt: "28 jun. 2026", unitPrice: "1 200" },

    // ── Tablette Samsung Galaxy Tab A9 ────────────────────────
    { id: "STK-015", reference: "REF-TAB-015", name: "Tablette Samsung Galaxy Tab A9", category: "Tablettes", agency: "Casablanca", quantity: 6, minThreshold: 3, status: "available", location: "Stock principal — Étagère E1", updatedAt: "1 jul. 2026", unitPrice: "3 400" },
    { id: "STK-015-R", reference: "REF-TAB-015", name: "Tablette Samsung Galaxy Tab A9", category: "Tablettes", agency: "Rabat", quantity: 4, minThreshold: 2, status: "available", location: "Bureau directeur — Casier 1", updatedAt: "29 jun. 2026", unitPrice: "3 400" },
    { id: "STK-015-M", reference: "REF-TAB-015", name: "Tablette Samsung Galaxy Tab A9", category: "Tablettes", agency: "Marrakech", quantity: 3, minThreshold: 2, status: "available", location: "Stock local — Étagère A1", updatedAt: "27 jun. 2026", unitPrice: "3 400" },
];

export const categoryOptions = [
    { value: "all", label: "Toutes les catégories" },
    { value: "Serveurs", label: "Serveurs" },
    { value: "Postes", label: "Postes" },
    { value: "Écrans", label: "Écrans" },
    { value: "Imprimantes", label: "Imprimantes" },
    { value: "Alimentation", label: "Alimentation" },
    { value: "Téléphonie", label: "Téléphonie" },
    { value: "Réseau", label: "Réseau" },
    { value: "Périphériques", label: "Périphériques" },
    { value: "Câblage", label: "Câblage" },
    { value: "Audiovisuel", label: "Audiovisuel" },
    { value: "Stockage", label: "Stockage" },
    { value: "Tablettes", label: "Tablettes" },
];

export const agencyOptions = [
    { value: "all", label: "Toutes les agences" },
    { value: "Casablanca", label: "Casablanca" },
    { value: "Rabat", label: "Rabat" },
    { value: "Tanger", label: "Tanger" },
    { value: "Fès", label: "Fès" },
    { value: "Marrakech", label: "Marrakech" },
];

export const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "available", label: "Disponible" },
    { value: "low", label: "Stock faible" },
    { value: "out_of_stock", label: "Rupture" },
];
