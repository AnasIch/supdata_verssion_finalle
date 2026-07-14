import { motion } from "framer-motion";
import { Package, ShoppingCart, Users, Building2 } from "lucide-react";

const stats = [
    { label: "Produits gérés", value: "1 248+", icon: Package },
    { label: "Demandes d'achat", value: "356+", icon: ShoppingCart },
    { label: "Clients enregistrés", value: "892+", icon: Users },
    { label: "Agences connectées", value: "12+", icon: Building2 },
];

export default function Statistics() {
    return (
        <section className="border-y bg-muted/30 py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <stat.icon className="size-6" />
                            </div>
                            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
