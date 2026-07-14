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

export default function Breadcrumbs({ items = [] }) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard" className="flex items-center gap-1.5">
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
