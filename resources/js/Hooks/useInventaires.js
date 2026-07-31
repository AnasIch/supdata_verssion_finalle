import { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";

const DEBOUNCE_MS = 300;
const PER_PAGE_OPTIONS = [10, 25, 50, 100];

export function useInventaires(initial = {}, { remote = true } = {}) {
    const { url } = usePage();
    const basePath = url.split("?")[0];
    const query = new URLSearchParams(url.split("?")[1] || "");
    const initialFilters = initial.filters || {};
    const initialPagination = initial.pagination || {};

    const rawPerPage = parseInt(query.get("perPage") || initialPagination.perPage || "10", 10);

    const [search, setSearch] = useState(query.get("search") ?? initialFilters.search ?? "");
    const [agency, setAgency] = useState(query.get("agency") ?? initialFilters.agency ?? "all");
    const [status, setStatus] = useState(query.get("status") ?? initialFilters.status ?? "all");
    const [date, setDate] = useState(query.get("date") ?? initialFilters.date ?? "");
    const [page, setPage] = useState(Math.max(1, parseInt(query.get("page") || initialPagination.currentPage || "1", 10) || 1));
    const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS.includes(rawPerPage) ? rawPerPage : 10);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    useEffect(() => {
        setPage(initial.pagination?.currentPage || 1);
    }, [initial.pagination?.currentPage]);

    const navigate = (overrides = {}) => {
        if (!remote) return;
        const params = {};
        const s = overrides.search !== undefined ? overrides.search : search;
        const a = overrides.agency !== undefined ? overrides.agency : agency;
        const st = overrides.status !== undefined ? overrides.status : status;
        const d = overrides.date !== undefined ? overrides.date : date;
        const p = overrides.page !== undefined ? overrides.page : page;
        const pp = overrides.perPage !== undefined ? overrides.perPage : perPage;
        if (s) params.search = s;
        if (a && a !== "all") params.agency = a;
        if (st && st !== "all") params.status = st;
        if (d) params.date = d;
        if (p > 1) params.page = p;
        if (pp && pp !== 10) params.perPage = pp;
        router.get(basePath, params, {
            only: ["inventories", "pagination", "stats", "filters"],
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

    const setFilters = (next) => {
        const s = next.search !== undefined ? next.search : search;
        const a = next.agency !== undefined ? next.agency : agency;
        const st = next.status !== undefined ? next.status : status;
        const d = next.date !== undefined ? next.date : date;
        if (s !== search) return handleSearch(s);
        if (a !== agency) {
            setAgency(a);
            navigate({ agency: a, page: 1 });
            return;
        }
        if (st !== status) {
            setStatus(st);
            navigate({ status: st, page: 1 });
            return;
        }
        if (d !== date) {
            setDate(d);
            navigate({ date: d, page: 1 });
        }
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

    const createItem = (values) => router.post("/dashboard-stock/inventaires", values, { preserveScroll: true });
    const updateItem = (id, values) => router.put(`/dashboard-stock/inventaires/${id}`, values, { preserveScroll: true });
    const terminateItem = (id, values) => router.patch(`/dashboard-stock/inventaires/${id}/terminer`, values, { preserveScroll: true });
    const deleteItem = (id) => router.delete(`/dashboard-stock/inventaires/${id}`, { preserveScroll: true });

    return {
        user: initial.user || null,
        inventories: initial.inventories || [],
        stats: Array.isArray(initial.stats) ? initial.stats : [],
        pagination: {
            currentPage: page,
            totalPages: initial.pagination?.totalPages || 1,
            total: initial.pagination?.total || 0,
            perPage,
        },
        agencies: initial.agencies || [],
        responsables: initial.responsables || [],
        products: initial.products || [],
        search, setSearch: handleSearch, agency, setAgency: (v) => { setAgency(v); navigate({ agency: v, page: 1 }); },
        status, setStatus: (v) => { setStatus(v); navigate({ status: v, page: 1 }); },
        date, setDate: (v) => { setDate(v); navigate({ date: v, page: 1 }); },
        page, setPage: handlePage, perPage, setPerPage: handlePerPage, setFilters,
        createItem, updateItem, terminateItem, deleteItem,
        reset: () => router.get(basePath, {}, { preserveScroll: true }),
    };
}
