import { useMemo } from "react";
import { motion } from "framer-motion";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import { useToast } from "@/Components/UI/Toast";
import CreatePurchaseRequestForm from "@/Components/Commercial/CreatePurchaseRequestForm";
import RequestSummaryCard from "@/Components/Commercial/RequestSummaryCard";

const emptyProductLine = () => ({
    id: Date.now() + Math.random(),
    product: "",
    quantity: 1,
    observation: "",
});

export default function CommercialDemandeCreate({ user, products }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        comment: "",
        priority: "medium",
        products: [emptyProductLine()],
    });

    const toast = useToast();

    const today = useMemo(() => {
        return new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }, []);

    const reference = useMemo(() => {
        const now = new Date();
        return `CMD-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    }, []);

    const summary = useMemo(() => {
        const totalQuantity = data.products.reduce(
            (sum, p) => sum + (Number(p.quantity) || 0),
            0
        );
        return {
            productCount: data.products.length,
            totalQuantity,
            priority: data.priority,
            date: today,
        };
    }, [data.products, data.priority, today]);

    const handleChange = (key, value) => {
        setData(key, value);
    };

    const updateProduct = (id, key, value) => {
        setData(
            "products",
            data.products.map((p) => (p.id === id ? { ...p, [key]: value } : p))
        );
    };

    const addProduct = () => {
        setData("products", [...data.products, emptyProductLine()]);
    };

    const removeProduct = (id) => {
        if (data.products.length <= 1) return;
        setData(
            "products",
            data.products.filter((p) => p.id !== id)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validProducts = data.products
            .filter((p) => p.product && p.quantity > 0)
            .map((p) => {
                const selected = products.find(
                    (db) => String(db.id) === String(p.product)
                );
                return {
                    product: selected
                        ? {
                              id: selected.id,
                              name: selected.name,
                              reference: selected.reference,
                              category: selected.category,
                              unit_price: selected.unit_price,
                          }
                        : { id: p.product, name: "", reference: "", category: "", unit_price: 0 },
                    quantity: Number(p.quantity),
                    observation: p.observation || "",
                };
            });

        if (validProducts.length === 0) {
            toast("Veuillez sélectionner au moins un produit.", "warning");
            return;
        }

        transform(() => ({
            comment: data.comment,
            priority: data.priority,
            products: validProducts,
        }));

        post(route("rc.demandes.store"), {
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    toast(firstError, "error");
                }
            },
            onSuccess: () => transform(null),
        });
    };

    const handleReset = () => {
        setData({
            comment: "",
            priority: "medium",
            products: [emptyProductLine()],
        });
    };

    return (
        <DashboardLayout
            title="Nouvelle demande"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard-commercial" },
                {
                    label: "Demandes d'achat",
                    href: "/dashboard-commercial/demandes",
                },
                { label: "Nouvelle demande" },
            ]}
            user={user}
        >
            <Head title="Nouvelle demande — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PageTitle
                        title="Nouvelle demande d'achat"
                        description={`Référence : ${reference}`}
                        actions={
                            <Button variant="outline" asChild>
                                <Link href={route("rc.demandes")}>
                                    <ArrowLeft className="size-4" />
                                    Retour
                                </Link>
                            </Button>
                        }
                    />
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
                    <CreatePurchaseRequestForm
                        form={data}
                        errors={errors}
                        reference={reference}
                        today={today}
                        user={user}
                        catalogProducts={products}
                        onUpdateProduct={updateProduct}
                        onChange={handleChange}
                        onAddProduct={addProduct}
                        onRemoveProduct={removeProduct}
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                        processing={processing}
                    />
                    <div className="order-first lg:order-last">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.15 }}
                        >
                            <RequestSummaryCard summary={summary} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
