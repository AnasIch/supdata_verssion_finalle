import { useMemo, useState } from "react";
import { administrativeOperationsData, administrativeSectionConfig } from "@/Mocks/administrativeOperations";

const readItems = (section) => {
    const fallback = administrativeOperationsData[section] || [];
    try {
        const saved = JSON.parse(localStorage.getItem(`supdata_administrative_${section}`) || "null") || fallback;
        return section === "demandes" ? saved.map((item) => item.statut === "Validée"
            ? { ...item, statut: "Validée et transmise", commercialInforme: true, transmission: "Administrateur Local" }
            : item) : saved;
    } catch {
        return fallback;
    }
};

export function useAdministrativeOperations(section) {
    const config = administrativeSectionConfig[section] || administrativeSectionConfig.demandes;
    const storageKey = `supdata_administrative_${section}`;
    const [items, setItems] = useState(() => readItems(section));
    const [search, setSearch] = useState("");
    const [agency, setAgency] = useState("Toutes");
    const save = (next) => { setItems(next); localStorage.setItem(storageKey, JSON.stringify(next)); };
    const filteredItems = useMemo(() => items.filter((item) =>
        (agency === "Toutes" || item.agence === agency) &&
        Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
    ), [agency, items, search]);
    const decide = (id, statut, motif = "") => {
        const request = items.find((item) => item.id === id);

        if (!request) return { ok: false, message: "Demande introuvable." };
        if (statut === "Validée" && request.completude !== 100) {
            return { ok: false, message: "Cette demande est incomplète et ne peut pas être validée." };
        }
        if (statut === "Rejetée" && motif.trim().length < 5) {
            return { ok: false, message: "Le motif du rejet est obligatoire." };
        }

        const traiteLe = new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
        const finalStatus = statut === "Validée" ? "Validée et transmise" : "Rejetée";
        save(items.map((item) => item.id === id ? {
            ...item,
            statut: finalStatus,
            motif: motif.trim(),
            traiteLe,
            commercialInforme: true,
            transmission: statut === "Validée" ? "Administrateur Local" : null,
        } : item));

        if (statut === "Validée") {
            const validationKey = "supdata_administrative_validations";
            let validations = administrativeOperationsData.validations;
            try {
                validations = JSON.parse(localStorage.getItem(validationKey) || "null") || validations;
            } catch {
                validations = administrativeOperationsData.validations;
            }

            if (!validations.some((item) => item.id === request.id)) {
                const nextValidations = [{
                    id: request.id,
                    nom: request.nom,
                    demandeur: request.demandeur,
                    agence: request.agence,
                    montant: request.montant,
                    date: `Transmise le ${traiteLe}`,
                    auteur: "Fatima Zahra El Mansouri",
                    historique: "Informations vérifiées · transmise à l’Administrateur Local · Responsable Commercial informé",
                    statut: "En attente",
                }, ...validations];
                localStorage.setItem(validationKey, JSON.stringify(nextValidations));
            }
        }

        return { ok: true, finalStatus };
    };
    const reset = () => save(administrativeOperationsData[section] || []);
    return { section, config, items: filteredItems, search, setSearch, agency, setAgency, decide, reset };
}
