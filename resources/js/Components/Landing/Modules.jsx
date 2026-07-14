import { motion } from "framer-motion";
import {
    Package,
    Tags,
    Users,
    ShoppingCart,
    BoxesIcon,
    ClipboardCheck,
    UserCog,
    Building2,
} from "lucide-react";
import { Badge } from "@/Components/UI/Badge";

const modules = [
    { icon: Package, name: "Produits", description: "Catalogue complet" },
    { icon: Tags, name: "Catégories", description: "Organisation hiérarchique" },
    { icon: Users, name: "Clients", description: "Base de données centralisée" },
    { icon: ShoppingCart, name: "Demandes d'achat", description: "Workflow de validation" },
    { icon: BoxesIcon, name: "Stocks", description: "Suivi en temps réel" },
    { icon: ClipboardCheck, name: "Inventaires", description: "Contrôle périodique" },
    { icon: UserCog, name: "Utilisateurs", description: "Gestion des accès" },
    { icon: Building2, name: "Agences", description: "Multi-sites" },
];

export default function Modules() {
    return (
        <section id="modules" className="border-y bg-muted/30 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <Badge variant="secondary" className="mb-3">Modules</Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Tous vos modules, un seul outil
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Chaque module est pensé pour couvrir un besoin opérationnel précis.
                    </p>
                </motion.div>

                <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {modules.map((mod, i) => (
                        <motion.div
                            key={mod.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            whileHover={{ y: -4 }}
                            className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <mod.icon className="size-6" />
                            </div>
                            <div>
                                <p className="font-semibold">{mod.name}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {mod.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
