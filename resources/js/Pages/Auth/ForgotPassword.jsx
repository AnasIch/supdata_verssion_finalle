import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Loader2, Mail, ArrowLeft, Send } from "lucide-react";
import AuthLayout from "@/Layouts/AuthLayout";
import AuthCard from "@/Components/Auth/AuthCard";
import AuthHeader from "@/Components/Auth/AuthHeader";
import AuthFooter from "@/Components/Auth/AuthFooter";
import { AuthInput } from "@/Components/Auth/AuthInput";
import { Button } from "@/Components/UI/Button";
import { Label } from "@/Components/UI/Label";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"), {
            onFinish: () => reset("email"),
        });
    };

    return (
        <AuthLayout>
            <Head title="Mot de passe oublié — SUPDATA ERP" />

            <AuthCard>
                <AuthHeader
                    title="Mot de passe oublié"
                    description="Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe."
                />

                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700"
                    >
                        {status}
                    </motion.div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-2"
                    >
                        <Label htmlFor="email">Adresse email</Label>
                        <AuthInput
                            id="email"
                            type="email"
                            icon={Mail}
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="vous@exemple.com"
                            autoComplete="email"
                            autoFocus
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-destructive"
                            >
                                {errors.email}
                            </motion.p>
                        )}
                    </motion.div>

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
                                    Envoyer le lien
                                    <Send className="size-4" data-icon="inline-end" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </form>

                <AuthFooter>
                    <Link
                        href={route("login")}
                        className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition-colors duration-200 hover:text-slate-900 hover:gap-2"
                    >
                        <ArrowLeft className="size-3.5" />
                        Retour à la connexion
                    </Link>
                </AuthFooter>
            </AuthCard>
        </AuthLayout>
    );
}
