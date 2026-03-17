import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Pagination({
  meta,
  onPageChange,
}: Readonly<{ meta: PaginationMeta; onPageChange: (page: number) => void }>) {
  if (meta.totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  const { page, totalPages } = meta;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (page >= totalPages - 3) {
    pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
  }

  const start = (page - 1) * meta.limit + 1;
  const end = Math.min(page * meta.limit, meta.total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-2 border-t border-border">

      {/* Count label */}
      <p className="text-xs text-muted-foreground order-2 sm:order-1">
        Showing{" "}
        <span className="font-semibold text-foreground">{start}–{end}</span>
        {" "}of{" "}
        <span className="font-semibold text-foreground">{meta.total}</span>
        {" "}results
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">

        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        {/* Page numbers */}
        {pages.map((pageNum, idx) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${idx.toFixed()}`}
              className="w-8 flex items-center justify-center text-muted-foreground text-sm select-none"
            >
              ···
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={pageNum === page ? "page" : undefined}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-medium transition-all duration-150 select-none",
                pageNum === page
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border"
              )}
            >
              {pageNum}
            </button>
          )
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}