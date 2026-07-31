import { useState } from "react";
import { Edit3, Eye, FileDown, FileSpreadsheet, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/Components/UI/Button";
import { DataTable } from "@/Components/UI/DataTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/UI/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/UI/DropdownMenu";
import { PaginationBar } from "@/Components/UI/Pagination";
import { InventoryStatusBadge, InventoryTypeBadge } from "./InventoryBadge";

export default function InventoryTable({ inventories, pagination, onPageChange, onPerPageChange, onView, onEdit, onDelete, isLoading = false }) {
    const [deleting, setDeleting] = useState(null);

    const download = (inventory, format) => {
        if (format === "pdf") {
            window.open(`${route("rs.inventaires.show", inventory.id)}?print=1`, "_blank", "noopener");
            return;
        }
        window.location.href = route("rs.inventaires.export", { inventory: inventory.id, format });
    };

    const actions = (row) => (
        <div className="flex items-center justify-end gap-1">
            <Button size="sm" variant="ghost" onClick={() => onView(row)} aria-label={`Consulter ${row.reference}`}>
                <Eye className="size-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit(row)} aria-label={`Modifier ${row.reference}`}>
                <Edit3 className="size-3.5" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" aria-label={`Exporter ${row.reference}`}>
                        <MoreHorizontal className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => download(row, "pdf")}>
                        <FileText className="size-4" />Télécharger PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => download(row, "excel")}>
                        <FileSpreadsheet className="size-4" />Exporter Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => download(row, "csv")}>
                        <FileDown className="size-4" />Exporter CSV
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setDeleting(row)} aria-label={`Supprimer ${row.reference}`}>
                <Trash2 className="size-3.5" />
            </Button>
        </div>
    );

    const columns = [
        { header: "Référence", cell: (r) => <span className="font-mono text-xs font-semibold">{r.reference}</span> },
        { header: "Date", accessorKey: "date" },
        { header: "Agence", accessorKey: "agency" },
        { header: "Responsable", accessorKey: "responsable" },
        { header: "Type", cell: (r) => <InventoryTypeBadge type={r.type} /> },
        { header: "Produits contrôlés", cell: (r) => <span className="font-mono tabular-nums">{r.produits_controles}</span> },
        { header: "Écarts", cell: (r) => r.ecarts > 0 ? <span className="font-mono font-semibold text-amber-600">{r.ecarts}</span> : <span className="font-mono text-slate-400">0</span> },
        { header: "Statut", cell: (r) => <InventoryStatusBadge status={r.status} /> },
        { header: "Actions", cell: actions, className: "text-right" },
    ];

    return (
        <>
            <DataTable columns={columns} data={inventories} isLoading={isLoading} emptyMessage="Aucun inventaire trouvé." />
            <PaginationBar
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                total={pagination.total}
                perPage={pagination.perPage}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
            />

            <Dialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer {deleting?.reference} ?</DialogTitle>
                        <DialogDescription>Cet inventaire et toutes ses lignes seront définitivement supprimés. Cette action est irréversible.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleting(null)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (deleting) onDelete(deleting);
                                setDeleting(null);
                            }}
                        >
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
