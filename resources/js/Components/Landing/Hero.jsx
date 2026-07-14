import { motion } from "framer-motion";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export default function Hero() {
    return (
        <section
            id="accueil"
            className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24"
        >
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-success animate-pulse" />
                            ERP Interne — SUPDATA
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Gérez vos{" "}
                            <span className="text-primary">achats</span>,{" "}
                            <span className="text-primary">stocks</span> et{" "}
                            <span className="text-primary">produits</span>
                            <br />
                            en toute simplicité.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg text-muted-foreground lg:mx-0 mx-auto">
                            SUPDATA ERP centralise la gestion des achats, du stock, des clients et
                            des agences. Suivez vos demandes, contrôlez vos inventaires et
                            pilotez vos opérations depuis une interface unique.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                            <Button size="lg">
                                Commencer maintenant
                                <ArrowRight data-icon="inline-end" />
                            </Button>
                            <Button variant="outline" size="lg">
                                <a href="#fonctionnalites">Découvrir</a>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="flex-1 w-full max-w-2xl lg:max-w-none"
                    >
                        <div className="relative rounded-xl border bg-card p-4 shadow-xl sm:p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="size-3 rounded-full bg-destructive/80" />
                                <div className="size-3 rounded-full bg-warning/80" />
                                <div className="size-3 rounded-full bg-success/80" />
                                <span className="ml-2 text-xs text-muted-foreground">Dashboard — SUPDATA ERP</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                    { label: "Produits", value: "1 248", color: "text-primary" },
                                    { label: "Demandes", value: "356", color: "text-warning" },
                                    { label: "Clients", value: "892", color: "text-success" },
                                    { label: "Agences", value: "12", color: "text-info" },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-lg border bg-muted/50 p-3 text-center"
                                    >
                                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                <div className="col-span-2 rounded-lg border bg-muted/30 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium">Demandes d'achat</span>
                                        <BarChart3 className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-end gap-1.5">
                                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-t bg-primary/20"
                                                style={{ height: `${h * 0.5}px` }}
                                            >
                                                <div
                                                    className="rounded-t bg-primary"
                                                    style={{ height: "60%", marginTop: "auto" }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <span className="text-xs font-medium">Activité récente</span>
                                    <div className="mt-2 flex flex-col gap-2">
                                        {["Commande #456", "Stock vérifié", "Client ajouté"].map(
                                            (item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                                >
                                                    <div className="size-1.5 rounded-full bg-primary" />
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
