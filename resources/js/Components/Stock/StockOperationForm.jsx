import { Input } from "@/Components/UI/Input";
import { Label } from "@/Components/UI/Label";

const unique = (values) => [...new Set(values.filter(Boolean))];
const Select = ({ id, value, onChange, children }) => <select id={id} className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={value} onChange={onChange}>{children}</select>;

export default function StockOperationForm({ section, values, onChange, productOptions = [], categoryOptions = [] }) {
    const products = unique([...productOptions.map((p) => p.name), values.nom]);
    const categories = unique([...categoryOptions, values.detail]);

    if (section === "mouvements") return <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="movement-type">Type de mouvement</Label><Select id="movement-type" value={values.type || "Entrée"} onChange={e=>onChange("type",e.target.value)}><option>Entrée</option><option>Sortie</option></Select></div>
        <div><Label htmlFor="movement-product">Produit</Label><Select id="movement-product" value={values.nom} onChange={e=>onChange("nom",e.target.value)}><option value="">Sélectionner un produit</option>{products.map(p=><option key={p}>{p}</option>)}</Select></div>
        <div><Label htmlFor="movement-agency">Agence</Label><Select id="movement-agency" value={values.agence} onChange={e=>onChange("agence",e.target.value)}><option>Casablanca</option><option>Marrakech</option></Select></div>
        <div><Label htmlFor="movement-quantity">Quantité</Label><Input id="movement-quantity" className="mt-2" type="number" min="1" value={values.quantite} onChange={e=>onChange("quantite",e.target.value)}/></div>
        <div className="sm:col-span-2"><Label htmlFor="movement-reason">Origine, destination ou motif</Label><Input id="movement-reason" className="mt-2" value={values.detail} onChange={e=>onChange("detail",e.target.value)} placeholder="Ex. Réception fournisseur, livraison client…"/></div>
    </div>;

    if (section === "receptions") return <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="reception-supplier">Fournisseur</Label><Input id="reception-supplier" className="mt-2" value={values.nom} onChange={e=>onChange("nom",e.target.value)} placeholder="Nom du fournisseur"/></div>
        <div><Label htmlFor="reception-reference">Bon de livraison / marchandises</Label><Input id="reception-reference" className="mt-2" value={values.detail} onChange={e=>onChange("detail",e.target.value)} placeholder="BL-2026-… · références reçues"/></div>
        <div><Label htmlFor="reception-agency">Agence de réception</Label><Select id="reception-agency" value={values.agence} onChange={e=>onChange("agence",e.target.value)}><option>Casablanca</option><option>Marrakech</option></Select></div>
        <div><Label htmlFor="reception-quantity">Quantité reçue</Label><Input id="reception-quantity" className="mt-2" type="number" min="1" value={values.quantite} onChange={e=>onChange("quantite",e.target.value)}/></div>
    </div>;

    if (section === "inventaires") return <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label htmlFor="inventory-name">Campagne d’inventaire</Label><Input id="inventory-name" className="mt-2" value={values.nom} onChange={e=>onChange("nom",e.target.value)} placeholder="Ex. Inventaire trimestriel"/></div>
        <div className="sm:col-span-2"><Label htmlFor="inventory-scope">Périmètre et écarts constatés</Label><Input id="inventory-scope" className="mt-2" value={values.detail} onChange={e=>onChange("detail",e.target.value)} placeholder="Ex. Informatique · 4 écarts"/></div>
        <div><Label htmlFor="inventory-agency">Agence inventoriée</Label><Select id="inventory-agency" value={values.agence} onChange={e=>onChange("agence",e.target.value)}><option>Casablanca</option><option>Marrakech</option></Select></div>
        <div><Label htmlFor="inventory-progress">Progression (%)</Label><Input id="inventory-progress" className="mt-2" type="number" min="0" max="100" value={values.quantite} onChange={e=>onChange("quantite",e.target.value)}/></div>
    </div>;

    const isCategory = section === "categories";
    return <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Label htmlFor="stock-name">{isCategory ? "Catégorie" : "Produit"}</Label><Select id="stock-name" value={values.nom} onChange={e=>onChange("nom",e.target.value)}><option value="">Sélectionner {isCategory ? "une catégorie" : "un produit"}</option>{(isCategory?categories:products).map(v=><option key={v}>{v}</option>)}</Select></div><div className="sm:col-span-2"><Label htmlFor="stock-detail">{isCategory ? "Description" : "Catégorie"}</Label>{isCategory?<Input id="stock-detail" className="mt-2" value={values.detail} onChange={e=>onChange("detail",e.target.value)}/>:<Select id="stock-detail" value={values.detail} onChange={e=>onChange("detail",e.target.value)}><option value="">Sélectionner une catégorie</option>{categories.map(v=><option key={v}>{v}</option>)}</Select>}</div><div><Label>Agence</Label><Select value={values.agence} onChange={e=>onChange("agence",e.target.value)}><option>Casablanca</option><option>Marrakech</option><option>Toutes</option></Select></div><div><Label>Quantité disponible</Label><Input className="mt-2" type="number" min="0" value={values.quantite} onChange={e=>onChange("quantite",e.target.value)}/></div></div>;
}
