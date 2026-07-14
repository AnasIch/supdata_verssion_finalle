import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import FloatingElements from "@/Components/Auth/FloatingElements";

export default function Error404() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
            <FloatingElements />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-warning/10"
                >
                    <FileQuestion className="size-10 text-warning" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-7xl font-bold tracking-tight text-foreground/10 sm:text-8xl">
                        404
                    </h1>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight">
                        Page introuvable
                    </h2>
                    <p className="mt-3 max-w-md text-muted-foreground">
                        La page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex flex-wrap justify-center gap-3"
                >
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft data-icon="inline-start" />
                        Retour
                    </Button>
                    <Link href="/">
                        <Button>
                            <Home data-icon="inline-start" />
                            Accueil
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
