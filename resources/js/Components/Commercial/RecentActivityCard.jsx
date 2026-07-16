import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/UI/Card";

const typeStyles = {
    demande: "bg-blue-50 text-blue-600",
    reservation: "bg-violet-50 text-violet-600",
    validation: "bg-emerald-50 text-emerald-600",
    refus: "bg-red-50 text-red-600",
};

export default function RecentActivityCard({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.4 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-900">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <div className="absolute left-[17px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />
                        <div className="flex flex-col gap-4">
                            {data.map((item) => (
                                <div key={item.id} className="relative flex items-start gap-3">
                                    <div className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full ${typeStyles[item.type] || "bg-slate-100 text-slate-600"}`}>
                                        <span className="text-xs font-bold">{item.type.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-slate-900">{item.text}</p>
                                        <p className="text-xs text-slate-500">{item.detail}</p>
                                    </div>
                                    <span className="shrink-0 text-xs text-slate-400">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
