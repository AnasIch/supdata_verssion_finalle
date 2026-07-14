import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import AuthLayout from "@/Layouts/AuthLayout";
import AuthCard from "@/Components/Auth/AuthCard";
import AuthHeader from "@/Components/Auth/AuthHeader";
import AuthFooter from "@/Components/Auth/AuthFooter";
import { AuthInput } from "@/Components/Auth/AuthInput";
import { PasswordInput } from "@/Components/Auth/PasswordInput";
import { Button } from "@/Components/UI/Button";
import { Checkbox } from "@/Components/UI/Checkbox";
import { Label } from "@/Components/UI/Label";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <AuthLayout>
            <Head title="Connexion — SUPDATA ERP" />

            <AuthCard>
                <AuthHeader
                    title="Bienvenue"
                    description="Connectez-vous pour accéder à votre espace de travail."
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
                        className="space-y-2"
                    >
                        <Label htmlFor="email">Adresse email</Label>
                        <AuthInput
                            id="email"
                            type="email"
                            icon={Mail}
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="vous@exemple.com"
                            autoComplete="username"
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
                        className="space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Mot de passe</Label>
                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                        />
                        {errors.password && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-destructive"
                            >
                                {errors.password}
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2"
                    >
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) =>
                                setData("remember", !!checked)
                            }
                        />
                        <Label
                            htmlFor="remember"
                            className="cursor-pointer text-sm font-normal text-slate-600"
                        >
                            Se souvenir de moi
                        </Label>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-slate-900 text-[0.95rem] font-semibold text-white shadow-[0_4px_14px_rgb(15,23,42,0.25)] transition-all duration-200 hover:bg-slate-800 hover:shadow-[0_6px_20px_rgb(15,23,42,0.3)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                                    Connexion...
                                </>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight className="size-4" data-icon="inline-end" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </form>

                <AuthFooter>
                    <p className="text-slate-400">
                        Seuls les comptes autorisés peuvent accéder à l'application.
                    </p>
                </AuthFooter>
            </AuthCard>
        </AuthLayout>
    );
}
