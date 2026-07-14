import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/UI/Button";

export function TablePagination({ currentPage, totalPages, onPageChange, className }) {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-between border-t border-slate-100 px-4 py-3 ${className || ""}`}>
            <p className="text-xs text-slate-500">
                Page {currentPage} sur {totalPages}
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    aria-label="Page précédente"
                >
                    <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                        key={p}
                        variant={p === currentPage ? "outline" : "ghost"}
                        size="icon"
                        className="size-7 text-xs"
                        onClick={() => onPageChange(p)}
                        aria-label={`Page ${p}`}
                        aria-current={p === currentPage ? "page" : undefined}
                    >
                        {p}
                    </Button>
                ))}
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    aria-label="Page suivante"
                >
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
