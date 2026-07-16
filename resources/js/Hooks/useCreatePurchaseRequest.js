import { useState, useCallback, useMemo } from "react";
import { defaultForm, emptyProductLine } from "@/Mocks/commercialCreateRequest";
import { getCurrentUser } from "@/lib/mockAuth";

let counter = 125;

export function useCreatePurchaseRequest() {
    const user = useMemo(() => getCurrentUser(), []);
    const [form, setForm] = useState({ ...defaultForm });
    const [errors, setErrors] = useState({});

    const reference = useMemo(() => `CMD-2026-${String(++counter).padStart(4, "0")}`, []);
    const today = useMemo(() => {
        const now = new Date();
        return now.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    }, []);

    const handleChange = useCallback((key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }, []);

    const addProduct = useCallback(() => {
        setForm((prev) => ({
            ...prev,
            products: [...prev.products, emptyProductLine()],
        }));
    }, []);

    const removeProduct = useCallback((id) => {
        setForm((prev) => ({
            ...prev,
            products: prev.products.filter((p) => p.id !== id),
        }));
    }, []);

    const updateProduct = useCallback((id, key, value) => {
        setForm((prev) => ({
            ...prev,
            products: prev.products.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
        }));
    }, []);

    const summary = useMemo(() => {
        const totalQuantity = form.products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
        return {
            productCount: form.products.length,
            totalQuantity,
            priority: form.priority,
            date: today,
        };
    }, [form.products, form.priority, today]);

    const validate = useCallback(() => {
        const newErrors = {};
        const hasValidProduct = form.products.some((p) => p.product && p.quantity > 0);
        if (!hasValidProduct) newErrors.products = "Ajoutez au moins un produit.";
        if (!form.priority) newErrors.priority = "Sélectionnez une priorité.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form]);

    const reset = useCallback(() => {
        setForm({ ...defaultForm });
        setErrors({});
    }, []);

    return {
        form,
        errors,
        reference,
        today,
        summary,
        user,
        handleChange,
        addProduct,
        removeProduct,
        updateProduct,
        validate,
        reset,
    };
}
