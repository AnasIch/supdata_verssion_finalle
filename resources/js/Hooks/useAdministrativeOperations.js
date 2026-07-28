import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { administrativeSectionConfig } from "@/Mocks/administrativeOperations";

export function useAdministrativeOperations(section, initialItems = [], initialPagination = { currentPage: 1, totalPages: 1 }) {
    const config = administrativeSectionConfig[section] || administrativeSectionConfig.demandes;
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

    const decide = (id, statut, motif = "") => {
        if (!id) return { ok: false, message: "Demande introuvable." };
        if (statut === "Rejetée" && motif.trim().length < 5) return { ok: false, message: "Le motif du rejet est obligatoire." };
        router.post(`/dashboard-administrative/demandes/${id}/decision`, {
            decision: statut === "Validée" ? "approved" : "rejected",
            reason: motif,
        }, { preserveScroll: true });
        return { ok: true };
    };

    return {
        section, config, items: initialItems, search, setSearch, agency, setAgency,
        page, setPage, totalPages, decide,
        reset: () => router.get(basePath, {}, { preserveScroll: true }),
    };
}
