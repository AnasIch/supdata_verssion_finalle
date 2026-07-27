import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { stockSectionConfig } from "@/Mocks/stockOperations";

export function useStockOperations(section, initialItems = [], options = {}) {
    const config = stockSectionConfig[section] || stockSectionConfig.produits;
    const [search, setSearch] = useState("");
    const [agency, setAgency] = useState("Toutes");
    const filteredItems = useMemo(() => initialItems.filter((item) =>
        (agency === "Toutes" || item.agence === agency || item.agence?.includes(agency))
        && Object.values(item).filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())
    ), [agency, initialItems, search]);

    const createItem = (values) => section === "mouvements"
        ? router.post('/dashboard-stock/mouvement', { type: values.type, product: values.nom, agency: values.agence, quantity: values.quantite }, { preserveScroll: true })
        : router.post(`/dashboard-stock/${section}`, values, { preserveScroll: true });
    const updateItem = (id, values) => router.put(`/dashboard-stock/${section}/${id}`, values, { preserveScroll: true });
    const deleteItem = (id) => router.delete(`/dashboard-stock/${section}/${id}`, { preserveScroll: true });
    const transitionItem = (id) => {
        if (section === "receptions") router.patch(`/dashboard-stock/receptions/${id}/valider`, {}, { preserveScroll: true });
        if (section === "livraisons") router.patch(`/dashboard-stock/livraisons/${id}/livrer`, {}, { preserveScroll: true });
        if (section === "alertes") router.patch(`/dashboard-stock/alertes/${id}/traiter`, {}, { preserveScroll: true });
        return { ok: true };
    };
    const cancelItem = (id, reason) => {
        if (section === "livraisons") router.patch(`/dashboard-stock/livraisons/${id}/annuler`, { cancellation_reason: reason }, { preserveScroll: true });
        return { ok: true };
    };
    const canTransition = (item) => {
        if (section === "receptions") return !["Validée", "En transit"].includes(item.statut);
        if (section === "livraisons") return item.statut === "En préparation";
        if (section === "alertes") return item.statut !== "Traitée";
        return false;
    };
    const canCancel = (item) => section === "livraisons" && item.statut === "En préparation";

    return {
        config, section, items: filteredItems, search, setSearch, agency, setAgency,
        createItem, updateItem, deleteItem, transitionItem, canTransition, cancelItem, canCancel,
        reset: () => router.reload({ only: ["initialItems"] }),
        productOptions: options.products || [], categoryOptions: options.categories || [],
        agencies: options.agencies || [],
    };
}
