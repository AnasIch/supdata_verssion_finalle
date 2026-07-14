import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export default function CTA() {
    return (
        <section id="cta" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center sm:px-16"
                >
                    <div className="absolute -left-20 -top-20 size-64 rounded-full bg-primary-foreground/10" />
                    <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-primary-foreground/10" />

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                            Prêt à simplifier vos opérations ?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                            Rejoignez les équipes qui utilisent SUPDATA ERP pour gérer leurs
                            achats, stocks et clients efficacement.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-background text-foreground hover:bg-background/90"
                            >
                                Commencer maintenant
                                <ArrowRight data-icon="inline-end" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                            >
                                Nous contacter
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
