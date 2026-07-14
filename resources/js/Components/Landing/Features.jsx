import { motion } from "framer-motion";
import {
    ShoppingCart,
    Package,
    BoxesIcon,
    Tags,
    ClipboardCheck,
    BarChart3,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/UI/Card";

const features = [
    {
        icon: ShoppingCart,
        title: "Gestion des achats",
        description:
            "Créez et suivez vos demandes d'achat. Validation en cascade jusqu'à la livraison.",
    },
    {
        icon: BoxesIcon,
        title: "Gestion des stocks",
        description:
            "Consultez les niveaux de stock en temps réel. Notifications d'alerte sur les seuils critiques.",
    },
    {
        icon: Package,
        title: "Gestion des produits",
        description:
            "Catalogue complet avec catégories, descriptions et prix. Recherche et filtrage avancés.",
    },
    {
        icon: Tags,
        title: "Gestion des catégories",
        description:
            "Organisez vos produits par catégories. Hiérarchie flexible et personnalisable.",
    },
    {
        icon: ClipboardCheck,
        title: "Inventaires",
        description:
            "Lancez des inventaires périodiques. Comparaison automatique stock réel vs stock théorique.",
    },
    {
        icon: BarChart3,
        title: "Tableaux de bord",
        description:
            "Tableaux de bord personnalisés par rôle. KPIs, graphiques et statistiques en un clin d'œil.",
    },
];

export default function Features() {
    return (
        <section id="fonctionnalites" className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Capacités centrales
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Tout ce dont vous avez besoin pour gérer vos opérations internes.
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                        >
                            <Card className="h-full transition-shadow hover:shadow-md">
                                <CardHeader>
                                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <feature.icon className="size-5" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
