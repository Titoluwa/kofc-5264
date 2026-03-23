
export default function GalleryCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-border animate-pulse">
            <div className="h-48 bg-muted w-full" />
            <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
        </div>
    );
}