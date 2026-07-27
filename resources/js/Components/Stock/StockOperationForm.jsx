import { Input } from "@/Components/UI/Input";
import { Label } from "@/Components/UI/Label";

const unique = (values) => [...new Set(values.filter(Boolean))];
const Select = ({ id, value, onChange, children }) => <select id={id} className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={value} onChange={onChange}>{children}</select>;

export default function StockOperationForm({ section, values, onChange, productOptions = [], categoryOptions = [], agencies = [] }) {
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

    const isCategory = section === "categories";

    if (isCategory) {
        return <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label htmlFor="category-name">Nom de la catégorie</Label><Input id="category-name" className="mt-2" value={values.nom} onChange={e=>onChange("nom",e.target.value)} placeholder="Ex. Informatique, Mobilier…"/></div>
            <div className="sm:col-span-2"><Label htmlFor="category-desc">Description</Label><Input id="category-desc" className="mt-2" value={values.detail} onChange={e=>onChange("detail",e.target.value)} placeholder="Description facultative…"/></div>
        </div>;
    }

    return <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label htmlFor="product-name">Nom du produit</Label><Input id="product-name" className="mt-2" value={values.nom} onChange={e=>onChange("nom",e.target.value)} placeholder="Ex. Écran Dell 24&quot;"/></div>
        <div><Label htmlFor="product-category">Catégorie</Label><Select id="product-category" value={values.detail} onChange={e=>onChange("detail",e.target.value)}><option value="">Sélectionner une catégorie</option>{categories.map(v=><option key={v}>{v}</option>)}</Select></div>
        <div><Label htmlFor="product-agency">Agence</Label><Select id="product-agency" value={values.agence} onChange={e=>onChange("agence",e.target.value)}><option value="">Sélectionner une agence</option>{agencies.map(a=><option key={a.id} value={a.name}>{a.name}</option>)}</Select></div>
        <div className="sm:col-span-2"><Label htmlFor="product-quantity">Quantité initiale</Label><Input id="product-quantity" className="mt-2" type="number" min="0" value={values.quantite} onChange={e=>onChange("quantite",e.target.value)}/></div>
    </div>;
}
