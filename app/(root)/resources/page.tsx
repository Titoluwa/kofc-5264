'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Download, Search, X, BookOpen, FolderOpen } from 'lucide-react'
import PublicPagination, { PageShowing } from '@/components/PublicPagination'
import { ResourceCardSkeleton, HeaderSkeleton } from '@/components/skeleton'
import { PAGE_SIZE, Resource, PageContent} from '@/lib/constants'
import Header from '@/components/pages/header'

const PAGE_SLUG = "resources";

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([])
    const [loading, setLoading]     = useState(true)
    const [initialLoading, setInitialLoading] = useState(true)
    const [search, setSearch]       = useState('')
    const [filterCat, setFilterCat] = useState('all')
    const [page, setPage]           = useState(1)
    const [content, setContent] = useState<PageContent | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await fetch('/api/resources')
                if (!res.ok) throw new Error('Failed to fetch resources')
                const data = await res.json()
                setResources(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Failed to load resources:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchResources()
    }, [])

    useEffect(() => { fetchContent(); }, []);
    
    const fetchContent = async () => {
        try {
            setInitialLoading(true);
        
            // get the page by slug
            const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(PAGE_SLUG)}`);
            if (!pageRes.ok) throw new Error("Failed to load page");
            const page = await pageRes.json();
        
            // get the specific section by name
            const contentRes = await fetch(`/api/pages/${page.id}/content?name=${encodeURIComponent(PAGE_SLUG)}`);
            if (!contentRes.ok) throw new Error("Failed to load content");
            const section: PageContent = await contentRes.json();
        
            if (!section) throw new Error("No content found");
            setContent(section);
        } catch {
            setError('Failed to load content');
        } finally {
            setInitialLoading(false);
        }
    };

    // Reset page on search/filter change
    useEffect(() => { setPage(1) }, [search, filterCat])

    // Unique categories derived from data
    const allCategories = [...new Set(resources.map((r) => r.category))].sort()

    // Filter
    const filtered = resources.filter((r) => {
        const matchesCat    = filterCat === 'all' || r.category === filterCat
        const q             = search.toLowerCase()
        const matchesSearch = !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
        return matchesCat && matchesSearch
    })

    // Pagination
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Re-group paginated slice for category section headers
    const grouped = paginated.reduce<Record<string, Resource[]>>((acc, r) => {
        if (!acc[r.category]) acc[r.category] = []
        acc[r.category].push(r)
        return acc
    }, {})

    const isFiltered = search !== '' || filterCat !== 'all'
    let emptyMessage = 'No resources available yet'
    let emptySubMessage = 'Check back soon — resources are added regularly.'
    if (isFiltered) {
        const searchPart = search === '' ? '' : ` "${search}"`
        const filterPart = filterCat === 'all' ? '' : ` in "${filterCat}"`
        emptyMessage = `No resources match${searchPart}${filterPart}`
        emptySubMessage = 'Try a different search term or clear the filter.'
    }

    let headerArea = (
        <Header 
            title={content?.mainText || "Resources"}
            description={content?.subtext1 || "Forms, guides, links, and documents for Our Lady of the Prairie, Council 5264."}
        />
    )

    if (initialLoading) {
        headerArea = <HeaderSkeleton />
    } else if (error) {
        headerArea = (
            <div className="bg-destructive/10 py-16 text-center">
                <p className="text-destructive font-semibold">{error}</p>
            </div>
        )
    }

    return (
        <main>
            {headerArea}

            <section className="bg-background/95 backdrop-blur-md border-b border-border sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search resources…"
                            className="w-full pl-11 pr-10 py-2.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                        />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                        )}
                    </div>
                </div>
            </section>

        {!loading && allCategories.length > 1 && (
            <section className="bg-background border-b border-border/50 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap gap-2 justify-center">
                <button
                    onClick={() => setFilterCat('all')}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    filterCat === 'all'
                        ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                        : 'bg-card text-foreground border-border hover:border-accent/50 hover:text-accent'
                    }`}
                >
                    All
                </button>
                {allCategories.map((cat) => (
                    <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 capitalize ${
                        filterCat === cat
                        ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                        : 'bg-card text-foreground border-border hover:border-accent/50 hover:text-accent'
                    }`}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            </div>
            </section>
        )}

        <section className="bg-background py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between pb-6">
                    <PageShowing meta={{ page, totalPages, limit: PAGE_SIZE, total: filtered.length }} />
                </div>

            {/* Loading skeletons */}
            {loading && (
                <div className="space-y-10">
                {Array.from({ length: 2 }).map((_, si) => (
                    <div key={si.toFixed()} className="space-y-4">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => <ResourceCardSkeleton key={i.toFixed()} />)}
                    </div>
                    </div>
                ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                    <BookOpen className="w-7 h-7 text-muted-foreground opacity-60" />
                </div>
                <p className="font-semibold text-lg text-foreground">
                    {emptyMessage}
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                    {emptySubMessage}
                </p>
                {isFiltered && (
                    <button
                    onClick={() => { setSearch(''); setFilterCat('all') }}
                    className="mt-5 text-sm text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
                    >
                    Clear filters
                    </button>
                )}
                </div>
            )}

            {/* Grouped resource sections */}
            {!loading && paginated.length > 0 && (
                <div className="flex flex-col gap-2">
                <div className="space-y-10">
                    {Object.entries(grouped)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, items]) => (
                        <section key={category}>
                        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
                            <FolderOpen className="w-4 h-4 text-accent shrink-0" />
                            <h2 className="font-serif text-xl font-bold text-foreground capitalize">
                            {category}
                            </h2>
                            <span className="ml-1 text-xs font-medium text-muted-foreground">
                            ({filtered.filter((r) => r.category === category).length})
                            </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {items.map((resource) => (
                            <article
                                key={resource.id}
                                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <div>
                                <h3 className="font-semibold text-foreground leading-snug">
                                    {resource.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
                                    {resource.description}
                                </p>
                                </div>

                                {resource.content && (
                                <p className="text-sm text-muted-foreground border-t border-border/60 pt-3 leading-relaxed">
                                    {resource.content}
                                </p>
                                )}

                                {(resource.url || resource.file) && (
                                <div className="flex flex-wrap gap-3 mt-auto pt-3 border-t border-border/60">
                                    {resource.url && (
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline underline-offset-2 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                        Visit Link
                                    </a>
                                    )}
                                    {resource.file && (
                                    <a
                                        href={resource.file}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline underline-offset-2 transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5 shrink-0" />
                                        {resource.file.endsWith('.pdf') ? 'View PDF' : 'Download File'}
                                    </a>
                                    )}
                                </div>
                                )}
                            </article>
                            ))}
                        </div>
                        </section>
                    ))}
                </div>

                <PublicPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                    setPage(p)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                />
                </div>
            )}
            </div>
        </section>

        </main>
    )
}