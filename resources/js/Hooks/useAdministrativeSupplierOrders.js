import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";

export function useAdministrativeSupplierOrders(initialRequests = [], initialPagination = { currentPage: 1, totalPages: 1 }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(initialPagination.currentPage);
    const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
    const { url } = usePage();
    const basePath = url.split("?")[0];

    useEffect(() => { setPage(1); }, [search]);

    useEffect(() => {
        setTotalPages(initialPagination.totalPages);
        setPage(initialPagination.currentPage);
    }, [initialPagination.currentPage, initialPagination.totalPages]);

    useEffect(() => {
        router.reload({
            data: { search, page },
            only: ["approvedRequests", "initialPagination"],
            preserveScroll: true,
            preserveState: true,
        });
    }, [search, page]);

    const stats = {
        approved: initialRequests.length,
        casablanca: initialRequests.filter((item) => item.agency?.includes("Casablanca")).length,
        marrakech: initialRequests.filter((item) => item.agency?.includes("Marrakech")).length,
    };

    return {
        approvals: initialRequests, search, setSearch,
        page, setPage, totalPages, stats,
        refresh: () => router.get(basePath, {}, { preserveScroll: true }),
    };
}
