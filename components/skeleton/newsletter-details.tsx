export default function NewsletterDetailSkeleton() {
    return (
        <main>
            {/* Back bar */}
            <section className="bg-background border-b border-border">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                </div>
            </section>

            {/* Hero image placeholder */}
            <div className="w-full h-80 md:h-96 bg-muted animate-pulse" />

            {/* Content skeleton */}
            <section className="bg-background py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 animate-pulse">
                <div className="h-5 w-24 bg-muted rounded-full" />
                <div className="h-10 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/2 bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="mt-8 space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i.toFixed()} className={`h-4 bg-muted rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
                    ))}
                </div>
                </div>
            </section>
        </main>
    )
}