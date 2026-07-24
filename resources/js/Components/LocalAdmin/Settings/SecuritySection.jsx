import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/UI/Card";
import { Button } from "@/Components/UI/Button";
import { Badge } from "@/Components/UI/Badge";
import { Shield, Lock, MonitorSmartphone, LogOut } from "lucide-react";

function SessionRow({ session }) {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3 transition-colors hover:bg-slate-100/70">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white border border-slate-100">
                <MonitorSmartphone className="size-4 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{session.device}</p>
                    {session.current && (
                        <Badge className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold">Actuelle</Badge>
                    )}
                </div>
                <p className="text-xs text-slate-500">{session.ip} — {session.lastActive}</p>
            </div>
            {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="size-3.5" />
                </Button>
            )}
        </div>
    );
}

export default function SecuritySection({ data, onToggle }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <Shield className="size-4" />
                    </div>
                    Sécurité
                </CardTitle>
                <CardDescription>Mot de passe, authentification et sessions actives.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Lock className="size-3.5" />
                            Changer le mot de passe
                        </Button>
                        <Button
                            variant={data.mfaEnabled ? "default" : "outline"}
                            size="sm"
                            className="gap-1.5"
                            onClick={() => onToggle("mfaEnabled")}
                        >
                            <Shield className="size-3.5" />
                            {data.mfaEnabled ? "MFA activé" : "Activer la double authentification"}
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sessions actives ({data.sessions.length})</p>
                            <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
                                Déconnecter toutes les sessions
                            </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {data.sessions.map((s) => (
                                <SessionRow key={s.id} session={s} />
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
