import { Input } from "@/Components/UI/Input";
import { Label } from "@/Components/UI/Label";
import { stockOperationsData } from "@/Mocks/stockOperations";

const labels = {
    produits: { name: "Produit", detail: "Catégorie", quantity: "Quantité disponible" },
    categories: { name: "Catégorie", detail: "Description", quantity: "Nombre de produits" },
    mouvements: { name: "Mouvement / produit", detail: "Type et origine", quantity: "Quantité" },
    receptions: { name: "Fournisseur", detail: "Marchandises reçues", quantity: "Quantité reçue" },
    inventaires: { name: "Produit", detail: "Périmètre et écarts", quantity: "Progression (%)" },
};

const storedOptions = (section) => {
    if (typeof window === "undefined") return stockOperationsData[section] || [];
    try {
        return JSON.parse(localStorage.getItem(`supdata_stock_${section}`) || "null") || stockOperationsData[section] || [];
    } catch {
        return stockOperationsData[section] || [];
    }
};

const uniqueValues = (values) => [...new Set(values.filter(Boolean))];

export default function StockOperationForm({ section, values, onChange }) {
    const fieldLabels = labels[section] || labels.produits;
    const products = uniqueValues([...storedOptions("produits").map((item) => item.nom), values.nom]);
    const categories = uniqueValues([...storedOptions("categories").map((item) => item.nom), section === "categories" ? values.nom : values.detail]);
    const nameOptions = section === "categories" ? categories : products;
    const nameIsSelect = ["produits", "categories", "inventaires"].includes(section);

    return <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
            <Label htmlFor="stock-name">{fieldLabels.name}</Label>
            {nameIsSelect
                ? <select id="stock-name" className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={values.nom} onChange={(event) => onChange("nom", event.target.value)} aria-required="true">
                    <option value="">Sélectionner {section === "categories" ? "une catégorie" : "un produit"}</option>
                    {nameOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                : <Input id="stock-name" className="mt-2" value={values.nom} onChange={(event) => onChange("nom", event.target.value)} placeholder={fieldLabels.name} aria-required="true"/>}
        </div>
        <div className="sm:col-span-2">
            <Label htmlFor="stock-detail">{fieldLabels.detail}</Label>
            {section === "produits"
                ? <select id="stock-detail" className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={values.detail} onChange={(event) => onChange("detail", event.target.value)}>
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                : <Input id="stock-detail" className="mt-2" value={values.detail} onChange={(event) => onChange("detail", event.target.value)} placeholder="Référence ou description"/>}
        </div>
        <div><Label htmlFor="stock-agency">Agence</Label><select id="stock-agency" className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={values.agence} onChange={(event) => onChange("agence", event.target.value)}><option>Casablanca</option><option>Marrakech</option><option>Toutes</option></select></div>
        <div><Label htmlFor="stock-quantity">{fieldLabels.quantity}</Label><Input id="stock-quantity" className="mt-2" type="number" min="0" max={section === "inventaires" ? "100" : undefined} value={values.quantite} onChange={(event) => onChange("quantite", event.target.value)} aria-required="true"/></div>
    </div>;
}
