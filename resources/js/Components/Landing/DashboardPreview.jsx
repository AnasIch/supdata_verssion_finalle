import { motion } from "framer-motion";
import {
    BarChart3,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    Bell,
} from "lucide-react";

export default function DashboardPreview() {
    return (
        <section className="border-y bg-muted/30 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Aperçu du Dashboard
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Une interface claire et complète pour piloter vos opérations.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-12 overflow-hidden rounded-xl border bg-card shadow-xl"
                >
                    {/* Window bar */}
                    <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
                        <div className="size-3 rounded-full bg-destructive/80" />
                        <div className="size-3 rounded-full bg-warning/80" />
                        <div className="size-3 rounded-full bg-success/80" />
                        <span className="ml-2 text-xs text-muted-foreground">
                            SUPDATA ERP — Dashboard Admin
                        </span>
                    </div>

                    <div className="flex min-h-[400px]">
                        {/* Sidebar */}
                        <div className="hidden w-56 shrink-0 border-r bg-muted/20 p-4 md:block">
                            <div className="mb-6 flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                                    S
                                </div>
                                <span className="text-sm font-semibold">SUPDATA</span>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {[
                                    { label: "Dashboard", active: true },
                                    { label: "Produits" },
                                    { label: "Stocks" },
                                    { label: "Demandes" },
                                    { label: "Clients" },
                                    { label: "Agences" },
                                    { label: "Utilisateurs" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className={`rounded-md px-3 py-1.5 text-xs ${
                                            item.active
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "text-muted-foreground hover:bg-accent"
                                        }`}
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 p-4 sm:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">Bonjour, Admin</p>
                                    <p className="text-xs text-muted-foreground">
                                        Voici un aperçu de vos opérations.
                                    </p>
                                </div>
                                <Bell className="size-4 text-muted-foreground" />
                            </div>

                            {/* Stat cards */}
                            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                                {[
                                    { icon: Package, label: "Produits", value: "1 248", color: "bg-primary/10 text-primary" },
                                    { icon: ShoppingCart, label: "Demandes", value: "356", color: "bg-warning/10 text-warning" },
                                    { icon: Users, label: "Clients", value: "892", color: "bg-success/10 text-success" },
                                    { icon: TrendingUp, label: "Livraisons", value: "98%", color: "bg-info/10 text-info" },
                                ].map((s) => (
                                    <div
                                        key={s.label}
                                        className="rounded-lg border bg-background p-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`flex size-7 items-center justify-center rounded-md ${s.color}`}>
                                                <s.icon className="size-3.5" />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{s.label}</span>
                                        </div>
                                        <p className="mt-2 text-lg font-bold">{s.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-3 lg:grid-cols-3">
                                {/* Chart */}
                                <div className="rounded-lg border bg-background p-4 lg:col-span-2">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-xs font-medium">Demandes d'achat mensuelles</span>
                                        <BarChart3 className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-end gap-1.5" style={{ height: "120px" }}>
                                        {[35, 55, 40, 70, 50, 85, 60, 75, 55, 90, 65, 80].map(
                                            (h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 rounded-t bg-primary/20"
                                                    style={{ height: `${h}%` }}
                                                >
                                                    <div
                                                        className="rounded-t bg-primary transition-all"
                                                        style={{ height: "60%", marginTop: "auto" }}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
                                        {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"].map(
                                            (m) => (
                                                <span key={m}>{m}</span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Recent activity */}
                                <div className="rounded-lg border bg-background p-4">
                                    <span className="text-xs font-medium">Activité récente</span>
                                    <div className="mt-3 flex flex-col gap-3">
                                        {[
                                            { text: "Demande #456 validée", time: "Il y a 2h" },
                                            { text: "Stock produit P-089 mis à jour", time: "Il y a 3h" },
                                            { text: "Nouveau client ajouté", time: "Il y a 5h" },
                                            { text: "Inventaire terminé — Agence 3", time: "Hier" },
                                            { text: "Livraison #123 réceptionnée", time: "Hier" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <div className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                                                <div>
                                                    <p className="text-[11px] font-medium">{item.text}</p>
                                                    <p className="text-[9px] text-muted-foreground">{item.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
