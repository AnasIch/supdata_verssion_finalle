import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import StockDetails from "@/Components/Stock/StockDetails";

export default function LocalAdminStockShow({ user, product }) {
    return (
        <DashboardLayout
            title={product.name}
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-admin-local" },
                { label: "Stock", href: "/dashboard-admin-local/stock" },
                { label: product.reference },
            ]}
            user={user}
        >
            <Head title={`${product.name} — SUPDATA`} />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title={product.name}
                        description={`Détail du produit ${product.reference}`}
                    />
                    <Button variant="outline" asChild>
                        <Link href="/dashboard-admin-local/stock">
                            <ArrowLeft className="size-4" />
                            Retour à la liste
                        </Link>
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                >
                    <StockDetails product={product} />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
