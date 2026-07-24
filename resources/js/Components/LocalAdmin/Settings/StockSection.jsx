import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Label } from "@/Components/UI/Label";
import { Input } from "@/Components/UI/Input";
import { Switch } from "@/Components/UI/Switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/UI/Select";
import { Package } from "lucide-react";
import { inventoryFrequencyOptions } from "@/Mocks/localAdminSettings";

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

export default function StockSection({ data, onUpdate, onToggle }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Package className="size-4" />
                    </div>
                    Paramètres du stock
                </CardTitle>
                <CardDescription>Seuils, alertes, validation des sorties et inventaire.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-medium text-slate-500">Seuil de stock critique</Label>
                            <Input
                                type="number"
                                value={data.criticalThreshold}
                                onChange={(e) => onUpdate("criticalThreshold", Number(e.target.value))}
                                min={1}
                                max={100}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-medium text-slate-500">Fréquence de l'inventaire</Label>
                            <Select value={data.inventoryFrequency} onValueChange={(v) => onUpdate("inventoryFrequency", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {inventoryFrequencyOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <SwitchRow
                            label="Alertes automatiques"
                            description="Alerter quand le stock atteint le seuil critique"
                            checked={data.autoAlerts}
                            onCheckedChange={() => onToggle("autoAlerts")}
                        />
                        <SwitchRow
                            label="Validation obligatoire des sorties"
                            description="Exiger une validation avant toute sortie de stock"
                            checked={data.mandatoryExitValidation}
                            onCheckedChange={() => onToggle("mandatoryExitValidation")}
                        />
                        <SwitchRow
                            label="Autoriser les mouvements manuels"
                            description="Permettre les ajustements manuels de stock"
                            checked={data.allowManualMovements}
                            onCheckedChange={() => onToggle("allowManualMovements")}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
