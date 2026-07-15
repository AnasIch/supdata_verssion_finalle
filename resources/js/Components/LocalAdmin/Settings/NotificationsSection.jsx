import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Switch } from "@/Components/UI/Switch";
import { Bell } from "lucide-react";

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

export default function NotificationsSection({ data, onToggle }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Bell className="size-4" />
                    </div>
                    Notifications
                </CardTitle>
                <CardDescription>Choisissez les alertes que vous souhaitez recevoir.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Types d'alertes</p>
                        <SwitchRow
                            label="Nouvelle demande"
                            description="À la réception d'une nouvelle demande"
                            checked={data.nouvelleDemande}
                            onCheckedChange={() => onToggle("nouvelleDemande")}
                        />
                        <SwitchRow
                            label="Validation"
                            description="Lors de la validation d'une demande"
                            checked={data.validation}
                            onCheckedChange={() => onToggle("validation")}
                        />
                        <SwitchRow
                            label="Refus"
                            description="Lors du refus d'une demande"
                            checked={data.refus}
                            onCheckedChange={() => onToggle("refus")}
                        />
                        <SwitchRow
                            label="Stock critique"
                            description="Quand le stock atteint le seuil critique"
                            checked={data.stockCritique}
                            onCheckedChange={() => onToggle("stockCritique")}
                        />
                        <SwitchRow
                            label="Nouvel arrivage"
                            description="À la réception de nouveaux produits"
                            checked={data.nouvelArrivage}
                            onCheckedChange={() => onToggle("nouvelArrivage")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Canaux</p>
                        <SwitchRow
                            label="Notifications email"
                            description="Recevoir les alertes par email"
                            checked={data.emailNotifications}
                            onCheckedChange={() => onToggle("emailNotifications")}
                        />
                        <SwitchRow
                            label="Notifications internes"
                            description="Recevoir les alertes dans l'application"
                            checked={data.internalNotifications}
                            onCheckedChange={() => onToggle("internalNotifications")}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
