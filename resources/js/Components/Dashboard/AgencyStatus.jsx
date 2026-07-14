import { motion } from "framer-motion";
import { Building2, Users, Package, ClipboardList } from "lucide-react";

const agencies = [
    {
        name: "Casablanca",
        users: 18,
        products: 420,
        requests: 87,
        color: "from-blue-500 to-blue-600",
    },
    {
        name: "Marrakech",
        users: 12,
        products: 280,
        requests: 64,
        color: "from-indigo-500 to-indigo-600",
    },
];

export default function AgencyStatus() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.55 }}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
        >
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">État des agences</h3>
                <p className="text-xs text-slate-500">Aperçu des principales agences</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {agencies.map((a) => (
                    <div key={a.name} className="rounded-xl border border-slate-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} text-white`}>
                                <Building2 className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                                    <span className="size-1 rounded-full bg-emerald-400" />
                                    Actif
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-slate-500">
                                    <Users className="size-3" />
                                    <span className="text-xs">Users</span>
                                </div>
                                <p className="mt-0.5 text-lg font-bold text-slate-900">{a.users}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-slate-500">
                                    <Package className="size-3" />
                                    <span className="text-xs">Prod.</span>
                                </div>
                                <p className="mt-0.5 text-lg font-bold text-slate-900">{a.products}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-slate-500">
                                    <ClipboardList className="size-3" />
                                    <span className="text-xs">Demandes</span>
                                </div>
                                <p className="mt-0.5 text-lg font-bold text-slate-900">{a.requests}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
