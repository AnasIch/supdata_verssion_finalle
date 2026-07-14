import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Users, Lock } from "lucide-react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import PageTitle from "@/Components/Layout/PageTitle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/UI/Card";
import { Badge } from "@/Components/UI/Badge";
import { Skeleton } from "@/Components/UI/Skeleton";
import { roles } from "@/Mocks/roles";

function RolePermSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <Skeleton className="size-12 rounded-xl" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-full" />
            </CardHeader>
            <CardContent className="pb-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 bg-slate-50/50 pt-4">
                <Skeleton className="h-9 w-full rounded-lg" />
            </CardFooter>
        </Card>
    );
}

function RolePermCard({ role, index }) {
    const Icon = role.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
            <Card className="group overflow-hidden transition-shadow duration-200 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)]">
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className={`flex size-12 items-center justify-center rounded-xl ${role.color}`}>
                            <Icon className="size-6" />
                        </div>
                        <Badge variant="outline" className={role.badgeColor}>
                            {role.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                    </div>
                    <CardTitle className="mt-3 text-base">{role.nom}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                        {role.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Users className="size-3.5 text-slate-400" />
                            <span>
                                <span className="font-semibold text-slate-700">{role.nombreUtilisateurs}</span>{" "}
                                utilisateur{role.nombreUtilisateurs !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Lock className="size-3.5 text-slate-400" />
                            <span>
                                <span className="font-semibold text-slate-700">{role.nombrePermissions}</span>{" "}
                                permission{role.nombrePermissions !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="border-t border-slate-100 bg-slate-50/50 pt-4">
                    <a
                        href={`/permissions/${role.id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <Eye className="size-4" />
                        Gérer les permissions
                    </a>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default function PermissionsIndex() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    return (
        <DashboardLayout
            title="Permissions"
            breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Permissions" }]}
        >
            <div className="flex flex-col gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PageTitle
                        title="Gestion des permissions"
                        description="Sélectionnez un rôle pour consulter et modifier ses permissions."
                    />
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <RolePermSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {roles.map((role, i) => (
                            <RolePermCard key={role.id} role={role} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
