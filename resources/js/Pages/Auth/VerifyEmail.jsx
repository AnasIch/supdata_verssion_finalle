import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Loader2, MailCheck, LogOut, RefreshCw } from "lucide-react";
import AuthLayout from "@/Layouts/AuthLayout";
import AuthCard from "@/Components/Auth/AuthCard";
import AuthHeader from "@/Components/Auth/AuthHeader";
import AuthFooter from "@/Components/Auth/AuthFooter";
import { Button } from "@/Components/UI/Button";

export default function VerifyEmail() {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <AuthLayout>
            <Head title="Vérification de l'email — SUPDATA ERP" />

            <AuthCard>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-2 flex justify-center"
                >
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
                        <MailCheck className="size-8 text-blue-600" />
                    </div>
                </motion.div>

                <AuthHeader
                    title="Vérifiez votre email"
                    description="Nous avons envoyé un lien de vérification à votre adresse email. Cliquez sur le lien pour activer votre compte."
                />

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-slate-900 text-[0.95rem] font-semibold text-white shadow-[0_4px_14px_rgb(15,23,42,0.25)] transition-all duration-200 hover:bg-slate-800 hover:shadow-[0_6px_20px_rgb(15,23,42,0.3)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    Renvoyer le lien
                                    <RefreshCw className="size-4" data-icon="inline-end" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </form>

                <AuthFooter>
                    <Link
                        href={route("login")}
                        className="inline-flex items-center justify-center gap-1.5 font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 hover:gap-2"
                    >
                        <LogOut className="size-3.5" />
                        Déconnexion
                    </Link>
                </AuthFooter>
            </AuthCard>
        </AuthLayout>
    );
}
