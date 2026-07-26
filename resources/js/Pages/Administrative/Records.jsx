import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";

const labels = { documents: "Documents", notes: "Notes de service", contrats: "Contrats" };
const blank = { title: "", description: "", status: "Brouillon", effective_at: "", expires_at: "" };
export default function Records({ type, records = [], user }) {
 const [form,setForm]=useState(blank); const [editing,setEditing]=useState(null);
 const submit=e=>{e.preventDefault();const options={preserveScroll:true,onSuccess:()=>{setForm(blank);setEditing(null)}};editing?router.put(`/dashboard-administrative/${type}/${editing}`,form,options):router.post(`/dashboard-administrative/${type}`,form,options)};
 const edit=r=>{setEditing(r.id);setForm({title:r.title,description:r.description||"",status:r.status,effective_at:r.effective_at?.slice(0,10)||"",expires_at:r.expires_at?.slice(0,10)||""})};
 return <DashboardLayout title={labels[type]} breadcrumbs={[{label:"Dashboard",href:"/dashboard-administrative"},{label:labels[type]}]} user={user}><Head title={`${labels[type]} — SUPDATA`}/><div className="flex flex-col gap-6">
 <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-5 md:grid-cols-2"><Input required placeholder="Titre" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><select className="rounded-lg border px-3" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Brouillon</option><option>En vigueur</option><option>Archivé</option></select><Input type="date" value={form.effective_at} onChange={e=>setForm({...form,effective_at:e.target.value})}/><Input type="date" value={form.expires_at} onChange={e=>setForm({...form,expires_at:e.target.value})}/><textarea className="min-h-24 rounded-lg border p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><div className="flex gap-2 md:col-span-2"><Button type="submit">{editing?"Enregistrer":"Créer"}</Button>{editing&&<Button type="button" variant="outline" onClick={()=>{setEditing(null);setForm(blank)}}>Annuler</Button>}</div></form>
 <div className="overflow-x-auto rounded-xl border bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">Référence</th><th>Titre</th><th>Statut</th><th>Dates</th><th className="p-4">Actions</th></tr></thead><tbody>{records.map(r=><tr key={r.id} className="border-t"><td className="p-4 font-mono">{r.reference}</td><td>{r.title}</td><td>{r.status}</td><td>{r.effective_at||"—"} → {r.expires_at||"—"}</td><td className="p-4"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={()=>edit(r)}>Modifier</Button><Button size="sm" variant="destructive" onClick={()=>confirm("Supprimer cet élément ?")&&router.delete(`/dashboard-administrative/${type}/${r.id}`)}>Supprimer</Button></div></td></tr>)}</tbody></table>{!records.length&&<p className="p-8 text-center text-slate-500">Aucun élément.</p>}</div>
 </div></DashboardLayout>;
}
