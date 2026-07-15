import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Label } from "@/Components/UI/Label";
import { Input } from "@/Components/UI/Input";
import { Switch } from "@/Components/UI/Switch";
import { FileText } from "lucide-react";

function SwitchRow({ label, description, checked, onCheckedChange }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100/70">
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-slate-900">{label}</span>
                {description && <span className="text-xs text-slate-500">{description}</span>}
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
        </div>
    );
}

export default function RequestsSection({ data, onUpdate, onToggle }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <FileText className="size-4" />
                    </div>
                    Paramètres des demandes
                </CardTitle>
                <CardDescription>Règles de validation, modification et expiration des demandes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-medium text-slate-500">Nombre maximum de produits</Label>
                            <Input
                                type="number"
                                value={data.maxProducts}
                                onChange={(e) => onUpdate("maxProducts", Number(e.target.value))}
                                min={1}
                                max={200}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-medium text-slate-500">Délai d'expiration (jours)</Label>
                            <Input
                                type="number"
                                value={data.expiryDays}
                                onChange={(e) => onUpdate("expiryDays", Number(e.target.value))}
                                min={1}
                                max={30}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <SwitchRow
                            label="Validation obligatoire"
                            description="Exiger une validation avant traitement"
                            checked={data.mandatoryValidation}
                            onCheckedChange={() => onToggle("mandatoryValidation")}
                        />
                        <SwitchRow
                            label="Autoriser les brouillons"
                            description="Permettre de sauvegarder sans soumettre"
                            checked={data.allowDrafts}
                            onCheckedChange={() => onToggle("allowDrafts")}
                        />
                        <SwitchRow
                            label="Modification avant validation"
                            description="Permettre la modification tant que la demande n'est pas validée"
                            checked={data.editBeforeValidation}
                            onCheckedChange={() => onToggle("editBeforeValidation")}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
