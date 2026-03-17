function WhatSectionSkeleton() {
    return (
        <section className="bg-background py-16 lg:py-24 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <div className="h-8 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                    <div className="space-y-3 pt-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                        <div className="h-8 w-8 bg-muted rounded shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-4 bg-muted rounded w-1/3" />
                            <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                        </div>
                    ))}
                    </div>
                    <div className="h-12 bg-muted rounded w-40 mt-4" />
                </div>
                <div className="h-96 bg-muted rounded-xl" />
                </div>
            </div>
        </section>
    );
}

export default WhatSectionSkeleton;