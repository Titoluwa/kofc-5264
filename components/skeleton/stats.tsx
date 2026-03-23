export default function StatCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-8 w-12 bg-muted rounded" />
        </div>
    );
}
