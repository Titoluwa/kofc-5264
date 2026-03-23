function NewsletterCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border border-border bg-card animate-pulse flex flex-col">
            <div className="h-48 bg-muted w-full" />
            <div className="flex flex-col flex-1 p-6 space-y-3">
                <div className="h-3 w-1/4 bg-muted rounded-full" />
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
                <div className="pt-4 mt-auto border-t border-border flex justify-between">
                <div className="h-3 w-1/3 bg-muted rounded" />
                <div className="h-3 w-4 bg-muted rounded" />
                </div>
            </div>
        </div>
    )
}

export default NewsletterCardSkeleton;