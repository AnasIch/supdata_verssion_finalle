import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { cn } from "@/lib/utils";

const typeStyles = {
    warning: { icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
    info: { icon: Info, color: "bg-blue-50 text-blue-600" },
    success: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
};

const badgeVariants = {
    Critique: "destructive",
    Nouveau: "info",
    Validé: "success",
    Attention: "warning",
    Info: "secondary",
};

export default function NotificationsCard({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                        Notifications importantes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        {data.map((notif) => {
                            const style = typeStyles[notif.type] || typeStyles.info;
                            const Icon = style.icon;
                            return (
                                <div
                                    key={notif.id}
                                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                                >
                                    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", style.color)}>
                                        <Icon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                                            <Badge variant={badgeVariants[notif.badge] || "secondary"} className="shrink-0">
                                                {notif.badge}
                                            </Badge>
                                        </div>
                                        <p className="mt-0.5 text-xs text-slate-500">{notif.description}</p>
                                    </div>
                                    <span className="shrink-0 text-xs text-slate-400">{notif.time}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
