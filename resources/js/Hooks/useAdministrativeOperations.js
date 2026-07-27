import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import { administrativeSectionConfig } from "@/Mocks/administrativeOperations";

export function useAdministrativeOperations(section, initialItems = []) {
    const config = administrativeSectionConfig[section] || administrativeSectionConfig.demandes;
    const [search, setSearch] = useState("");
    const [agency, setAgency] = useState("Toutes");
    const items = useMemo(() => initialItems.filter((item) =>
        (agency === "Toutes" || item.agence === agency || item.agence?.includes(agency))
        && Object.values(item).filter(Boolean).join(" ").toLowerCase().includes(search.toLowerCase())
    ), [agency, initialItems, search]);

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
        section, config, items, search, setSearch, agency, setAgency, decide,
        reset: () => router.reload({ only: ["initialItems"] }),
    };
}
