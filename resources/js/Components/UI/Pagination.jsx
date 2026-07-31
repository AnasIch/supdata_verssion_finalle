import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/Components/UI/Button"

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

function getVisiblePages(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const core = new Set([1, current - 1, current, current + 1, total])
    const sorted = [...core].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
    const out = []
    let prev = 0
    for (const p of sorted) {
        if (p - prev > 1) out.push(`ellipsis-${prev}`)
        out.push(p)
        prev = p
    }
    return out
}

const PaginationBar = ({
    currentPage = 1,
    totalPages = 1,
    total = 0,
    perPage = 10,
    onPageChange,
    onPerPageChange,
    className,
}) => {
    const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1))
    const from = total === 0 ? 0 : (safePage - 1) * perPage + 1
    const to = Math.min(safePage * perPage, total)
    const pages = getVisiblePages(currentPage, totalPages)

    return (
        <div
            className={cn(
                "flex flex-col gap-3 border-t border-slate-100 px-4 py-3 lg:flex-row lg:items-center lg:justify-between",
                className
            )}
        >
            <p className="text-xs text-slate-500">
                Affichage de{" "}
                <span className="font-medium text-slate-700">{from}</span>–<span className="font-medium text-slate-700">{to}</span> sur{" "}
                <span className="font-medium text-slate-700">{total}</span> résultat{total > 1 ? "s" : ""}
            </p>
            <div className="flex items-center justify-between gap-4">
                {onPerPageChange && (
                    <label className="flex items-center gap-2 text-xs text-slate-500">
                        Par page
                        <select
                            value={perPage}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                            aria-label="Nombre de résultats par page"
                        >
                            {PER_PAGE_OPTIONS.map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                )}
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationLink
                                    className="size-8"
                                    disabled={currentPage <= 1}
                                    onClick={() => onPageChange(1)}
                                    aria-label="Première page"
                                >
                                    <ChevronsLeft className="size-4" />
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    className="size-8"
                                    disabled={currentPage <= 1}
                                    onClick={() => onPageChange(currentPage - 1)}
                                    aria-label="Page précédente"
                                >
                                    <ChevronLeft className="size-4" />
                                </PaginationLink>
                            </PaginationItem>
                            {pages.map((p) =>
                                typeof p === "string" ? (
                                    <PaginationItem key={p}>
                                        <PaginationEllipsis className="size-8" />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={p}>
                                        <PaginationLink
                                            className="size-8 text-xs"
                                            isActive={p === currentPage}
                                            onClick={() => onPageChange(p)}
                                            aria-label={`Page ${p}`}
                                        >
                                            {p}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            <PaginationItem>
                                <PaginationLink
                                    className="size-8"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => onPageChange(currentPage + 1)}
                                    aria-label="Page suivante"
                                >
                                    <ChevronRight className="size-4" />
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    className="size-8"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => onPageChange(totalPages)}
                                    aria-label="Dernière page"
                                >
                                    <ChevronsRight className="size-4" />
                                </PaginationLink>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    )
}

const Pagination = ({ className, ...props }) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
)

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
    <Button
        aria-current={isActive ? "page" : undefined}
        variant={isActive ? "outline" : "ghost"}
        size={size}
        className={cn("size-9 p-0", className)}
        {...props}
    />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({ className, ...props }) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeft className="size-4" />
        <span>Précédent</span>
    </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>Suivant</span>
        <ChevronRight className="size-4" />
    </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }) => (
    <span
        aria-hidden
        className={cn("flex size-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">More pages</span>
    </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
    PaginationBar,
}
