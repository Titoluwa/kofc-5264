import { ChevronRight, ChevronLeft } from "lucide-react";
import { PaginationMeta } from "@/lib/constants";

export function PageShowing({ meta }: Readonly<{ meta: PaginationMeta }>) {
    // const start = (page - 1) * totalPages + 1;
    // const end = Math.min(page * totalPages, totalPages);
    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);

    return (
        <p className="text-md text-muted-foreground order-2 sm:order-1">
            Showing{" "}
            <span className="font-semibold text-foreground">{start}–{end}</span>
            {" "}of{" "}
            <span className="font-semibold text-foreground">{meta.total}</span>
            {" "}results
        </p>
    )
}

export default function PublicPagination({ page, totalPages, onPageChange, }: Readonly<{ page: number; totalPages: number; onPageChange: (p: number) => void}>) {
    if (totalPages <= 1) return null

    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
    } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
    }

    return (
        <div className="flex items-center justify-center gap-1.5 mt-14">
        <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent transition-all disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Previous"
        >
            <ChevronLeft  className="w-4 h-4"/>
        </button>

        <div className="flex items-center gap-1">
            {pages.map((p, idx) =>
            p === '...' ? (
                <span key={`e-${idx.toFixed()}`} className="w-10 text-center text-muted-foreground text-sm select-none">···</span>
            ) : (
                <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    p === page
                    ? 'bg-accent text-primary shadow-sm'
                    : 'border border-border text-muted-foreground hover:text-foreground hover:border-accent'
                }`}
                >
                {p}
                </button>
            )
            )}
        </div>

        <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="h-10 w-10 flex items-center justify-center rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent transition-all disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Next"
        >
            <ChevronRight  className="w-4 h-4"/>
        </button>
        </div>
    )
}