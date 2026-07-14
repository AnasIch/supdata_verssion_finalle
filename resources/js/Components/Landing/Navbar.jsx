import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import SupdataLogo from "@/Components/Common/SupdataLogo";

const navLinks = [
    { label: "Accueil", href: "#accueil" },
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Modules", href: "#modules" },
    { label: "Workflow", href: "#workflow" },
    { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 shadow-sm transition-all duration-300 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <a href="#accueil">
                    <SupdataLogo size="sm" variant="dark" />
                </a>

                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <Button variant="ghost" size="sm" asChild>
                        <a href="/login">Connexion</a>
                    </Button>
                    <Button size="sm" asChild>
                        <a href="#cta">Commencer</a>
                    </Button>
                </div>

                <button
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-b bg-background md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-4 py-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="mt-2 flex flex-col gap-2 border-t pt-2">
                                <a href="/login">
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        Connexion
                                    </Button>
                                </a>
                                <a href="#cta">
                                    <Button size="sm" className="w-full">Commencer</Button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
