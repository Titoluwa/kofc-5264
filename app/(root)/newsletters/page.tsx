'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Mail, Calendar, ArrowRight, Search, X } from 'lucide-react'
import SubscribeNewsletter from '@/components/SubscribeNewsletter'
import { Newsletter, PaginationMeta, PAGE_SIZE, PageContent } from '@/lib/constants'
import PublicPagination, { PageShowing } from '@/components/PublicPagination'
import { NewsletterCardSkeleton, HeaderSkeleton } from '@/components/skeleton'
import Header from '@/components/pages/header'

const PAGE_SLUG = 'newsletters'

export default function NewslettersPage() {
    const [allNewsletters, setAllNewsletters] = useState<Newsletter[]>([])
    const [newsletters, setNewsletters] = useState<Newsletter[]>([])
    const [meta, setMeta] = useState<PaginationMeta>({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1,
    })

    const [loading, setLoading] = useState(true)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const [allCategories, setAllCategories] = useState<string[]>([])
    const [content, setContent] = useState<PageContent | null>(null)

    function hasValidDateTime(
        newsletter: Newsletter
    ): newsletter is Newsletter & { publishedDate: string } {
        if (!newsletter.publishedDate) return false
        const d = new Date(newsletter.publishedDate)
        return !Number.isNaN(d.getTime())
    }

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
        setInitialLoading(true)

        const pageRes = await fetch(
            `/api/pages/content?slug=${encodeURIComponent(PAGE_SLUG)}`
        )
        if (!pageRes.ok) throw new Error('Failed to load page')

        const page = await pageRes.json()

        const contentRes = await fetch(
            `/api/pages/${page.id}/content?name=${encodeURIComponent(PAGE_SLUG)}`
        )
        if (!contentRes.ok) throw new Error('Failed to load content')

        const section: PageContent = await contentRes.json()

        if (!section) throw new Error('No content found')

        setContent(section)
        } catch {
        setError('Failed to load content')
        } finally {
        setInitialLoading(false)
        }
    }

    const fetchNewsletters = useCallback(async () => {
        try {
        setLoading(true)
        setError('')

        const res = await fetch('/api/newsletters')
        if (!res.ok) throw new Error('Failed to fetch newsletters')

        const data = await res.json()
        const newsletterData = Array.isArray(data) ? data : data.data ?? []

        setAllNewsletters(newsletterData)

        const cats = [
            ...new Set(
            newsletterData
                .map((n: Newsletter) => n.category)
                .filter(Boolean)
            ),
        ] as string[]

        setAllCategories(cats)
        } catch (err) {
        console.error(err)
        setError('Failed to load newsletters. Please try again.')
        } finally {
        setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNewsletters()
    }, [fetchNewsletters])

    useEffect(() => {
        const timer = setTimeout(() => {
        setSearch(searchInput)
        setCurrentPage(1)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchInput])

    useEffect(() => {
        let filtered = [...allNewsletters]

        // Filter by category
        if (selectedCategory) {
        filtered = filtered.filter(
            (n) => n.category === selectedCategory
        )
        }

        // Filter by search
        if (search) {
        const q = search.toLowerCase()

        filtered = filtered.filter(
            (n) =>
            n.title.toLowerCase().includes(q) ||
            n.subtitle?.toLowerCase().includes(q) ||
            n.content?.toLowerCase().includes(q)
        )
        }

        // Sort nearest to today's date
        const today = new Date()

        filtered = filtered
        .filter(hasValidDateTime)
        .sort((a, b) => {
            const diffA = Math.abs(
            new Date(a.publishedDate).getTime() - today.getTime()
            )
            const diffB = Math.abs(
            new Date(b.publishedDate).getTime() - today.getTime()
            )
            return diffA - diffB
        })

        // Pagination
        const total = filtered.length
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
        const start = (currentPage - 1) * PAGE_SIZE
        const paginated = filtered.slice(start, start + PAGE_SIZE)

        setMeta({
        page: currentPage,
        limit: PAGE_SIZE,
        total,
        totalPages,
        })

        setNewsletters(paginated)
    }, [allNewsletters, selectedCategory, search, currentPage])


    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category)
        setCurrentPage(1)
    }

    let headerArea = (
        <Header
        title={content?.mainText || 'Our Newsletters'}
        description={
            content?.subtext1 ||
            'Read the latest news, upcoming events, and inspiring stories from our community.'
        }
        />
    )

    if (initialLoading) {
        headerArea = <HeaderSkeleton />
    } else if (error === 'Failed to load content') {
        headerArea = (
        <div className="bg-destructive/10 py-16 text-center">
            <p className="text-destructive font-semibold">{error}</p>
        </div>
        )
    }

    return (
        <main>
        {headerArea}

        {/* Search */}
        <section className="bg-background/95 backdrop-blur-md border-b border-border sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />

                <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search newsletters…"
                className="w-full pl-11 pr-10 py-2.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                />

                {searchInput && (
                <button
                    onClick={() => {
                    setSearchInput('')
                    setSearch('')
                    setCurrentPage(1)
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    aria-label="Clear search"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
                )}
            </div>
            </div>
        </section>

        {/* Categories */}
        {allCategories.length > 0 && (
            <section className="bg-background border-b border-border/50 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap gap-2 justify-center">
                <button
                    onClick={() => handleCategoryChange(null)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    selectedCategory === null
                        ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                        : 'bg-card text-foreground border-border hover:border-accent/50 hover:text-accent'
                    }`}
                >
                    All
                </button>

                {allCategories.map((cat) => (
                    <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        selectedCategory === cat
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

        {/* Main Content */}
        <section className="bg-background py-16 lg:py-18">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between pb-6">
                <PageShowing meta={meta} />
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <NewsletterCardSkeleton key={i.toFixed()} />
                ))}
                </div>
            )}

            {/* Error */}
            {!loading && error && error !== 'Failed to load content' && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
                    <Mail className="w-7 h-7 text-destructive opacity-60" />
                </div>
                <p className="font-semibold text-lg text-foreground">
                    Something went wrong
                </p>
                <p className="text-muted-foreground text-sm mt-2">{error}</p>

                <button
                    onClick={fetchNewsletters}
                    className="mt-5 text-sm text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                    Try again
                </button>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && newsletters.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                    <Mail className="w-7 h-7 text-muted-foreground opacity-60" />
                </div>

                <p className="font-semibold text-lg text-foreground">
                    {search || selectedCategory
                    ? 'No newsletters match your search'
                    : 'No newsletters yet'}
                </p>

                <p className="text-muted-foreground text-sm mt-2">
                    {search || selectedCategory
                    ? 'Try a different search term or clear the filter.'
                    : 'Check back soon — new issues are published regularly.'}
                </p>
                </div>
            )}

            {/* Cards */}
            {!loading && !error && newsletters.length > 0 && (
                <div className="flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {newsletters.map((newsletter) => {
                    const dateStr =
                        newsletter.publishedDate ?? newsletter.createdAt

                    const formattedDate = dateStr
                        ? new Date(dateStr).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })
                        : ''

                    const contentPreview =
                        newsletter.content?.slice(0, 140).trim() ?? ''

                    const excerpt =
                        newsletter.content &&
                        newsletter.content.length > 140
                        ? contentPreview + '…'
                        : contentPreview

                    const preview = newsletter.content
                        ? excerpt
                        : newsletter.file?.split('/').pop() ?? ''

                    return (
                        <Link
                        key={newsletter.id}
                        href={`/newsletters/${newsletter.id}`}
                        className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                        {newsletter.heroImage ? (
                            <div className="relative h-48 bg-muted overflow-hidden shrink-0">
                            <img
                                src={newsletter.heroImage}
                                alt={newsletter.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                            </div>
                        ) : (
                            <div className="h-48 bg-gradient-to-br from-[#071A4D]/10 to-[#0451A0]/10 flex items-center justify-center shrink-0">
                            <Mail className="w-10 h-10 text-primary/20" />
                            </div>
                        )}

                        <div className="flex flex-col flex-1 p-6">
                            <h3 className="font-serif text-xl font-bold text-foreground mb-2 leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                            {newsletter.title}
                            </h3>

                            {newsletter.subtitle && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                                {newsletter.subtitle}
                            </p>
                            )}

                            <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                            {preview}
                            </p>

                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/70">
                            {formattedDate ? (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                                <span>{formattedDate}</span>
                                </div>
                            ) : (
                                <span />
                            )}

                            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                        </Link>
                    )
                    })}
                </div>

                <PublicPagination
                    page={currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={(p) => {
                    setCurrentPage(p)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                />
                </div>
            )}
            </div>
        </section>

        <SubscribeNewsletter />
        </main>
    )
}