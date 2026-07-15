import SupdataLogo from "@/Components/Common/SupdataLogo";

const footerLinks = [
    {
        title: "LIENS",
        links: [
            { label: "Accueil", href: "#accueil" },
            { label: "Fonctionnalités", href: "#fonctionnalites" },
            { label: "Modules", href: "#modules" },
            { label: "Contact", href: "#contact" },
        ],
    },
    {
        title: "MODULES",
        links: [
            { label: "Gestion des achats", href: "#modules" },
            { label: "Gestion des stocks", href: "#modules" },
            { label: "Clients & Agences", href: "#modules" },
            { label: "Inventaires", href: "#modules" },
        ],
    },
    {
        title: "SUPPORT",
        links: [
            { label: "Documentation", href: "#" },
            { label: "FAQ", href: "#faq" },
            { label: "Contact", href: "#" },
            { label: "Statut", href: "#" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-300">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
                    <div className="space-y-6">
                        <a href="#accueil">
                            <SupdataLogo size="sm" variant="light" />
                        </a>
                        <p className="max-w-sm text-sm leading-6 text-slate-400">
                            Le logiciel ERP interne pour piloter achats, stock, clients et agences avec une précision professionnelle.
                        </p>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-3">
                        {footerLinks.map((group) => (
                            <div key={group.title}>
                                <p className="mb-4 text-sm font-semibold uppercase text-slate-200">
                                    {group.title}
                                </p>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    {group.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="transition hover:text-sky-400"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
                    © {new Date().getFullYear()} SUPDATA ERP. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}
