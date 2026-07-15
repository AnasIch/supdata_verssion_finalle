import { motion } from "framer-motion";
import { ClipboardList, Package, Clock, BarChart3, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

const iconMap = {
    "Voir les demandes": ClipboardList,
    "Consulter le stock": Package,
    "Historique": Clock,
    "Rapports": BarChart3,
};

export default function QuickActionsCard({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.6 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">
                        Raccourcis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        {data.map((action) => {
                            const Icon = iconMap[action.label] || ClipboardList;
                            return (
                                <button
                                    key={action.label}
                                    type="button"
                                    className={`group flex items-center gap-3 rounded-xl p-3 text-left text-sm font-medium transition-colors duration-150 ${action.color}`}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span className="flex-1">{action.label}</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
