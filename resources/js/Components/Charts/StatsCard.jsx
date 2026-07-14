import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/Components/UI/Card";

export default function StatsCard({ icon: Icon, label, value, unit, trend, trendUp, description, color, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
        >
            <Card className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                        <div className={cn("flex size-11 items-center justify-center rounded-xl", color)}>
                            <Icon className="size-5" />
                        </div>
                        {trend && (
                            <div className={cn(
                                "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                                trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                            )}>
                                {trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                {trend}
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
                            {unit && <p className="text-sm font-medium text-slate-500">{unit}</p>}
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
                        {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
