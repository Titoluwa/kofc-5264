import { FileText, ExternalLink, Download } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata = {
    title: 'Resources',
    description: 'Resources for Our Lady of the Prairie, Council 5264',
}

async function getResources() {
    try {
        return await prisma.resource.findMany({
            orderBy: { createdAt: 'desc' },
        })
    } catch {
        return []
    }
}

export default async function ResourcesPage() {
    const resources = await getResources()
    const grouped: Record<string, typeof resources> = {};

    for (const resource of resources) {
        const category = resource.category;

        if (!grouped[category]) {
            grouped[category] = [];
        }

        grouped[category].push(resource);
    }

    const categories = Object.keys(grouped).sort()

    return (
        <main>
            {/* Hero */}
            <section className="bg-linear-to-r from-[#071A4D] to-[#0451A0] text-primary-foreground py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
                        Resources
                    </h1>
                    <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                        Resources for Our Lady of the Prairie, Council 5264
                    </p>
                </div>
            </section>

            {/* Resources */}
            <section className="py-12 lg:py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {resources.length === 0 ? (
                        <div className="text-center py-20 text-primary/60">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-40" />
                            <p className="text-lg font-medium">No resources available yet.</p>
                            <p className="text-sm mt-1">Check back soon.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {categories.map((category) => (
                                <div key={category}>
                                    <h2 className="font-serif text-2xl font-bold text-primary border-b border-primary/20 pb-3 mb-6">
                                        {category}
                                    </h2>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {grouped[category].map((resource) => (
                                            <div
                                                key={resource.id}
                                                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
                                            >
                                                <div>
                                                    <h3 className="font-semibold text-primary text-lg leading-snug">
                                                        {resource.title}
                                                    </h3>
                                                    <p className="text-sm text-primary/70 mt-1 line-clamp-3">
                                                        {resource.description}
                                                    </p>
                                                </div>

                                                {resource.content && (
                                                    <p className="text-sm text-primary/80 border-t border-gray-100 pt-3">
                                                        {resource.content}
                                                    </p>
                                                )}

                                                {(resource.url || resource.file) && (
                                                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                                                        {resource.url && (
                                                            <a
                                                                href={resource.url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                                Visit Link
                                                            </a>
                                                        )}
                                                        {resource.file && (
                                                            <a
                                                                href={resource.file}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                {resource.file.endsWith('.pdf') ? 'View PDF' : 'Download File'}
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}