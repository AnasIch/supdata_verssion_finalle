import { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Button } from "@/Components/UI/Button";
import AgencesStats from "@/Components/Agences/AgencesStats";
import AgencesTable from "@/Components/Agences/AgencesTable";
import AgenceDetailDialog from "@/Components/Agences/AgenceDetailDialog";

const initialAgences = [
    { id: 1, name: "SUPDATA Casablanca", city: "Casablanca", director: "Youssef Alami", directorEmail: "youssef@supdata.fr", phone: "+212 5 22 00 00 01", address: "123 Boulevard Mohammed V, Casablanca", userCount: 12, stockItems: 342, status: "active", createdAt: "10 jan. 2024" },
    { id: 2, name: "SUPDATA Marrakech", city: "Marrakech", director: "Fatima Zahra Benani", directorEmail: "fatima@supdata.fr", phone: "+212 5 24 00 00 02", address: "45 Avenue Hassan II, Marrakech", userCount: 8, stockItems: 215, status: "active", createdAt: "15 fév. 2024" },
    { id: 3, name: "SUPDATA Rabat", city: "Rabat", director: "Omar Tazi", directorEmail: "omar@supdata.fr", phone: "+212 5 37 00 00 03", address: "78 Avenue Mohammed V, Rabat", userCount: 10, stockItems: 289, status: "active", createdAt: "1 mar. 2024" },
    { id: 4, name: "SUPDATA Tanger", city: "Tanger", director: "Sara Idrissi", directorEmail: "sara@supdata.fr", phone: "+212 5 39 00 00 04", address: "12 Rue de la Liberté, Tanger", userCount: 6, stockItems: 178, status: "active", createdAt: "20 mar. 2024" },
    { id: 5, name: "SUPDATA Fès", city: "Fès", director: "Karim Berrada", directorEmail: "karim@supdata.fr", phone: "+212 5 35 00 00 05", address: "56 Avenue des FAR, Fès", userCount: 7, stockItems: 194, status: "active", createdAt: "15 avr. 2024" },
    { id: 6, name: "SUPDATA Agadir", city: "Agadir", director: "Leila Chraibi", directorEmail: "leila@supdata.fr", phone: "+212 5 28 00 00 06", address: "33 Boulevard Mohammed V, Agadir", userCount: 5, stockItems: 123, status: "inactive", createdAt: "10 mai 2024" },
];

export default function AgencesIndex() {
    const [agences] = useState(initialAgences);
    const [search, setSearch] = useState("");
    const [detailTarget, setDetailTarget] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filtered = useMemo(() => {
        if (!search) return agences;
        const q = search.toLowerCase();
        return agences.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.city.toLowerCase().includes(q) ||
                a.director.toLowerCase().includes(q)
        );
    }, [agences, search]);

    const handleViewDetails = (agence) => {
        setDetailTarget(agence);
        setDetailOpen(true);
    };

    return (
        <DashboardLayout
            title="Agences"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Agences" }]}
        >
            <Head title="Gestion des agences — SUPDATA" />
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <PageTitle
                        title="Gestion des agences"
                        description="Consultez et gérez les agences SUPDATA."
                    />
                    <Button className="w-full sm:w-auto" disabled>
                        <Building2 className="size-4" />
                        Nouvelle agence
                    </Button>
                </motion.div>

                <AgencesStats agences={agences} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <input
                        type="text"
                        placeholder="Rechercher une agence..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-[0_1px_2px_rgb(0,0,0,0.04)] placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 sm:max-w-xs"
                    />
                    <p className="text-sm text-slate-500">
                        {filtered.length} agence{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <AgencesTable agences={filtered} onViewDetails={handleViewDetails} />
            </div>

            <AgenceDetailDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                agence={detailTarget}
            />
        </DashboardLayout>
    );
}
