import { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { Plus, Search } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { getCurrentUser } from "@/lib/mockAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { DataTable } from "@/Components/UI/DataTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/Dialog";
import { useToast } from "@/Components/UI/Toast";

const configurations = {
    documents: { title: "Documents à traiter", description: "Contrôlez et suivez les dossiers administratifs en attente.", action: "Ajouter un document", rows: [["DOC-2026-0312","Facture fournisseur","Casablanca","À vérifier"],["DOC-2026-0308","Bon de commande","Marrakech","Incomplet"],["DOC-2026-0304","Pièce justificative","Casablanca","Conforme"]] },
    notes: { title: "Notes de service", description: "Préparez et diffusez les communications administratives internes.", action: "Nouvelle note", rows: [["NS-2026-018","Procédure d’achat","Toutes","Publiée"],["NS-2026-017","Clôture mensuelle","Casablanca","Brouillon"],["NS-2026-016","Mise à jour fournisseurs","Marrakech","Publiée"]] },
    contrats: { title: "Contrats", description: "Suivez les contrats, leurs montants et leurs échéances.", action: "Ajouter un contrat", rows: [["CTR-2026-074","Tech Distribution","Casablanca","Actif"],["CTR-2026-069","Office Pro","Marrakech","À renouveler"],["CTR-2026-061","Network Systems","Casablanca","Actif"]] },
    entrees: { title: "Entrées de stock", description: "Enregistrez et consultez les marchandises réceptionnées.", action: "Nouvelle entrée", rows: [["ENT-2026-0214","45 ordinateurs","Casablanca","Validée"],["ENT-2026-0211","80 chaises","Marrakech","À contrôler"],["ENT-2026-0208","24 écrans","Casablanca","Validée"]] },
    sorties: { title: "Sorties de stock", description: "Tracez les sorties, affectations et livraisons.", action: "Nouvelle sortie", rows: [["SOR-2026-0187","8 ordinateurs","Casablanca","Livrée"],["SOR-2026-0184","12 chaises","Marrakech","En préparation"],["SOR-2026-0180","6 écrans","Casablanca","Confirmée"]] },
    alertes: { title: "Alertes stock", description: "Traitez les seuils critiques et les ruptures de stock.", action: "Créer une alerte", rows: [["ALT-0412","Dell Latitude 5540","Casablanca","Rupture"],["ALT-0387","Chaise ergonomique","Marrakech","Critique"],["ALT-0523","Écran Dell 27 pouces","Casablanca","Stock faible"]] },
    inventaire: { title: "Inventaires", description: "Organisez les comptages physiques et analysez les écarts.", action: "Nouvel inventaire", rows: [["INV-2026-014","Inventaire trimestriel","Casablanca","72 %"],["INV-2026-013","Inventaire trimestriel","Marrakech","46 %"],["INV-2026-009","Contrôle ciblé IT","Casablanca","Terminé"]] },
    commandes: { title: "Commandes", description: "Suivez les commandes fournisseurs jusqu’à leur réception.", action: "Nouvelle commande", rows: [["CMD-2026-0198","Tech Distribution","Casablanca","En transit"],["CMD-2026-0195","Office Pro","Marrakech","Confirmée"],["CMD-2026-0191","Network Systems","Casablanca","Réceptionnée"]] },
};

export default function OperationsIndex({ module, user: routeUser }) {
    const config=configurations[module]||configurations.documents;
    const user=routeUser||getCurrentUser();
    const key=`supdata_operations_${user.role}_${module}`;
    const initial=config.rows.map(row=>({reference:row[0],element:row[1],agency:row[2],status:row[3]}));
    const [rows,setRows]=useState(()=>JSON.parse(localStorage.getItem(key)||"null")||initial);
    const [query,setQuery]=useState(""); const [open,setOpen]=useState(false); const [name,setName]=useState(""); const [agency,setAgency]=useState("Casablanca");
    const toast=useToast();
    const filtered=useMemo(()=>rows.filter(row=>Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase())),[rows,query]);
    const add=()=>{if(name.trim().length<2)return toast("Renseignez un libellé valide.","error");const next=[{reference:`NEW-${Date.now().toString().slice(-5)}`,element:name.trim(),agency,status:"Brouillon"},...rows];setRows(next);localStorage.setItem(key,JSON.stringify(next));setName("");setOpen(false);toast("Élément ajouté à la démonstration.")};
    const columns=[{header:"Référence",accessorKey:"reference",className:"font-semibold"},{header:"Élément",accessorKey:"element"},{header:"Agence",accessorKey:"agency"},{header:"Statut",cell:r=><Badge variant={["Rupture","Critique","Incomplet"].includes(r.status)?"destructive":["À contrôler","À renouveler","Stock faible"].includes(r.status)?"warning":"success"}>{r.status}</Badge>},{header:"Action",cell:r=><Button size="sm" variant="outline" onClick={()=>toast(`${r.reference} ouvert en mode démonstration.`,"info")}>Consulter</Button>}];
    return <DashboardLayout title={config.title} breadcrumbs={[{label:"Dashboard",href:user.role==="Responsable Stock"?"/dashboard-stock":"/dashboard-administrative"},{label:config.title}]} user={user}><Head title={`${config.title} — SUPDATA`}/><Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{config.action}</DialogTitle><DialogDescription>Cette opération reste enregistrée uniquement dans votre navigateur.</DialogDescription></DialogHeader><label className="text-sm font-medium">Libellé<Input className="mt-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Saisir un libellé…"/></label><label className="text-sm font-medium">Agence<select className="mt-2 h-10 w-full rounded-md border px-3" value={agency} onChange={e=>setAgency(e.target.value)}><option>Casablanca</option><option>Marrakech</option></select></label><DialogFooter><Button variant="ghost" onClick={()=>setOpen(false)}>Annuler</Button><Button onClick={add}>Enregistrer</Button></DialogFooter></DialogContent></Dialog><div className="flex flex-col gap-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-blue-600">{user.role}</p><h1 className="mt-1 text-2xl font-bold text-slate-950">{config.title}</h1><p className="mt-2 text-sm text-slate-500">{config.description}</p></div><Button onClick={()=>setOpen(true)}><Plus className="size-4"/>{config.action}</Button></div><Card><CardHeader><div className="flex items-center justify-between"><CardTitle>Liste opérationnelle</CardTitle><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher…"/></div></div></CardHeader><CardContent><DataTable columns={columns} data={filtered} emptyMessage="Aucun élément trouvé."/></CardContent></Card></div></DashboardLayout>;
}
