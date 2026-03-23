export default function PagesSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i.toFixed()} className="rounded-2xl border border-border p-5 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                    </div>
                    <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded-lg" />
                    <div className="h-8 w-8 bg-muted rounded-lg" />
                    <div className="h-8 w-20 bg-muted rounded-lg" />
                    </div>
                </div>
                </div>
            ))}
        </div>
    );
}