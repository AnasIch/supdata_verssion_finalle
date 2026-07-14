import { Users, Building2, Package, ShoppingCart, ClipboardList, Warehouse } from "lucide-react";
import StatCard from "./StatCard";

const stats = [
    { icon: Users, title: "Utilisateurs", value: "48", trend: "+3", trendUp: true, color: "bg-blue-50 text-blue-600" },
    { icon: Building2, title: "Agences", value: "12", trend: "+1", trendUp: true, color: "bg-indigo-50 text-indigo-600" },
    { icon: Package, title: "Produits", value: "1 248", trend: "+8.2%", trendUp: true, color: "bg-violet-50 text-violet-600" },
    { icon: ClipboardList, title: "Demandes d'achat", value: "356", trend: "+12", trendUp: true, color: "bg-amber-50 text-amber-600" },
    { icon: ShoppingCart, title: "Commandes", value: "289", trend: "-2", trendUp: false, color: "bg-emerald-50 text-emerald-600" },
    { icon: Warehouse, title: "Stock global", value: "98.2%", trend: "+0.3%", trendUp: true, color: "bg-cyan-50 text-cyan-600" },
];

export default function DashboardStats() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {stats.map((stat, i) => (
                <StatCard key={stat.title} {...stat} delay={i * 0.05} />
            ))}
        </div>
    );
}
