import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    Bell,
    Search,
    TrendingUp,
    TrendingDown,
    Building2,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    ChevronRight,
} from "lucide-react";

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4 },
    },
};

function MiniSidebar() {
    const navItems = [
        { icon: LayoutDashboard, active: true },
        { icon: Package, active: false },
        { icon: ShoppingCart, active: false },
        { icon: Users, active: false },
        { icon: BarChart3, active: false },
        { icon: Settings, active: false },
    ];
    return (
        <div className="flex h-full w-[52px] flex-col items-center gap-1 border-r border-slate-200/80 bg-slate-50/50 py-3">
            <div className="mb-3 flex size-7 items-center justify-center rounded-lg bg-slate-900">
                <svg viewBox="0 0 32 32" fill="none" className="size-3.5">
                    <rect x="6" y="6" width="9" height="9" rx="2" fill="white" opacity="0.9" />
                    <rect x="17" y="6" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                    <rect x="6" y="17" width="9" height="9" rx="2" fill="white" opacity="0.6" />
                    <rect x="17" y="17" width="9" height="9" rx="2" fill="white" opacity="0.4" />
                </svg>
            </div>
            {navItems.map((item, i) => (
                <div
                    key={i}
                    className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                        item.active
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    }`}
                >
                    <item.icon className="size-4" />
                </div>
            ))}
        </div>
    );
}

function MiniHeader() {
    return (
        <div className="flex h-10 items-center justify-between border-b border-slate-200/80 bg-white px-4">
            <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-slate-800">Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-md text-slate-400">
                    <Search className="size-3.5" />
                </div>
                <div className="relative flex size-6 items-center justify-center rounded-md text-slate-400">
                    <Bell className="size-3.5" />
                    <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-red-500" />
                </div>
                <div className="size-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600" />
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, trend, trendUp, color, delay }) {
    return (
        <motion.div
            variants={fadeUp}
            className="flex-1 rounded-lg border border-slate-200/60 bg-white p-3"
        >
            <div className="mb-2 flex items-center justify-between">
                <div className={`flex size-7 items-center justify-center rounded-md ${color}`}>
                    <Icon className="size-3.5" />
                </div>
                {trendUp !== undefined && (
                    <div className={`flex items-center gap-0.5 text-[0.6rem] font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
                        {trendUp ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-base font-bold text-slate-900">{value}</p>
            <p className="text-[0.65rem] text-slate-500">{label}</p>
        </motion.div>
    );
}

function MiniChart() {
    const bars = [35, 55, 40, 70, 50, 80, 60, 85, 55, 90, 65, 95];
    return (
        <motion.div variants={fadeUp} className="flex-1 rounded-lg border border-slate-200/60 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-[0.7rem] font-semibold text-slate-700">Demandes d'achat</p>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[0.55rem] font-medium text-emerald-600">+12.5%</span>
            </div>
            <div className="flex items-end gap-1 pt-1" style={{ height: 52 }}>
                {bars.map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.4, delay: 0.8 + i * 0.04, ease: "easeOut" }}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-500/80 to-blue-400/60"
                    />
                ))}
            </div>
        </motion.div>
    );
}

function MiniTable() {
    const rows = [
        { id: "#2847", product: "Switch Cisco 2960", qty: "24", status: "Validée", statusColor: "bg-emerald-50 text-emerald-600" },
        { id: "#2846", product: "Câble RJ45 Cat6", qty: "150", status: "En cours", statusColor: "bg-amber-50 text-amber-600" },
        { id: "#2845", product: "Routeur Fortinet", qty: "8", status: "En attente", statusColor: "bg-slate-100 text-slate-600" },
    ];
    return (
        <motion.div variants={fadeUp} className="rounded-lg border border-slate-200/60 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                <p className="text-[0.7rem] font-semibold text-slate-700">Demandes récentes</p>
                <ChevronRight className="size-3 text-slate-400" />
            </div>
            <div className="divide-y divide-slate-100">
                {rows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2">
                        <div className="flex size-5 items-center justify-center rounded bg-slate-100">
                            <ShoppingCart className="size-2.5 text-slate-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.65rem] font-medium text-slate-800">{row.product}</p>
                            <p className="text-[0.55rem] text-slate-400">{row.id} · Qté {row.qty}</p>
                        </div>
                        <span className={`rounded-full px-1.5 py-0.5 text-[0.55rem] font-medium ${row.statusColor}`}>
                            {row.status}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function ActivityFeed() {
    const items = [
        { icon: CheckCircle2, text: "Commande #2847 validée", time: "Il y a 2min", color: "text-emerald-500" },
        { icon: Building2, text: "Stock agence Lyon mis à jour", time: "Il y a 15min", color: "text-blue-500" },
        { icon: Clock, text: "Demande #2846 en attente", time: "Il y a 32min", color: "text-amber-500" },
    ];
    return (
        <motion.div variants={fadeUp} className="rounded-lg border border-slate-200/60 bg-white p-3">
            <p className="mb-2 text-[0.7rem] font-semibold text-slate-700">Activité</p>
            <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <item.icon className={`mt-0.5 size-3 ${item.color}`} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.65rem] text-slate-700">{item.text}</p>
                            <p className="text-[0.55rem] text-slate-400">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default function AuthIllustration() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative"
        >
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-slate-200/50 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] overflow-hidden"
            >
                <div className="flex h-[340px]">
                    <MiniSidebar />
                    <div className="flex flex-1 flex-col">
                        <MiniHeader />
                        <div className="flex-1 overflow-hidden bg-slate-50/30 p-3">
                            <motion.div variants={stagger} className="flex flex-col gap-2.5">
                                <motion.div variants={fadeIn} className="flex gap-2">
                                    <StatCard
                                        icon={Package}
                                        label="Produits"
                                        value="1 248"
                                        trend="+8.2%"
                                        trendUp
                                        color="bg-blue-50 text-blue-600"
                                    />
                                    <StatCard
                                        icon={Users}
                                        label="Clients"
                                        value="892"
                                        trend="+3.1%"
                                        trendUp
                                        color="bg-indigo-50 text-indigo-600"
                                    />
                                    <StatCard
                                        icon={Building2}
                                        label="Agences"
                                        value="12"
                                        color="bg-violet-50 text-violet-600"
                                    />
                                    <StatCard
                                        icon={ShoppingCart}
                                        label="Demandes"
                                        value="34"
                                        trend="-2"
                                        trendUp={false}
                                        color="bg-amber-50 text-amber-600"
                                    />
                                </motion.div>

                                <div className="flex gap-2.5">
                                    <MiniChart />
                                    <ActivityFeed />
                                </div>

                                <MiniTable />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={fadeUp}
                className="absolute -bottom-4 -right-4 rounded-xl border border-slate-200/60 bg-white p-3 shadow-lg"
            >
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[0.7rem] font-semibold text-slate-800">1 248+ produits</p>
                        <p className="text-[0.55rem] text-slate-500">892 clients · 12 agences</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
