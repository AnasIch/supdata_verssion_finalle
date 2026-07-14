import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Landing/Navbar";
import Hero from "@/Components/Landing/Hero";
import Statistics from "@/Components/Landing/Statistics";
import Features from "@/Components/Landing/Features";
import Modules from "@/Components/Landing/Modules";
import Workflow from "@/Components/Landing/Workflow";
import DashboardPreview from "@/Components/Landing/DashboardPreview";
import Benefits from "@/Components/Landing/Benefits";
import FAQ from "@/Components/Landing/FAQ";
import CTA from "@/Components/Landing/CTA";
import Footer from "@/Components/Landing/Footer";

export default function LandingIndex() {
    return (
        <>
            <Head title="SUPDATA ERP — Gestion des achats, stocks et clients" />
            <div className="min-h-screen bg-background">
                <Navbar />
                <main>
                    <Hero />
                    <Statistics />
                    <Features />
                    <Modules />
                    <Workflow />
                    <DashboardPreview />
                    <Benefits />
                    <FAQ />
                    <CTA />
                </main>
                <Footer />
            </div>
        </>
    );
}
