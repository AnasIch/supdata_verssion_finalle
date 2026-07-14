import { Link } from "@inertiajs/react";
import SupdataLogo from "@/Components/Common/SupdataLogo";

export default function AuthLogo({ size = "default", variant = "dark" }) {
    return (
        <Link href="/">
            <SupdataLogo size={size} variant={variant} />
        </Link>
    );
}
