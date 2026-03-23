'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, X, GalleryHorizontalEnd } from 'lucide-react'
import Lightbox from '@/components/admin/light-box'
import GalleryCard from '@/components/admin/gallery-card'
import { CATEGORIES, GalleryItem, PAGE_SIZE, PageContent } from '@/lib/constants'
import { HeaderSkeleton, GalleryCardSkeleton } from '@/components/skeleton'
import PublicPagination, { PageShowing } from '@/components/PublicPagination'
import Header from '@/components/pages/header'

const PAGE_SLUG = "gallery";

export default function GalleryPage() {
  const [items, setItems]                       = useState<GalleryItem[]>([])
  const [loading, setLoading]                   = useState(true)
  const [initialLoading, setInitialLoading]     = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch]                     = useState('')
  const [lightbox, setLightbox]                 = useState<{ item: GalleryItem; index: number } | null>(null)
  const [page, setPage]                         = useState(1)
  const [content, setContent]                   = useState<PageContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchContent(); }, []);
  
  const fetchContent = async () => {
      try {
          setInitialLoading(true);
      
          const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(PAGE_SLUG)}`);
          if (!pageRes.ok) throw new Error("Failed to load page");
          const page = await pageRes.json();
      
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
  
  const fetchGallery = useCallback(async (category: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (category !== 'all') params.set('category', category)
      const res = await fetch(`/api/gallery?${params}`)
      if (!res.ok) throw new Error('Failed to fetch gallery')
      const data = await res.json()
      const list: GalleryItem[] = (Array.isArray(data) ? data : data.data ?? []).map(
        (item: GalleryItem) => {
          let parsedImages: string[] = []
          if (Array.isArray(item.images)) {
            parsedImages = item.images
          } else if (typeof item.images === 'string') {
            parsedImages = JSON.parse(item.images)
          }
          return { ...item, images: parsedImages }
        }
      )
      setItems(list)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchGallery(selectedCategory) }, [selectedCategory, fetchGallery])

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      item.title.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      String(item.year).includes(q)
    )
  })

  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE)
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const lightboxImages = lightbox
    ? [
        ...(lightbox.item.heroImage ? [lightbox.item.heroImage] : []),
        ...(lightbox.item.images ?? []),
      ]
    : []

  let emptyStateMessage = 'The gallery is empty… for now'
  if (search) {
    emptyStateMessage = `No albums match "${search}"`
  } else if (selectedCategory !== 'all') {
    emptyStateMessage = `No albums in this category yet`
  }

  let headerArea = (
    <Header 
      title={content?.mainText || "Digital Scrapbook"}
      description={content?.subtext1 || "Celebrating our moments, memories, and milestones through the years."}
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
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search albums by title, year, category…"
              className="w-full pl-11 pr-10 py-2.5 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="bg-background border-b border-border/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSearch(''); setPage(1); }}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                    : 'bg-card text-foreground border-border hover:border-accent/50 hover:text-accent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between pb-6">
              <PageShowing meta={{ page, totalPages, limit: PAGE_SIZE, total: filteredItems.length }} />
            </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: PAGE_SIZE }).map((_, sk) => <GalleryCardSkeleton key={sk.toFixed()} />)}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                <GalleryHorizontalEnd className="w-7 h-7 text-muted-foreground opacity-60" />
              </div>
              <p className="font-semibold text-lg text-foreground">
                {emptyStateMessage}
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                {search
                  ? 'Try a different search term or clear the filter.'
                  : 'Check back soon — new albums are added regularly.'}
              </p>
              {(search || selectedCategory !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setSelectedCategory('all'); setPage(1); }}
                  className="mt-5 text-sm text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Gallery cards */}
          {!loading && paginatedItems.length > 0 && (
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {paginatedItems.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpenLightbox={(it, idx) => setLightbox({ item: it, index: idx })}
                  />
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

      {lightbox && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightbox.index}
          title={lightbox.item.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  )
}