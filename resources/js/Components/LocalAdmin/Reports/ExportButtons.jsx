import { FileDown, FileSpreadsheet } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export default function ExportButtons() {
    const handleExport = (type) => {
        alert(`Export ${type} — Fonctionnalité à connecter au Backend.`);
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("PDF")}
            >
                <FileDown className="size-4" />
                Export PDF
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("Excel")}
            >
                <FileSpreadsheet className="size-4" />
                Export Excel
            </Button>
        </div>
    );
}
