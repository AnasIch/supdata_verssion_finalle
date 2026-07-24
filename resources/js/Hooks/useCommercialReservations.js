import { useState, useMemo, useCallback } from "react";
import { initialReservations } from "@/Mocks/commercialReservations";
import { stockStore } from "@/Hooks/useCommercialStock";

let nextId = 4;

function today() {
    return new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function useCommercialReservations() {
    const [reservations, setReservations] = useState(initialReservations);

    const stats = useMemo(() => ({
        total: reservations.length,
        reserved: reservations.filter((r) => r.status === "Réservé").length,
        delivered: reservations.filter((r) => r.status === "Livré").length,
        cancelled: reservations.filter((r) => r.status === "Annulé").length,
    }), [reservations]);

    const createReservation = useCallback((data) => {
        const id = `RES-2026-${String(nextId++).padStart(4, "0")}`;
        const product = stockStore.products.find((p) => p.id === data.productId);
        const newReservation = {
            id,
            productId: data.productId,
            clientName: data.clientName,
            productName: product ? product.name : "",
            agency: data.agency,
            quantity: data.quantity,
            date: today(),
            status: "Réservé",
            remark: data.remark || "",
            deliveryDate: null,
        };
        setReservations((prev) => [newReservation, ...prev]);

        stockStore.products = stockStore.products.map((p) => {
            if (p.id !== data.productId) return p;
            const newReserved = p.reservedQuantity + data.quantity;
            const available = p.quantity - newReserved;
            let newStatus = p.status;
            if (available <= 0) newStatus = "out_of_stock";
            else if (available <= p.minThreshold) newStatus = "low";
            else newStatus = "available";
            return { ...p, reservedQuantity: newReserved, status: newStatus };
        });
        stockStore.notify();
    }, []);

    const editReservation = useCallback((id, data) => {
        setReservations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, clientName: data.clientName, quantity: data.quantity, remark: data.remark || "" } : r))
        );
    }, []);

    const deleteReservation = useCallback((id) => {
        setReservations((prev) => {
            const reservation = prev.find((r) => r.id === id);
            if (reservation && reservation.status === "Réservé") {
                stockStore.products = stockStore.products.map((p) => {
                    if (p.id !== reservation.productId) return p;
                    const newReserved = Math.max(0, p.reservedQuantity - reservation.quantity);
                    const available = p.quantity - newReserved;
                    let newStatus = p.status;
                    if (available <= 0) newStatus = "out_of_stock";
                    else if (available <= p.minThreshold) newStatus = "low";
                    else newStatus = "available";
                    return { ...p, reservedQuantity: newReserved, status: newStatus };
                });
                stockStore.notify();
            }
            return prev.filter((r) => r.id !== id);
        });
    }, []);

    const deliverReservation = useCallback((id) => {
        setReservations((prev) => {
            const reservation = prev.find((r) => r.id === id);
            if (reservation) {
                stockStore.products = stockStore.products.map((p) => {
                    if (p.id !== reservation.productId) return p;
                    const newQuantity = Math.max(0, p.quantity - reservation.quantity);
                    const newReserved = Math.max(0, p.reservedQuantity - reservation.quantity);
                    let newStatus = p.status;
                    if (newQuantity <= 0) newStatus = "out_of_stock";
                    else if (newQuantity <= p.minThreshold) newStatus = "low";
                    else newStatus = "available";
                    return { ...p, quantity: newQuantity, reservedQuantity: newReserved, status: newStatus };
                });
                stockStore.notify();
            }
            return prev.map((r) => (r.id === id ? { ...r, status: "Livré", deliveryDate: today() } : r));
        });
    }, []);

    const cancelReservation = useCallback((id) => {
        setReservations((prev) => {
            const reservation = prev.find((r) => r.id === id);
            if (reservation && reservation.status === "Réservé") {
                stockStore.products = stockStore.products.map((p) => {
                    if (p.id !== reservation.productId) return p;
                    const newReserved = Math.max(0, p.reservedQuantity - reservation.quantity);
                    const available = p.quantity - newReserved;
                    let newStatus = p.status;
                    if (available <= 0) newStatus = "out_of_stock";
                    else if (available <= p.minThreshold) newStatus = "low";
                    else newStatus = "available";
                    return { ...p, reservedQuantity: newReserved, status: newStatus };
                });
                stockStore.notify();
            }
            return prev.map((r) => (r.id === id ? { ...r, status: "Annulé" } : r));
        });
    }, []);

    return {
        reservations,
        stats,
        createReservation,
        editReservation,
        deleteReservation,
        deliverReservation,
        cancelReservation,
    };
}
