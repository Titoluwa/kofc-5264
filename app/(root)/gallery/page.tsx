'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ScrapbookPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const galleryItems = [
    {
      id: 1,
      category: 'events',
      title: 'Annual Charity Gala 2024',
      description: 'Knights and their families gathered for our signature fundraising event.',
      year: 2024,
    },
    {
      id: 2,
      category: 'charitable',
      title: 'Community Service Day',
      description: 'Knights volunteering at local food bank and community center.',
      year: 2024,
    },
    {
      id: 3,
      category: 'artarama',
      title: 'Artarama Festival 2024',
      description: 'Hundreds of local artists and community members gathered to celebrate creativity.',
      year: 2024,
      image: '/images/kofc-logo.png'
    },
    {
      id: 4,
      category: 'events',
      title: 'Winter Social 2023',
      description: 'Brotherhood gathering with dinner, games, and fellowship.',
      year: 2023,
      image: '/images/kofc_emblem_1c_pos.png'
    },
    {
      id: 5,
      category: 'youth',
      title: 'Youth Leadership Conference',
      description: 'Young members discussing the future of our council.',
      year: 2023,
      image: '/images/kofc-5264-logo.png'
    },
    {
      id: 6,
      category: 'charitable',
      title: 'Christmas Gift Drive',
      description: 'Knights distributing gifts to families in need during the holidays.',
      year: 2023,
      image: '/placeholder.svg'
    },
    {
      id: 7,
      category: 'faith',
      title: 'Mass & Prayer Service',
      description: 'Knights attending Mass together in full regalia.',
      year: 2023,
      image: '/images/kofc-logo-nobg.png'
    },
    {
      id: 8,
      category: 'artarama',
      title: 'Artarama 2023',
      description: 'Artists displaying their work at our spring festival.',
      year: 2023,
      image: '/images/kofc_emblem_1c_pos.png'
    },
  ]

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory)

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Digital Scrapbook
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Celebrating our moments, memories, and milestones through the years.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-background py-8 sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'all'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              All Memories
            </button>
            <button
              onClick={() => setSelectedCategory('events')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'events'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Events
            </button>
            <button
              onClick={() => setSelectedCategory('charitable')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'charitable'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Service
            </button>
            <button
              onClick={() => setSelectedCategory('artarama')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'artarama'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Artarama
            </button>
            <button
              onClick={() => setSelectedCategory('youth')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'youth'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Youth
            </button>
            <button
              onClick={() => setSelectedCategory('faith')}
              className={`px-6 py-2   font-medium transition-colors ${selectedCategory === 'faith'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground border border-border hover:border-accent'
                }`}
            >
              Faith
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  {!item.image && <div className="relative h-64 bg-gradient-to-br from-primary to-primary/50 rounded-xl overflow-hidden mb-4 hover:shadow-lg transition-shadow">
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/40 group-hover:bg-primary/60 transition-colors">
                      <div className="text-6xl text-primary-foreground/20">✦</div>
                    </div>

                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {item.year}
                    </div>
                  </div>}
                  {item.image && <div className="relative">
                    <Image src={item.image} alt={item.title} className="w-full h-60 object-cover rounded-lg" width={500} height={500} />
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {item.year}
                    </div>
                  </div>}
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors mt-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">The gallery is empty... for now </p>
              {/* <button
                onClick={() => setSelectedCategory('all')}
                className="text-accent font-medium hover:text-accent/80 transition-colors"
              >
                View all memories
              </button> */}
            </div>
          )}
        </div>
      </section>

      {/* Share Your Memories */}
      {/* <section className="bg-card py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-6">
            Share Your Memories
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Do you have photos from council events, service projects, or special moments? We'd love to add your memories to our digital scrapbook!
          </p>
          <a
            href="mailto:gallery@kofc5264.ca?subject=Memory Submission"
            className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            Submit Photos
          </a>
          <p className="text-muted-foreground text-sm mt-4">
            Email gallery@kofc5264.ca with high-resolution images, captions, and the year/event details.
          </p>
        </div>
      </section> */}

      {/* Timeline Stats */}
      {/* <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-serif font-bold text-accent mb-4">70+</div>
              <p className="text-xl text-primary-foreground/90">Years of History</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-accent mb-4">500+</div>
              <p className="text-xl text-primary-foreground/90">Photos & Memories</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-accent mb-4">∞</div>
              <p className="text-xl text-primary-foreground/90">Stories to Tell</p>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  )
}
