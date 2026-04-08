'use client'

import { useEffect, useState } from 'react'
import { PageContent } from '@/lib/constants'
import Header from '@/components/pages/header'

const MAIN_SLUG = 'history'

const HERO_DEFAULT: Partial<PageContent> = {
  mainText: 'Our History',
  subtext1: 'Rooted in faith, dedicated to service, shaping our community for over 60 years.',
}

interface PageData {
  id: number
  name: string
  slug: string
  contents: PageContent[]
}

function parseSectionName(name: string): { baseName: string; year: string | undefined } {
  const [baseName, year] = name.split(':').map((s) => s.trim())
  return { baseName, year: year || undefined }
}

const WORD_ORDER: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
}

function sectionSortKey(name: string): number {
  const { baseName } = parseSectionName(name)
  const suffix = baseName.split('-').pop() ?? ''
  return WORD_ORDER[suffix] ?? Number.parseInt(suffix, 10) ?? 999
}

async function fetchPage(slug: string): Promise<PageData> {
  const res = await fetch(`/api/pages/slug?slug=${encodeURIComponent(slug)}`)
  if (!res.ok) throw new Error(`Failed to load page: ${slug}`)
  return res.json()
}

function HeroSkeleton() {
  return (
    <section className="bg-primary py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="animate-pulse h-12 w-64 bg-primary-foreground/20 rounded-lg mx-auto" />
        <div className="animate-pulse h-6 w-96 bg-primary-foreground/10 rounded-lg mx-auto" />
      </div>
    </section>
  )
}

function SectionSkeleton({ flipped = false }: Readonly<{ flipped?: boolean }>) {
  return (
    <section className="py-16 lg:py-24">
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${
          flipped ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-12 items-center`}
      >
        <div className="flex-1 space-y-4">
          <div className="animate-pulse h-8 w-48 bg-muted rounded" />
          <div className="animate-pulse h-4 w-full bg-muted rounded" />
          <div className="animate-pulse h-4 w-5/6 bg-muted rounded" />
          <div className="animate-pulse h-4 w-4/6 bg-muted rounded" />
        </div>
        <div className="animate-pulse w-full md:w-80 h-48 bg-muted rounded-2xl shrink-0" />
      </div>
    </section>
  )
}

function HeroSection({ data }: Readonly<{ data: Partial<PageContent> }>) {
  return (
    <Header
      title={data?.mainText ?? 'Our History'}
      description={data?.subtext1 ?? ''}
    />
  )
}

interface NarrativeSectionProps {
  data: Partial<PageContent>
  year?: string
  flipped?: boolean
  accent?: boolean
}

function NarrativeSection({
  data,
  year,
  flipped = false,
  accent = false,
}: Readonly<NarrativeSectionProps>) {
  const paragraphs = [data.subtext1, data.subtext2, data.subtext3].filter(Boolean) as string[]
  const image = data.image ?? ''
  const hasBackgroundImage = Boolean(image)

  const accentBg = accent ? 'bg-muted/40 py-16 lg:py-24' : 'bg-background py-16 lg:py-24'
  const sectionBg = hasBackgroundImage ? 'py-16 lg:py-24' : accentBg

  return (
    <section className={`relative overflow-hidden ${sectionBg}`}>

      {hasBackgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        </>
      )}

      <div
        className={`relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${
          flipped ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-12 lg:gap-20 items-start`}
      >
        {/* Year badge column */}
        <div className="shrink-0 md:w-40 flex flex-row md:flex-col items-center md:items-end gap-3 md:pt-1">
          {year && (
            <span
              className={`inline-block text-sm font-bold tracking-widest uppercase rounded-full px-4 py-1 ${
                hasBackgroundImage
                  ? 'text-white bg-white/15 border border-white/30'
                  : 'text-accent bg-accent/10 border border-accent/20'
              }`}
            >
              {year}
            </span>
          )}
        </div>

        {/* Content column */}
        <div className="flex-1 space-y-5">
          {data.mainText && (
            <h2
              className={`font-serif text-3xl lg:text-4xl font-bold ${
                hasBackgroundImage ? 'text-white' : 'text-foreground'
              }`}
            >
              {data.mainText}
            </h2>
          )}

          {paragraphs.map((p) => (
            <p
              key={p}
              className={`leading-relaxed text-base lg:text-lg ${
                hasBackgroundImage ? 'text-white/80' : 'text-muted-foreground'
              }`}
            >
              {p}
            </p>
          ))}

          {(data.primaryButton || data.secondaryButton) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {(data.primaryButton as { text?: string; link?: string } | undefined)?.text && (
                <a
                  href={(data.primaryButton as { text?: string; link?: string }).link ?? '#'}
                  className={`rounded-lg px-6 py-2.5 font-semibold text-sm transition-opacity hover:opacity-90 ${
                    hasBackgroundImage
                      ? 'bg-white text-black'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  {(data.primaryButton as { text?: string; link?: string }).text}
                </a>
              )}
              {(data.secondaryButton as { text?: string; link?: string } | undefined)?.text && (
                <a
                  href={(data.secondaryButton as { text?: string; link?: string }).link ?? '#'}
                  className={`rounded-lg px-6 py-2.5 font-semibold text-sm transition-colors ${
                    hasBackgroundImage
                      ? 'border-2 border-white text-white hover:bg-white/15'
                      : 'border-2 border-accent text-accent hover:bg-accent/10'
                  }`}
                >
                  {(data.secondaryButton as { text?: string; link?: string }).text}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-px bg-border" />
    </div>
  )
}

export default function HistoryPage() {
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchPage(MAIN_SLUG)
      .then(setPageData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const heroContent = pageData?.contents.find((c) => c.name === 'hero') ?? HERO_DEFAULT

  // Filter out hero, sort by section number (section-one, section-two, …)
  const bodySections = (pageData?.contents ?? [])
    .filter((c) => c.name !== 'hero')
    .sort((a, b) => sectionSortKey(a.name) - sectionSortKey(b.name))

  return (
    <main>
      {loading ? <HeroSkeleton /> : <HeroSection data={heroContent} />}

      {loading ? (
        <>
          <SectionSkeleton />
          <Divider />
          <SectionSkeleton flipped />
        </>
      ) : (
        bodySections.map((section, index) => {
          // Year is encoded in the name: "section-two: 1980" → "1980"
          const { year } = parseSectionName(section.name)
          const isFlipped = index % 2 !== 0
          const isAccent  = index % 2 !== 0

          return (
            <div key={section.id}>
              {index > 0 && <Divider />}
              <NarrativeSection
                data={section}
                year={year}
                flipped={isFlipped}
                accent={isAccent}
              />
            </div>
          )
        })
      )}
    </main>
  )
}