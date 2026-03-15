import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/lib/constants";

export default function Pagination({ meta, onPageChange }: Readonly<{ meta: PaginationMeta; onPageChange: (page: number) => void; }>) {
    if (meta.totalPages <= 1) return null;

    const pages: (number | '...')[] = [];
    const { page, totalPages } = meta;

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
    }

    return (
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {pages.map((pageNum, idx) =>
                    pageNum === '...' ? (
                        <span key={`${idx + 1}`} className="px-2 text-muted-foreground text-sm">…</span>
                    ) : (
                        <Button key={pageNum} variant={pageNum === page ? 'default' : 'outline'} size="icon" className="h-8 w-8 text-xs" onClick={() => onPageChange(pageNum)} >
                            {pageNum}
                        </Button>
                    )
                )}

                <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}