import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCard({ icon: Icon, title, value, trend, trendUp, color, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)]"
        >
            <div className="flex items-start justify-between">
                <div className={cn("flex size-11 items-center justify-center rounded-xl", color)}>
                    <Icon className="size-5" />
                </div>
                {trend && (
                    <div
                        className={cn(
                            "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                            trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                        )}
                    >
                        {trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {trend}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
                <p className="mt-0.5 text-sm text-slate-500">{title}</p>
            </div>
        </motion.div>
    );
}
