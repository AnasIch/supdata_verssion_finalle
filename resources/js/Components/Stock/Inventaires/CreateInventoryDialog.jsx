import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/Dialog";
import { Button } from "@/Components/UI/Button";
import { Input } from "@/Components/UI/Input";
import { Textarea } from "@/Components/UI/Textarea";
import { Label } from "@/Components/UI/Label";

export default function CreateInventoryDialog({ open, onOpenChange, agencies = [], responsables = [], user, onSubmit }) {
    const [form, setForm] = useState(() => ({
        agency_id: agencies[0]?.id || "",
        user_id: user?.id || responsables[0]?.id || "",
        date: new Date().toISOString().slice(0, 10),
        type: "general",
        observation: "",
    }));

    const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

    const submit = () => {
        onSubmit({
            agency_id: Number(form.agency_id),
            user_id: Number(form.user_id),
            date: form.date,
            type: form.type,
            observation: form.observation.trim() || null,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Créer un inventaire</DialogTitle>
                    <DialogDescription>Préparez un contrôle physique du stock pour une agence. Vous pourrez saisir les produits ensuite.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <Label htmlFor="inv-agency">Agence</Label>
                        <select
                            id="inv-agency"
                            value={form.agency_id}
                            onChange={(e) => update("agency_id", e.target.value)}
                            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                            aria-required="true"
                        >
                            {agencies.map((agency) => (
                                <option key={agency.id} value={agency.id}>{agency.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="inv-responsable">Responsable</Label>
                        <select
                            id="inv-responsable"
                            value={form.user_id}
                            onChange={(e) => update("user_id", e.target.value)}
                            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                            aria-required="true"
                        >
                            {responsables.map((responsable) => (
                                <option key={responsable.id} value={responsable.id}>{responsable.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="inv-date">Date</Label>
                        <Input id="inv-date" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} aria-required="true" />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <Label htmlFor="inv-type">Type</Label>
                        <select
                            id="inv-type"
                            value={form.type}
                            onChange={(e) => update("type", e.target.value)}
                            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="general">Général</option>
                            <option value="partial">Partiel</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <Label htmlFor="inv-observation">Observation</Label>
                        <Textarea id="inv-observation" rows={3} value={form.observation} onChange={(e) => update("observation", e.target.value)} placeholder="Ex : inventaire de fin de mois, après réception…" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
                    <Button onClick={submit} disabled={!form.agency_id || !form.user_id || !form.date}>Créer l'inventaire</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
