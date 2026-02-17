import Link from 'next/link'

export const metadata = {
    title: 'Resources',
    description: 'Resources for Our Lady of the Prairie, Council 5264',
}

export default function Resources() {

    return (
        <main>
            {/* Resources Preview */}
            <section className="bg-white text-primary py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-balance">
                        Resources
                    </h2>
                    <p className="text-lg text-primary/95 max-w-2xl mx-auto mb-8">
                        Resources for Our Lady of the Prairie, Council 5264
                    </p>
                    <Link href="/resources" className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity inline-block">
                        View All Resources
                    </Link>
                </div>
            </section>
        </main>
    )
}
