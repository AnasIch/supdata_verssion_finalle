import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { stockSectionConfig } from "@/Mocks/stockOperations";

export function useStockOperations(section, initialItems = [], initialPagination = { currentPage: 1, totalPages: 1 }, options = {}) {
    const config = stockSectionConfig[section] || stockSectionConfig.produits;
    const [search, setSearch] = useState("");
    const [agency, setAgency] = useState("Toutes");
    const [page, setPage] = useState(initialPagination.currentPage);
    const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
    const { url } = usePage();
    const basePath = url.split("?")[0];

    useEffect(() => { setPage(1); }, [search, agency]);

    useEffect(() => {
        setTotalPages(initialPagination.totalPages);
        setPage(initialPagination.currentPage);
    }, [initialPagination.currentPage, initialPagination.totalPages]);

    useEffect(() => {
        router.reload({
            data: { search, agency, page },
            only: ["initialItems", "initialPagination"],
            preserveScroll: true,
            preserveState: true,
        });
    }, [search, agency, page]);

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
        config, section, items: initialItems, search, setSearch, agency, setAgency,
        page, setPage, totalPages,
        createItem, updateItem, deleteItem, transitionItem, canTransition, cancelItem, canCancel,
        reset: () => router.get(basePath, {}, { preserveScroll: true }),
        productOptions: options.products || [], categoryOptions: options.categories || [],
        agencies: options.agencies || [],
    };
}
