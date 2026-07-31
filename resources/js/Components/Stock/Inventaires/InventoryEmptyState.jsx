import { ClipboardList, Plus } from "lucide-react";
import { EmptyState } from "@/Components/UI/EmptyState";
import { Button } from "@/Components/UI/Button";

export default function InventoryEmptyState({ onAction }) {
    return (
        <EmptyState
            icon={<ClipboardList className="size-10" />}
            title="Aucun inventaire"
            description="Créez votre premier inventaire pour contrôler les stocks physiques d'une agence."
        >
            <Button onClick={onAction}>
                <Plus className="size-4" />Créer un inventaire
            </Button>
        </EmptyState>
    );
}
