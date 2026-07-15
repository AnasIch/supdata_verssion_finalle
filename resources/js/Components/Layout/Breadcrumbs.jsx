import { Link } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/UI/Breadcrumb";
import { Home } from "lucide-react";
import { getCurrentUser, getDashboardPath } from "@/lib/mockAuth";

export default function Breadcrumbs({ items = [] }) {
    const user = getCurrentUser();
    const homeHref = getDashboardPath(user.role);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={homeHref} className="flex items-center gap-1.5">
                            <Home className="size-3.5" />
                            <span className="hidden sm:inline">Accueil</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {items.map((item, i) => (
                    <BreadcrumbItem key={i}>
                        <BreadcrumbSeparator />
                        {item.href ? (
                            <BreadcrumbLink asChild>
                                <Link href={item.href}>{item.label}</Link>
                            </BreadcrumbLink>
                        ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
