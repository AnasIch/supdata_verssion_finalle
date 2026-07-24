import { CheckCheck } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export default function NotificationsHeader({ unreadCount, onMarkAllRead, agency }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Notifications
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Alertes et notifications de l'agence {agency || "—"}
                </p>
            </div>
            {unreadCount > 0 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onMarkAllRead}
                >
                    <CheckCheck className="size-4" />
                    Tout marquer comme lu
                </Button>
            )}
        </div>
    );
}
