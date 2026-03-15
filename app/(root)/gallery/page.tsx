'use client'

import { useEffect, useState, useCallback } from 'react'
import { Images, Loader2 } from 'lucide-react'
import Lightbox from '@/components/admin/light-box'
import GalleryCard from '@/components/admin/gallery-card'
import { CATEGORIES, GalleryItem } from '@/lib/constants'

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lightbox, setLightbox] = useState<{ item: GalleryItem; index: number } | null>(null)

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

          return {
            ...item,
            images: parsedImages,
          }
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

  const lightboxImages = lightbox
    ? [ ...(lightbox.item.heroImage ? [lightbox.item.heroImage] : []),
        ...(lightbox.item.images ?? []),
      ]
    : []

  const renderGallery = () => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading gallery…</span>
      </div>
    )
  }

  if (items.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <GalleryCard
            key={item.id}
            item={item}
            onOpenLightbox={(it, idx) => setLightbox({ item: it, index: idx })}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="text-center py-16">
      <Images className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
      <p className="text-lg text-muted-foreground">
        The gallery is empty… for now.
      </p>
    </div>
  )
}  

  return (
    <main>
      {/* Hero */}
      <section className="bg-linear-to-r from-[#071A4D] to-[#0451A0] text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Digital Scrapbook
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Celebrating our moments, memories, and milestones through the years.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-background py-8 sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderGallery()}
        </div>
      </section>

      {lightbox && lightboxImages.length > 0 && (
        <Lightbox images={lightboxImages} initialIndex={lightbox.index} title={lightbox.item.title} onClose={() => setLightbox(null)}/>
      )}
    </main>
  )
}