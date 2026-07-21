import { useMemo, useState } from "react";
import { stockOperationsData, stockSectionConfig } from "@/Mocks/stockOperations";

const storageKeyFor = (section) => `supdata_stock_${section}`;

const readItems = (section) => {
    const fallback = stockOperationsData[section] || [];
    if (typeof window === "undefined") return fallback;

    try {
        return JSON.parse(localStorage.getItem(storageKeyFor(section)) || "null") || fallback;
    } catch {
        return fallback;
    }
};

const writeItems = (section, items) => {
    localStorage.setItem(storageKeyFor(section), JSON.stringify(items));
};

const alertIdFor = (productId) => `ALT-${productId.replace(/\D/g, "").slice(-4) || Date.now().toString().slice(-4)}`;

const synchronizeProductAlert = (product, removed = false) => {
    const alerts = readItems("alertes");
    const alertId = alertIdFor(product.id);
    const index = alerts.findIndex((item) => item.productId === product.id || item.id === alertId);

    if (removed || Number(product.quantite) > 0) {
        if (index >= 0 && alerts[index].source === "Détection automatique") {
            writeItems("alertes", alerts.filter((_, itemIndex) => itemIndex !== index));
        }
        return;
    }

    const detectedAlert = {
        id: alertId,
        productId: product.id,
        nom: product.nom,
        detail: "0 disponible · rupture détectée automatiquement",
        agence: product.agence,
        quantite: 0,
        statut: "Rupture",
        source: "Détection automatique",
        detectedAt: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    };
    const nextAlerts = index >= 0
        ? alerts.map((item, itemIndex) => itemIndex === index ? { ...item, ...detectedAlert } : item)
        : [detectedAlert, ...alerts];
    writeItems("alertes", nextAlerts);
};

export function useStockOperations(section) {
    const config = stockSectionConfig[section] || stockSectionConfig.produits;
    const [items, setItems] = useState(() => readItems(section));
    const [search, setSearch] = useState("");
    const [agency, setAgency] = useState("Toutes");

    const save = (next) => {
        setItems(next);
        writeItems(section, next);
    };

    const createItem = (values) => {
        const item = {
            id: `${config.idPrefix || section.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`,
            ...values,
            quantite: Number(values.quantite) || 0,
            statut: config.createStatus || "Brouillon",
            createdAt: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
        };
        save([item, ...items]);
        if (section === "produits") synchronizeProductAlert(item);
        return item;
    };

    const updateItem = (id, values) => {
        const updated = { ...items.find((item) => item.id === id), ...values, quantite: Number(values.quantite) || 0 };
        save(items.map((item) => item.id === id ? updated : item));
        if (section === "produits") synchronizeProductAlert(updated);
        return updated;
    };

    const deleteItem = (id) => {
        const deleted = items.find((item) => item.id === id);
        save(items.filter((item) => item.id !== id));
        if (section === "produits" && deleted) synchronizeProductAlert(deleted, true);
    };

    const canTransition = (item) => {
        if (config.workflow === "reception") return ["À contrôler", "À valider", "Marchandise reçue", "Arrivée"].includes(item.statut);
        if (config.workflow === "livraison") return item.statut !== "Confirmée";
        if (config.workflow === "alerte") return item.statut !== "Commercial informé";
        return false;
    };

    const transitionItem = (id, statut) => {
        const source = items.find((item) => item.id === id);
        if (!source || !canTransition(source)) return { ok: false };

        const now = new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
        const metadata = config.workflow === "reception"
            ? { validatedAt: now, usersNotified: true, notification: `Utilisateurs concernés informés de l’arrivée à ${source.agence}.` }
            : config.workflow === "livraison"
                ? { confirmedAt: now }
                : { commercialNotified: true, notifiedAt: now, notification: "Responsable Commercial informé automatiquement de l’indisponibilité." };
        save(items.map((item) => item.id === id ? { ...item, statut, ...metadata } : item));

        if (config.workflow === "reception") {
            const movements = readItems("mouvements");
            if (!movements.some((movement) => movement.receptionId === id)) {
                writeItems("mouvements", [{
                    id: `MVT-${Date.now().toString().slice(-5)}`,
                    nom: `Entrée · ${source.nom}`,
                    detail: `+${source.quantite} unités · réception ${id}`,
                    agence: source.agence,
                    quantite: Number(source.quantite) || 0,
                    statut: "Validé",
                    receptionId: id,
                    createdAt: now,
                }, ...movements]);
            }
        }

        return { ok: true };
    };

    const reset = () => save(stockOperationsData[section] || []);
    const filteredItems = useMemo(() => items.filter((item) =>
        (agency === "Toutes" || item.agence === agency || item.agence === "Toutes")
        && `${item.id} ${item.nom} ${item.detail} ${item.statut}`.toLowerCase().includes(search.toLowerCase())
    ), [agency, items, search]);

    return {
        config,
        section,
        items: filteredItems,
        search,
        setSearch,
        agency,
        setAgency,
        createItem,
        updateItem,
        deleteItem,
        canTransition,
        transitionItem,
        reset,
    };
}
