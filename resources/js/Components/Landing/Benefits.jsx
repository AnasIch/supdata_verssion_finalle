import { motion } from "framer-motion";
import {
    Layers,
    Activity,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const benefits = [
    {
        icon: Layers,
        title: "Centralisation",
        description:
            "Toutes vos données achats, stocks, clients et agences regroupées dans un seul outil.",
    },
    {
        icon: Activity,
        title: "Suivi en temps réel",
        description:
            "Consultez l'état de chaque demande et chaque niveau de stock en direct.",
    },
    {
        icon: ShieldCheck,
        title: "Réduction des erreurs",
        description:
            "Validation en cascade et contrôle automatisé pour minimiser les erreurs humaines.",
    },
    {
        icon: Sparkles,
        title: "Interface moderne",
        description:
            "Design épuré et intuitif, pensé pour gagner en productivité au quotidien.",
    },
];

export default function Benefits() {
    return (
        <section id="avantages" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Pourquoi choisir SUPDATA ?
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Une solution conçue pour simplifier vos opérations internes.
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <benefit.icon className="size-7" />
                            </div>
                            <h3 className="text-lg font-semibold">{benefit.title}</h3>
                            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
