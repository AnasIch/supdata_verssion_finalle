import { useMemo, useState } from "react";
import { administrativeUser, administrativeStats, administrativeRequests, administrativeFlow, administrativeTrend, supplierOrders, administrativeNotifications } from "@/Mocks/administrativeDashboard";

export function useAdministrativeDashboard() {
    const saved = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("supdata_administrative_dashboard") || "null") : null;
    const [agency, setAgency] = useState("Toutes");
    const [query, setQuery] = useState("");
    const [requestItems, setRequestItems] = useState(saved?.requests || administrativeRequests);
    const [orderItems, setOrderItems] = useState(saved?.orders || supplierOrders);
    const persist = (requests, orders) => localStorage.setItem("supdata_administrative_dashboard", JSON.stringify({ requests, orders }));
    const updateRequest = (id, status, reason = "") => {
        const next = requestItems.map((item) => item.id === id ? { ...item, status, rejectionReason: reason, processedAt: new Date().toLocaleString("fr-FR") } : item);
        setRequestItems(next); persist(next, orderItems);
    };
    const prepareOrder = (id) => {
        const next = orderItems.map((item) => item.id === id ? { ...item, status: "Préparée" } : item);
        setOrderItems(next); persist(requestItems, next);
    };
    const resetDashboard = () => { setRequestItems(administrativeRequests); setOrderItems(supplierOrders); persist(administrativeRequests, supplierOrders); };
    const requests = useMemo(() => requestItems.filter((item) =>
        (agency === "Toutes" || item.agency === agency) &&
        `${item.id} ${item.requester} ${item.client}`.toLowerCase().includes(query.toLowerCase())
    ), [agency, query, requestItems]);

    return { user: administrativeUser, stats: administrativeStats, requests, flow: administrativeFlow, trend: administrativeTrend, supplierOrders: orderItems, notifications: administrativeNotifications, agency, setAgency, query, setQuery, updateRequest, prepareOrder, resetDashboard };
}
