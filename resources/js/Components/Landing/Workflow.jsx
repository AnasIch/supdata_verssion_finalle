import { motion } from "framer-motion";
import {
    FilePlus,
    ShieldCheck,
    ClipboardCheck,
    PackageCheck,
    Truck,
    CircleCheckBig,
} from "lucide-react";

const steps = [
    {
        icon: FilePlus,
        title: "Création de la demande",
        description: "L'utilisateur soumet une demande d'achat.",
    },
    {
        icon: ShieldCheck,
        title: "Validation administrative",
        description: "Vérification budgétaire et conformité.",
    },
    {
        icon: ClipboardCheck,
        title: "Validation Chef des opérations",
        description: "Approbation finale par le responsable.",
    },
    {
        icon: PackageCheck,
        title: "Préparation du stock",
        description: "Préparation et vérification des articles.",
    },
    {
        icon: Truck,
        title: "Livraison",
        description: "Réception et contrôle de la livraison.",
    },
    {
        icon: CircleCheckBig,
        title: "Clôture",
        description: "Clôture de la demande et mise à jour du stock.",
    },
];

export default function Workflow() {
    return (
        <section id="workflow" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Workflow d'achat
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Un processus clair et traçable, de la demande à la clôture.
                    </p>
                </motion.div>

                {/* Desktop: horizontal timeline */}
                <div className="mt-12 hidden lg:block">
                    <div className="relative">
                        <div className="absolute left-0 right-0 top-6 h-0.5 bg-border" />
                        <div className="grid grid-cols-6 gap-4">
                            {steps.map((step, i) => (
                                <motion.div
                                    key={step.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="relative flex flex-col items-center text-center"
                                >
                                    <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
                                        <span className="text-xs font-bold">{i + 1}</span>
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-semibold text-sm">{step.title}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile: vertical timeline */}
                <div className="mt-12 flex flex-col gap-0 lg:hidden">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.08 }}
                            className="flex gap-4"
                        >
                            <div className="flex flex-col items-center">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
                                    <span className="text-xs font-bold">{i + 1}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-border" />
                                )}
                            </div>
                            <div className="pb-8">
                                <p className="font-semibold text-sm">{step.title}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
