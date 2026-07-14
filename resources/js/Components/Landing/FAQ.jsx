import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "Qu'est-ce que SUPDATA ERP ?",
        answer:
            "SUPDATA ERP est un ERP interne dédié à la gestion des achats, du stock, des clients et des agences. Il centralise toutes vos opérations dans une seule interface.",
    },
    {
        question: "Qui peut utiliser SUPDATA ERP ?",
        answer:
            "SUPDATA ERP est destiné aux équipes opérationnelles : gestionnaires de stock, responsables des achats, administrateurs et chefs d'agence. Chaque rôle dispose d'un tableau de bord adapté.",
    },
    {
        question: "Comment fonctionne le workflow d'achat ?",
        answer:
            "Le workflow suit 6 étapes : création de la demande, validation administrative, validation du Chef des opérations, préparation du stock, livraison et clôture. Chaque étape est tracée.",
    },
    {
        question: "Peut-on gérer plusieurs agences ?",
        answer:
            "Oui. SUPDATA ERP supporte la gestion multi-agences. Chaque agence peut avoir ses propres stocks, clients et inventaires, tout en étant centralisée dans un seul outil.",
    },
    {
        question: "Les données sont-elles sécurisées ?",
        answer:
            "Oui. Chaque utilisateur dispose de droits d'accès basés sur son rôle. L'authentification et l'autorisation sont gérées à chaque étape du workflow.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section id="faq" className="border-y bg-muted/30 py-16 lg:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Questions fréquentes
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Tout ce que vous devez savoir sur SUPDATA ERP.
                    </p>
                </motion.div>

                <div className="mt-10 flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="rounded-lg border bg-card"
                        >
                            <button
                                className="flex w-full items-center justify-between p-4 text-left text-sm font-medium"
                                onClick={() =>
                                    setOpenIndex(openIndex === i ? null : i)
                                }
                            >
                                {faq.question}
                                <ChevronDown
                                    className={cn(
                                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                                        openIndex === i && "rotate-180"
                                    )}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 text-sm text-muted-foreground">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
