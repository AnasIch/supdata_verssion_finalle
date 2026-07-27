import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";

export function useAdministrativeSupplierOrders(initialRequests = []) {
    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();
    const approvals = useMemo(() => initialRequests.filter((item) =>
        Object.values(item).filter(Boolean).join(" ").toLowerCase().includes(query)
    ), [initialRequests, query]);
    const stats = useMemo(() => ({
        approved: initialRequests.length,
        casablanca: initialRequests.filter((item) => item.agency?.includes("Casablanca")).length,
        marrakech: initialRequests.filter((item) => item.agency?.includes("Marrakech")).length,
    }), [initialRequests]);
    return { approvals, search, setSearch, stats, refresh: () => router.reload({ only: ["approvedRequests"] }) };
}
