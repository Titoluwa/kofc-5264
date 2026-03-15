'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Mail, Calendar, ArrowRight, Search, Loader2 } from 'lucide-react'
import SubscribeNewsletter from '@/components/SubscribeNewsletter'
import { Newsletter, PaginationMeta, } from '@/lib/constants'
import Pagination from '@/components/admin/pagination';

const ITEMS_PER_PAGE = 6

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    General:       { bg: 'bg-primary/10',     text: 'text-primary',     border: 'border-primary/30' },
    Events:        { bg: 'bg-accent/10',      text: 'text-accent',      border: 'border-accent/30' },
    Announcements: { bg: 'bg-blue-500/10',    text: 'text-blue-600',    border: 'border-blue-500/30' },
    Programs:      { bg: 'bg-purple-500/10',  text: 'text-purple-600',  border: 'border-purple-500/30' },
    Charity:       { bg: 'bg-green-500/10',   text: 'text-green-600',   border: 'border-green-500/30' },
}

const DEFAULT_COLOR = { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' }


export default function NewslettersPage() {
    const [newsletters, setNewsletters]       = useState<Newsletter[]>([])
    const [meta, setMeta]                     = useState<PaginationMeta>({ page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 1 })
    const [loading, setLoading]               = useState(true)
    const [error, setError]                   = useState('')
    const [currentPage, setCurrentPage]       = useState(1)
    const [searchInput, setSearchInput]       = useState('')
    const [search, setSearch]                 = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [allCategories, setAllCategories]   = useState<string[]>([])

    //Fetch

    const fetchNewsletters = useCallback(async (page: number, searchTerm: string, category: string | null) => {
        try {
        setLoading(true)
        setError('')
        const params = new URLSearchParams({
            page:  String(page),
            limit: String(ITEMS_PER_PAGE),
            ...(searchTerm ? { search: searchTerm }   : {}),
            ...(category   ? { category }              : {}),
        })
        const res  = await fetch(`/api/newsletters?${params}`)
        if (!res.ok) throw new Error('Failed to fetch newsletters')
        const data = await res.json()

        // Handle both paginated { data, meta } and plain array responses
        if (Array.isArray(data)) {
            setNewsletters(data)
            setMeta({ page, limit: ITEMS_PER_PAGE, total: data.length, totalPages: 1 })
            // Collect unique categories from the full list when no server pagination
            const cats = [...new Set(data.map((n: Newsletter) => n.category).filter(Boolean))] as string[]
            setAllCategories(cats)
        } else {
            setNewsletters(data.data ?? [])
            setMeta(data.meta ?? { page, limit: ITEMS_PER_PAGE, total: 0, totalPages: 1 })
            if (data.categories) setAllCategories(data.categories)
        }
        } catch (err) {
        console.error(err)
        setError('Failed to load newsletters. Please try again.')
        } finally {
        setLoading(false)
        }
    }, [])

    // Initial load + re-fetch when page / search / category change
    useEffect(() => {
        fetchNewsletters(currentPage, search, selectedCategory)
    }, [currentPage, search, selectedCategory, fetchNewsletters])

    // Debounce search input → committed search (resets page)
    useEffect(() => {
        const timer = setTimeout(() => {
        setSearch(searchInput)
        setCurrentPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [searchInput])

    // Handlers

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category)
        setCurrentPage(1)
    }

    const showingFrom = meta.total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
    const showingTo   = Math.min(currentPage * ITEMS_PER_PAGE, meta.total)

    return (
        <main>
            {/* Hero */}
            <section className="bg-linear-to-r from-[#071A4D] to-[#0451A0] text-primary-foreground py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-balance">
                        Our Newsletters
                    </h1>
                    <p className="text-lg text-primary-foreground/90">
                        Stay informed with updates from Knights of Columbus — Our Lady of the Prairie, Council 5264.
                        Read the latest news, upcoming events, and inspiring stories from our community.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="bg-background pt-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search newsletters…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors rounded-md"
                    />
                    </div>
                </div>

                {/* Category pills */}
                {allCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === null
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        All Categories
                    </button>
                    {allCategories.map(category => (
                        <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                        >
                        {category}
                        </button>
                    ))}
                    </div>
                )}

                {/* Results count */}
                {!loading && meta.total > 0 && (
                    <p className="text-muted-foreground text-sm">
                    Showing {showingFrom}–{showingTo} of {meta.total} newsletter{meta.total === 1 ? '' : 's'}
                    </p>
                )}
                </div>
            </section>

            {/* Grid */}
            <section className="bg-background py-2 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading newsletters…</span>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="text-center py-16">
                    <Mail className="w-10 h-10 text-destructive mx-auto mb-3 opacity-60" />
                    <p className="text-destructive font-medium">{error}</p>
                    <button
                        onClick={() => fetchNewsletters(currentPage, search, selectedCategory)}
                        className="mt-4 text-sm underline text-muted-foreground hover:text-foreground"
                    >
                        Try again
                    </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && newsletters.length === 0 && (
                    <div className="text-center py-16">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                        No newsletters found
                    </h3>
                    <p className="text-muted-foreground">
                        {search || selectedCategory
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No newsletters have been published yet.'}
                    </p>
                    </div>
                )}

                {/* Cards */}
                {!loading && !error && newsletters.length > 0 && (
                    <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsletters.map(newsletter => {
                        const cat         = newsletter.category ?? ''
                        const catColor    = CATEGORY_COLORS[cat] ?? DEFAULT_COLOR
                        const dateStr     = newsletter.publishedDate ?? newsletter.createdAt
                        const formattedDate = dateStr
                            ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : ''
                        // Use the first ~180 chars of content as excerpt
                        const excerpt = newsletter.content?.slice(0, 180).trim() + (newsletter.content?.length > 180 ? '…' : '')

                        return (
                            <Link key={newsletter.id} href={`/newsletters/${newsletter.id}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent flex flex-col">
                            {/* Content */}
                            <div className="flex flex-col flex-1 p-6">
                                {/* Newsletter Image */}
                                {newsletter.heroImage && (
                                    <div className='overflow-hidden h-48 mb-4'>
                                        <img src={newsletter.heroImage} alt={newsletter.title} className="card-img" />
                                    </div>
                                )}
                                {/* Category badge */}
                                {cat && (
                                <div className={`inline-block w-fit mb-3 px-3 py-1 rounded-full text-xs font-semibold border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                                    {cat}
                                </div>
                                )}

                                {/* Title */}
                                <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                {newsletter.title}
                                </h3>

                                {/* Subtitle */}
                                {newsletter.subtitle && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                                    {newsletter.subtitle}
                                </p>
                                )}

                                {/* Excerpt */}
                                <p className="text-foreground text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
                                {excerpt}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                {formattedDate ? (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {formattedDate}
                                    </div>
                                ) : <span />}
                                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                            </Link>
                        )
                        })}
                    </div>
                    <Pagination meta={meta} onPageChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                    </>
                )}
                </div>
            </section>

            <SubscribeNewsletter />
        </main>
    )
}