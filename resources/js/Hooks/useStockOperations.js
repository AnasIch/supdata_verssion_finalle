import { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { stockSectionConfig } from "@/Data/stockSections";

const DEBOUNCE_MS = 300;
const PER_PAGE_OPTIONS = [10, 25, 50, 100];

function parseQuery(url) {
    const params = new URLSearchParams(url.split("?")[1] || "");
    const rawPerPage = parseInt(params.get("perPage") || "10", 10);
    return {
        search: params.get("search") || "",
        agency: params.get("agency") || "Toutes",
        page: Math.max(1, parseInt(params.get("page") || "1", 10) || 1),
        perPage: PER_PAGE_OPTIONS.includes(rawPerPage) ? rawPerPage : 10,
    };
}

export function useStockOperations(section, initialItems = [], initialPagination = {}, options = {}) {
    const config = stockSectionConfig[section] || stockSectionConfig.produits;
    const { url } = usePage();
    const basePath = url.split("?")[0];
    const initial = parseQuery(url);

    const [search, setSearch] = useState(initial.search);
    const [agency, setAgency] = useState(initial.agency);
    const [page, setPage] = useState(initial.page);
    const [perPage, setPerPage] = useState(initial.perPage);
    const [totalPages, setTotalPages] = useState(initialPagination.totalPages || 1);
    const [total, setTotal] = useState(initialPagination.total || 0);
    const timer = useRef(null);

    useEffect(() => {
        setTotalPages(initialPagination.totalPages || 1);
        setTotal(initialPagination.total || 0);
        setPage(initialPagination.currentPage || 1);
    }, [initialPagination.currentPage, initialPagination.totalPages, initialPagination.total]);

    useEffect(() => () => clearTimeout(timer.current), []);

    const navigate = (overrides = {}) => {
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : search;
        const a = overrides.agency !== undefined ? overrides.agency : agency;
        const p = overrides.page !== undefined ? overrides.page : page;
        const pp = overrides.perPage !== undefined ? overrides.perPage : perPage;
        if (s) params.search = s;
        if (a && a !== "Toutes") params.agency = a;
        if (p > 1) params.page = p;
        if (pp && pp !== 10) params.perPage = pp;
        router.get(basePath, params, {
            only: ["initialItems", "initialPagination"],
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (value) => {
        setSearch(value);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => navigate({ search: value, page: 1 }), DEBOUNCE_MS);
    };

    const handleAgency = (value) => {
        setAgency(value);
        navigate({ agency: value, page: 1 });
    };

    const handlePage = (value) => {
        setPage(value);
        navigate({ page: value });
    };

    const handlePerPage = (value) => {
        setPerPage(value);
        setPage(1);
        navigate({ perPage: value, page: 1 });
    };

    const createItem = (values) => section === "mouvements"
        ? router.post('/dashboard-stock/mouvement', { type: values.type, product: values.nom, agency: values.agence, quantity: values.quantite, document_type: values.document_type, document_file: values.document_file }, { preserveScroll: true })
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
        config, section, items: initialItems, search, setSearch: handleSearch, agency, setAgency: handleAgency,
        page, setPage: handlePage, totalPages, total, perPage, setPerPage: handlePerPage,
        createItem, updateItem, deleteItem, transitionItem, canTransition, cancelItem, canCancel,
        reset: () => router.get(basePath, {}, { preserveScroll: true }),
        productOptions: options.products || [], categoryOptions: options.categories || [],
        agencies: options.agencies || [],
    };
}
