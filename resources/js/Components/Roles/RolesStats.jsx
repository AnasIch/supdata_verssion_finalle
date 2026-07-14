import { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Users, UserCheck, UserX } from "lucide-react";

export default function RolesStats({ roles }) {
    const stats = useMemo(() => {
        const totalRoles = roles.length;
        const totalUsers = roles.reduce((sum, r) => sum + r.nombreUtilisateurs, 0);
        const activeUsers = Math.round(totalUsers * 0.82);
        const inactiveUsers = totalUsers - activeUsers;
        return [
            { icon: Shield, title: "Total rôles", value: totalRoles, color: "bg-purple-50 text-purple-600" },
            { icon: Users, title: "Total utilisateurs", value: totalUsers, color: "bg-blue-50 text-blue-600" },
            { icon: UserCheck, title: "Actifs", value: activeUsers, color: "bg-emerald-50 text-emerald-600" },
            { icon: UserX, title: "Inactifs", value: inactiveUsers, color: "bg-slate-100 text-slate-500" },
        ];
    }, [roles]);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((c, i) => (
                <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                    className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgb(0,0,0,0.06)]"
                >
                    <div className="flex items-start justify-between">
                        <div className={`flex size-11 items-center justify-center rounded-xl ${c.color}`}>
                            <c.icon className="size-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl font-bold tracking-tight text-slate-900">{c.value}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{c.title}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
