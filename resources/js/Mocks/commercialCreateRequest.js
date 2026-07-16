export const productCatalog = [
    { id: "PRD-001", name: "Câble HDMI 2m" },
    { id: "PRD-002", name: "Switch Cisco 24 ports" },
    { id: "PRD-003", name: "Point d'accès WiFi" },
    { id: "PRD-004", name: "Terminal de paiement" },
    { id: "PRD-005", name: "Imprimante thermique" },
    { id: "PRD-006", name: "Lecteur code-barres" },
    { id: "PRD-007", name: "Clavier sans fil Logitech MX Keys" },
    { id: "PRD-008", name: "Souris ergonomique Logitech MX Vertical" },
    { id: "PRD-009", name: "Écran 27\" Dell UltraSharp" },
    { id: "PRD-010", name: "Onduleur APC Smart-UPS 3000VA" },
    { id: "PRD-011", name: "Poste de travail Dell OptiPlex 7090" },
    { id: "PRD-012", name: "Routeur Cisco RV340" },
    { id: "PRD-013", name: "Caméra Logitech Rally" },
    { id: "PRD-014", name: "Borne Wi-Fi 6 Ubiquiti U6-Pro" },
    { id: "PRD-015", name: "Imprimante HP LaserJet Pro M404dn" },
];

export const priorityOptions = [
    { value: "Faible", label: "Faible", color: "bg-slate-100 text-slate-600" },
    { value: "Moyenne", label: "Moyenne", color: "bg-blue-50 text-blue-600" },
    { value: "Haute", label: "Haute", color: "bg-amber-50 text-amber-600" },
    { value: "Urgente", label: "Urgente", color: "bg-red-50 text-red-600" },
];

export const emptyProductLine = () => ({
    id: Date.now() + Math.random(),
    product: "",
    quantity: 1,
    observation: "",
});

export const defaultForm = {
    products: [emptyProductLine()],
    priority: "Moyenne",
    comment: "",
};
