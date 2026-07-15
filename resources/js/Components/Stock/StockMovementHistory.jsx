import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

const typeConfig = {
    entree: { icon: ArrowDownCircle, color: "bg-emerald-50 text-emerald-600", label: "Entrée en stock" },
    sortie: { icon: ArrowUpCircle, color: "bg-red-50 text-red-500", label: "Sortie" },
    transfert: { icon: ArrowLeftRight, color: "bg-blue-50 text-blue-600", label: "Transfert" },
    inventaire: { icon: ClipboardCheck, color: "bg-violet-50 text-violet-600", label: "Inventaire" },
};

export default function StockMovementHistory({ movements }) {
    if (!movements || movements.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">Historique des mouvements</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500">Aucun mouvement enregistré.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-900">Historique des mouvements</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                    <div className="flex flex-col gap-4">
                        {movements.map((m) => {
                            const config = typeConfig[m.type] || typeConfig.entree;
                            const Icon = config.icon;
                            return (
                                <div key={m.id} className="relative flex items-start gap-3">
                                    <div className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                                        <Icon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-slate-900">{config.label}</p>
                                        <p className="text-xs text-slate-500">{m.description}</p>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                                            <span>Par {m.author}</span>
                                            {m.quantity > 0 && <span>· Qté: {m.quantity}</span>}
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-xs text-slate-400">{m.date} — {m.time}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
