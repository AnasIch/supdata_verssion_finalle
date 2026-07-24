import { Users, Building2, Package, ClipboardList, ShoppingCart, Warehouse } from "lucide-react";
import StatCard from "./StatCard";

const defaultStats = { users: 0, agencies: 0, products: 0, demandes: 0, activeProducts: 0, pendingDemandes: 0, totalStockValue: 0 };

export default function DashboardStats({ stats = defaultStats }) {
    const cards = [
        { icon: Users, title: "Utilisateurs", value: stats.users.toLocaleString("fr-FR"), color: "bg-blue-50 text-blue-600" },
        { icon: Building2, title: "Agences", value: stats.agencies.toLocaleString("fr-FR"), color: "bg-indigo-50 text-indigo-600" },
        { icon: Package, title: "Produits", value: stats.products.toLocaleString("fr-FR"), color: "bg-violet-50 text-violet-600" },
        { icon: ClipboardList, title: "Demandes d'achat", value: stats.demandes.toLocaleString("fr-FR"), color: "bg-amber-50 text-amber-600" },
        { icon: ShoppingCart, title: "En attente", value: stats.pendingDemandes.toLocaleString("fr-FR"), color: "bg-emerald-50 text-emerald-600" },
        { icon: Warehouse, title: "Valeur stock", value: (stats.totalStockValue || 0).toLocaleString("fr-FR") + " MAD", color: "bg-cyan-50 text-cyan-600" },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((stat, i) => (
                <StatCard key={stat.title} {...stat} delay={i * 0.05} />
            ))}
        </div>
    );
}
