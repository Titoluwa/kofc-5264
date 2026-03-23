export default function ResourceCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border p-4 space-y-3 animate-pulse">
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-2/3 bg-muted rounded" />
        <div className="h-px bg-border mt-2" />
        <div className="h-3 w-1/3 bg-muted rounded" />
        </div>
    );
}