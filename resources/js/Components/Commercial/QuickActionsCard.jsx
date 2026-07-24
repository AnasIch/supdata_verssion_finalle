import { motion } from "framer-motion";
import { ClipboardList, List, Package, Bell, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";
import { Link } from "@inertiajs/react";
import { getDashboardPath } from "@/lib/mockAuth";

const actions = [
    { label: "Nouvelle demande", href: "demandes/creer", icon: ClipboardList, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "Voir mes demandes", href: "demandes", icon: List, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
    { label: "Consulter le stock", href: "stock", icon: Package, color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
    { label: "Voir les notifications", href: "notifications", icon: Bell, color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
];

export default function QuickActionsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">Raccourcis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        {actions.map((action) => {
                            const Icon = action.icon;
                            const dashboardPath = getDashboardPath("Responsable Commercial");
                            return (
                                <Link
                                    key={action.label}
                                    href={`${dashboardPath}/${action.href}`}
                                    className={`group flex items-center gap-3 rounded-xl p-3 text-left text-sm font-medium transition-colors duration-150 ${action.color}`}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span className="flex-1">{action.label}</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
