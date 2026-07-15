import { useMemo, useState } from "react";
import { stockUser, stockStats, stockHealth, movementTrend, stockAlerts, pendingReceptions, inventories, stockActivity } from "@/Mocks/stockDashboard";
export function useStockDashboard() {
    const saved = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("supdata_stock_dashboard") || "null") : null;
    const [agency, setAgency] = useState("Toutes");
    const [alertItems, setAlertItems] = useState(saved?.alerts || stockAlerts);
    const [receptionItems, setReceptionItems] = useState(saved?.receptions || pendingReceptions);
    const [activityItems, setActivityItems] = useState(saved?.activity || stockActivity);
    const persist = (alerts, receptions, activity) => localStorage.setItem("supdata_stock_dashboard", JSON.stringify({ alerts, receptions, activity }));
    const resolveAlert = (id) => { const next = alertItems.filter((item) => item.id !== id); setAlertItems(next); persist(next, receptionItems, activityItems); };
    const validateReception = (id) => {
        const receptions = receptionItems.map((item) => item.id === id ? { ...item, status: "Validée" } : item);
        const source = receptionItems.find((item) => item.id === id);
        const activity = [{ id: Date.now(), type: "Entrée", text: `${source?.items || "Marchandise"} · ${id}`, author: stockUser.name, time: "À l’instant", tone: "success" }, ...activityItems];
        setReceptionItems(receptions); setActivityItems(activity); persist(alertItems, receptions, activity);
    };
    const addMovement = ({ type, quantity, product, agency: movementAgency }) => {
        const sign = type === "Entrée" ? "+" : "−";
        const activity = [{ id: Date.now(), type, text: `${sign}${quantity} ${product} · ${movementAgency}`, author: stockUser.name, time: "À l’instant", tone: type === "Entrée" ? "success" : "warning" }, ...activityItems];
        setActivityItems(activity); persist(alertItems, receptionItems, activity);
    };
    const resetDashboard = () => { setAlertItems(stockAlerts); setReceptionItems(pendingReceptions); setActivityItems(stockActivity); persist(stockAlerts, pendingReceptions, stockActivity); };
    const alerts = useMemo(() => alertItems.filter((a) => agency === "Toutes" || a.agency === agency), [agency, alertItems]);
    const receptions = useMemo(() => receptionItems.filter((r) => agency === "Toutes" || r.agency === agency), [agency, receptionItems]);
    return { user: stockUser, stats: stockStats, health: stockHealth, trend: movementTrend, alerts, receptions, inventories, activity: activityItems, agency, setAgency, resolveAlert, validateReception, addMovement, resetDashboard };
}
