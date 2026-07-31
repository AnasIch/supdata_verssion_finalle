import { useState } from "react";
import { Edit3, Eye, Plus, RotateCcw, Search, Trash2, XCircle } from "lucide-react";
import { router } from "@inertiajs/react";
import { Badge } from "@/Components/UI/Badge";
import { Button } from "@/Components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { DataTable } from "@/Components/UI/DataTable";
import { Input } from "@/Components/UI/Input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/Dialog";
import { PaginationBar } from "@/Components/UI/Pagination";
import { useToast } from "@/Components/UI/Toast";
import StockOperationForm from "./StockOperationForm";
import CancelLivraisonDialog from "./CancelLivraisonDialog";

const empty = { nom:"", detail:"", agence:"Casablanca", quantite:"", type:"Entrée", document_type:"", document_file:null };
const warning = ["Stock faible","À contrôler","À valider","À confirmer","En transit","En cours","En préparation"];
const status = value => <Badge variant={["Rupture","Critique","Annulée"].includes(value)?"destructive":warning.includes(value)?"warning":"success"}>{value}</Badge>;

export default function StockOperationsPanel({ operations }) {
 const toast=useToast();
 const [formOpen,setFormOpen]=useState(false);
 const [formKey,setFormKey]=useState(0);
 const [editing,setEditing]=useState(null);
 const [selected,setSelected]=useState(null);
 const [form,setForm]=useState(empty);
 const [cancelOpen,setCancelOpen]=useState(false);
 const [cancellingItem,setCancellingItem]=useState(null);
 const [deleteOpen,setDeleteOpen]=useState(false);
 const [deletingItem,setDeletingItem]=useState(null);

 const create=()=>{setEditing(null);setForm(empty);setFormKey(k=>k+1);setFormOpen(true)};
 const edit=i=>{setEditing(i);setForm({nom:i.nom,detail:i.detail||"",agence:i.agence,quantite:i.quantite,type:i.type||"Entrée"});setFormKey(k=>k+1);setFormOpen(true)};
 const submit=()=>{const isCategory=operations.section==="categories";if(!form.nom||(!isCategory&&(form.quantite===""||Number(form.quantite)<0)))return toast("Vérifiez les informations saisies.","error");const needsDocument=["mouvements","receptions"].includes(operations.section);if(needsDocument&&!form.document_type)return toast("Renseignez un type de document.","error");if(needsDocument&&!form.document_file)return toast("Joignez le document PDF associé.","error"); editing?operations.updateItem(editing.id,form):operations.createItem(form);setFormOpen(false);toast(editing?"Élément modifié.":"Élément créé.")};
 const transition=i=>{operations.transitionItem(i.id);toast(operations.section==="receptions"?"Réception contrôlée et validée.":operations.section==="livraisons"?"Remise au client confirmée.":"Alerte traitée.")};
 const handleCancelConfirm=(id,reason)=>{operations.cancelItem(id,reason);setCancellingItem(null);setCancelOpen(false);toast("Réservation annulée. Le Commercial a été notifié.")};
 const confirmDelete=(i)=>{setDeletingItem(i);setDeleteOpen(true)};
 const handleDeleteConfirm=()=>{router.delete(`/dashboard-stock/${operations.section}/${deletingItem.id}`,{preserveScroll:true,onSuccess:()=>{setDeleteOpen(false);setDeletingItem(null);toast("Élément supprimé.")},onError:(errors)=>{setDeleteOpen(false);setDeletingItem(null);toast(errors.category||"Impossible de supprimer cet élément.","error")}})};

 const actions=i=><div className="flex justify-end gap-2">
  <Button size="sm" variant="ghost" onClick={()=>setSelected(i)} aria-label={`Consulter ${i.nom}`}><Eye className="size-3.5"/></Button>
  {operations.config.workflow&&operations.canTransition(i)&&<Button size="sm" onClick={()=>transition(i)}>{operations.section==="receptions"?"Valider":operations.section==="livraisons"?"Livrer":"Traiter"}</Button>}
  {operations.canCancel&&operations.canCancel(i)&&<Button size="sm" variant="ghost" className="text-red-600" onClick={()=>{setCancellingItem(i);setCancelOpen(true)}}><XCircle className="size-3.5"/></Button>}
  {operations.config.canCrud&&<><Button size="sm" variant="outline" onClick={()=>edit(i)}><Edit3 className="size-3.5"/></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={()=>confirmDelete(i)}><Trash2 className="size-3.5"/></Button></>}
 </div>;

 const ref={header:"Référence",accessorKey:"id",className:"font-mono text-xs font-semibold"};
 const columnsBySection={
  mouvements:[ref,{header:"Sens",cell:i=><Badge variant={(i.type||i.nom)?.toLowerCase().includes("sortie")?"warning":"success"}>{i.type||i.nom?.split("·")[0]||"Mouvement"}</Badge>},{header:"Produit / motif",cell:i=><div><p className="font-medium">{i.type?i.nom:(i.nom?.split("·").slice(1).join("·")||i.nom)}</p><p className="text-xs text-slate-500">{i.detail}</p></div>},{header:"Agence",accessorKey:"agence"},{header:"Quantité",cell:i=><b className="font-mono">{i.quantite}</b>},{header:"Traçabilité",cell:i=>status(i.statut)},{header:"Actions",cell:actions,className:"text-right"}],
  receptions:[ref,{header:"Fournisseur",accessorKey:"nom"},{header:"BL / marchandises",accessorKey:"detail"},{header:"Agence d'arrivée",accessorKey:"agence"},{header:"Reçu",cell:i=><b className="font-mono">{i.quantite} unités</b>},{header:"Contrôle",cell:i=>status(i.statut)},{header:"Actions",cell:actions,className:"text-right"}],
  livraisons:[ref,{header:"Client / destination",accessorKey:"nom"},{header:"Marchandises",accessorKey:"detail"},{header:"Agence d'expédition",accessorKey:"agence"},{header:"À livrer",cell:i=><b className="font-mono">{i.quantite} unités</b>},{header:"Acheminement",cell:i=>status(i.statut)},{header:"Actions",cell:actions,className:"text-right"}],
 };
 const generic=[ref,{header:"Élément",cell:i=><div><p className="font-medium">{i.nom}</p><p className="text-xs text-slate-500">{i.detail}</p></div>},{header:"Agence",accessorKey:"agence"},{header:"Quantité",accessorKey:"quantite"},{header:"Statut",cell:i=>status(i.statut)},{header:"Actions",cell:actions,className:"text-right"}];
 const columns=columnsBySection[operations.section]||generic;

 const detailFields=()=>{
  if(!selected)return null;
  const fields={Élément:selected.nom,Détail:selected.detail,Agence:selected.agence,Quantité:selected.quantite,Statut:selected.statut};
  if(operations.section==="livraisons"){
   fields.Client=selected.client||"—";
   fields.Produit=selected.produit||"—";
   fields.Référence=selected.reference||"—";
   if(selected.cancellation_reason)fields["Motif d'annulation"]=selected.cancellation_reason;
  }
  return fields;
 };

 return <>
  <CancelLivraisonDialog open={cancelOpen} onOpenChange={setCancelOpen} reservation={cancellingItem} onConfirm={handleCancelConfirm}/>
  <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>Confirmer la suppression</DialogTitle><DialogDescription>Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.</DialogDescription></DialogHeader><DialogFooter><Button variant="ghost" onClick={()=>setDeleteOpen(false)}>Annuler</Button><Button variant="destructive" onClick={handleDeleteConfirm}>Supprimer</Button></DialogFooter></DialogContent></Dialog>
  <Dialog open={Boolean(selected)} onOpenChange={o=>!o&&setSelected(null)}><DialogContent><DialogHeader><DialogTitle>{operations.config.titre} · {selected?.reference||selected?.id}</DialogTitle><DialogDescription>Détail opérationnel</DialogDescription></DialogHeader>{selected&&<div className="grid gap-3 sm:grid-cols-2">{Object.entries(detailFields()).map(([k,v])=><div key={k} className="rounded-lg border p-3"><p className="text-xs text-slate-500">{k}</p><p className="mt-1 font-semibold">{v??"—"}</p></div>)}</div>}<DialogFooter><Button onClick={()=>setSelected(null)}>Fermer</Button></DialogFooter></DialogContent></Dialog>
   <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editing?`Modifier ${editing.id}`:operations.config.action}</DialogTitle><DialogDescription>Formulaire spécifique au module {operations.config.titre.toLowerCase()}.</DialogDescription></DialogHeader><StockOperationForm key={formKey} section={operations.section} values={form} productOptions={operations.productOptions} categoryOptions={operations.categoryOptions} agencies={operations.agencies} onChange={(f,v)=>setForm(c=>({...c,[f]:v}))}/><DialogFooter><Button variant="ghost" onClick={()=>setFormOpen(false)}>Annuler</Button><Button onClick={submit}>{editing?"Enregistrer":"Créer"}</Button></DialogFooter></DialogContent></Dialog>
  <div className="flex flex-col gap-6"><header className="border-b-2 border-emerald-900 pb-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800">Responsable Stock</p><h1 className="mt-2 text-2xl font-semibold text-slate-950">{operations.config.titre}</h1><p className="mt-2 text-sm text-slate-500">{operations.config.description}</p></div>{operations.config.action&&<Button onClick={create}><Plus className="size-4"/>{operations.config.action}</Button>}</div></header><Card className="rounded-lg border-slate-300 shadow-none"><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><CardTitle>{operations.section==="mouvements"?"Journal des mouvements":operations.section==="receptions"?"Contrôle des arrivages":operations.section==="livraisons"?"Suivi des expéditions":"Registre opérationnel"}</CardTitle><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input className="pl-9" value={operations.search} onChange={e=>operations.setSearch(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher"/></div><select className="rounded-md border bg-white px-3 text-sm" value={operations.agency} onChange={e=>operations.setAgency(e.target.value)} aria-label="Filtrer par agence"><option>Toutes</option>{operations.agencies.map(a=><option key={a.id} value={a.name}>{a.name}</option>)}</select><Button variant="ghost" size="sm" onClick={operations.reset}><RotateCcw className="size-4"/></Button></div></div></CardHeader><CardContent><DataTable columns={columns} data={operations.items} emptyMessage="Aucun élément trouvé."/><PaginationBar currentPage={operations.page} totalPages={operations.totalPages} total={operations.total} perPage={operations.perPage} onPageChange={operations.setPage} onPerPageChange={operations.setPerPage}/></CardContent></Card></div>
 </>;
}
