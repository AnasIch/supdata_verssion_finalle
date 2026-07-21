import { useMemo, useState } from "react";
import {
    stockUser,
    stockStats,
    stockHealth,
    movementTrend,
    stockAlerts,
    pendingReceptions,
    inventories,
    stockActivity,
} from "@/Mocks/stockDashboard";

const STORAGE_KEY = "supdata_stock_dashboard";

const readSaved = () => {
    if (typeof window === "undefined") return null;
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
        return null;
    }
};

export function useStockDashboard() {
    const saved = readSaved();
    const [agency, setAgency] = useState("Toutes");
    const [alertItems, setAlertItems] = useState(saved?.alerts || stockAlerts);
    const [receptionItems, setReceptionItems] = useState(saved?.receptions || pendingReceptions);
    const [activityItems, setActivityItems] = useState(saved?.activity || stockActivity);

    const persist = (alerts, receptions, activity) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ alerts, receptions, activity }));

    const resolveAlert = (id) => {
        const source = alertItems.find((item) => item.id === id);
        if (!source) return { ok: false };
        const nextAlerts = alertItems.filter((item) => item.id !== id);
        const activity = [{
            id: Date.now(),
            type: "Alerte",
            text: `${source.product} indisponible · Responsable Commercial informé automatiquement`,
            author: "Système",
            time: "À l’instant",
            tone: "danger",
        }, ...activityItems];
        setAlertItems(nextAlerts);
        setActivityItems(activity);
        persist(nextAlerts, receptionItems, activity);
        return { ok: true };
    };

    const validateReception = (id) => {
        const source = receptionItems.find((item) => item.id === id);
        if (!source || source.status === "En transit" || source.status === "Validée") return { ok: false };
        const now = new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
        const receptions = receptionItems.map((item) => item.id === id ? {
            ...item,
            status: "Validée",
            validatedAt: now,
            usersNotified: true,
        } : item);
        const activity = [{
            id: Date.now(),
            type: "Entrée",
            text: `${source.items} · arrivée à ${source.agency} · utilisateurs concernés informés`,
            author: stockUser.name,
            time: "À l’instant",
            tone: "success",
        }, ...activityItems];
        setReceptionItems(receptions);
        setActivityItems(activity);
        persist(alertItems, receptions, activity);
        return { ok: true };
    };

    const addMovement = ({ type, quantity, product, agency: movementAgency }) => {
        const sign = type === "Entrée" ? "+" : "−";
        const activity = [{
            id: Date.now(),
            type,
            text: `${sign}${quantity} ${product} · ${movementAgency}`,
            author: stockUser.name,
            time: "À l’instant",
            tone: type === "Entrée" ? "success" : "warning",
        }, ...activityItems];
        setActivityItems(activity);
        persist(alertItems, receptionItems, activity);
    };

    const resetDashboard = () => {
        setAlertItems(stockAlerts);
        setReceptionItems(pendingReceptions);
        setActivityItems(stockActivity);
        persist(stockAlerts, pendingReceptions, stockActivity);
    };

    const alerts = useMemo(() => alertItems.filter((item) => agency === "Toutes" || item.agency === agency), [agency, alertItems]);
    const receptions = useMemo(() => receptionItems.filter((item) => agency === "Toutes" || item.agency === agency), [agency, receptionItems]);

    return {
        user: stockUser,
        stats: stockStats,
        health: stockHealth,
        trend: movementTrend,
        alerts,
        receptions,
        inventories,
        activity: activityItems,
        agency,
        setAgency,
        resolveAlert,
        validateReception,
        addMovement,
        resetDashboard,
    };
}
