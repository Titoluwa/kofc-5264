'use client'

import { useEffect, useState } from 'react'
import { PageContent } from '@/lib/constants'

const MAIN_SLUG = '#history'

const SECTION_SLUGS = [
  '#history-hero',
  '#history-section-1',
  '#history-section-2',
  '#history-section-3',
  '#history-section-4',
] as const

type SectionSlug = (typeof SECTION_SLUGS)[number]

type SectionsState = Record<SectionSlug, PageContent | null>
type LoadingState  = Record<SectionSlug, boolean>

// Defaults

const DEFAULTS: Record<SectionSlug, Partial<PageContent>> = {
  '#history-hero': {
    mainText: 'Our History',
    subtext1: 'Rooted in faith, dedicated to service, shaping our community for over 60 years.',
  },
  '#history-section-1': {
    mainText: 'The Founding',
    subtext1:
      'On the 11th March 1962, an organization meeting was held to gauge interest in forming a Knights of Columbus Council at St. Norbert Parish.',
    subtext2:
      'In attendance was His Grace, Archbishop Maurice Boudoux, Father Armand Hebert, State Deputy Leo Soenen, District Deputy John Jobinville, and Parish Chairperson Mr. Wilf Dobiggin. The meeting concluded with the formation of a nominating committee and an agreement to meet two weeks later.',
    subtext3:
      'On the 25th March the nominating committee presented a full slate of officers who were duly elected, with District Deputy Jobinville declaring that St. Norbert Council was now formed, with Brother Dobiggin as Grand Knight of the Council.',
  },
  '#history-section-2': {
    mainText: 'A New Home',
    subtext1:
      'In 1980 a decision was made to move the Council from St. Norbert Parish to the newly formed Mary Mother of the Church Parish. In 1984 the Council decided to adopt the name Our Lady of the Prairie, in honour of the Trappist monks who established a monastery in St Norbert in 1892 calling their community Our Lady of the Prairie',
    subtext2:
      'Following the move to Mary Mother of the Church parish, the Council has remained very active in all aspects of the parish life, visibly involved in many roles as greeters, ushers, proclaimers of the word, and Eucharistic ministers.  Many noteworthy projects have been undertaken by Council at Mary Mother.',
  },
  '#history-section-3': {
    mainText: 'Building & Giving',
    subtext1:
      'A few years after the church opened in 1989, a garage was built to provide a growing need for storage. Using almost 100% Council volunteers, they were able to complete the garage in just a few months. The building has supported Council garage sales for many years.',
    subtext2:
      'From an idea to provide a seniors’ home adjacent to the church that was first discussed in Council almost a decade before, Southpark Estates was registered as a non-profit corporation in 1995. With seed money advanced by Council to conduct a feasibility study and marketing plan, the Life-Lease 55+ building was completed in 1997 and contains 59 suites. Twenty-five years later, the Estates has a continuing commitment from Council, providing three of the five board members.',
    subtext3:
      'Beginning in 1996, Artarama has been a major fundraiser for the Council and consists of the display and sale of art produced by some of the best artists in the province.  Annually, Artarama can attract more than 40 artists from around the province and normally generates tens of thousands of dollars. With the passing of two brothers who were very committed to our Council, a decision was made to remember them by establishing an annual $500.00 scholarship: one for a student in a Catholic high school, and one for a Catholic student pursuing post-secondary studies.',
  },
  '#history-section-4': {
    mainText: 'Resilience & Renewal',
    subtext1:
      'When COVID arrived in Manitoba in 2020, many Councils chose to go into a forced hibernation.  While our Council had no choice but to cancel our annual pancake breakfasts, fish fry, and garage sales, we were, through the use of technology, able to meet regularly through virtual means, even if sometimes it was only executive meetings. On those occasions, members were kept apprised of Council actions and decisions by sending out the minutes of executive meetings to all brothers.',
    subtext2:
      'In December 2020, a brother conceived of a musical mobile Christmas float that toured long-term care homes and seniors’ residences in our community.  His family was recognized for this effort by being named the Supreme Family of the Month for March 2021.',
    subtext3:
      'With the lifting of restrictions, our Council held its first in-person community event with a sold-out fish fry.  We look forward to many more years of service to our parish, community and province.  Vivat Jesus!',
  },
}

// ─── Data fetching

async function fetchSection(slug: SectionSlug): Promise<PageContent> {
  const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(MAIN_SLUG)}`)
  if (!pageRes.ok) throw new Error(`Failed to load page for ${slug}`)
  const page = await pageRes.json()

  const contentRes = await fetch(`/api/pages/${page.id}/content?name=${encodeURIComponent(slug)}`)
  if (!contentRes.ok) throw new Error(`Failed to load content for ${slug}`)
  return contentRes.json()
}

// ─── Skeleton components ───────────────────────────────────────────────────────

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

// ─── Section renderers ─────────────────────────────────────────────────────────

/** Hero banner */
function HeroSection({ data }: Readonly<{ data: Partial<PageContent> }>) {
  return (
    <section className="bg-primary text-primary-foreground py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {data.mainText && (
          <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
            {data.mainText}
          </h1>
        )}
        {data.subtext1 && (
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            {data.subtext1}
          </p>
        )}
      </div>
    </section>
  )
}

interface NarrativeSectionProps {
  data: Partial<PageContent>
  year?: string
  flipped?: boolean
  accent?: boolean
}

/**
 * Full-width narrative block — alternating layout, optional year badge,
 * uses mainText as heading + subtext1/2/3 as paragraphs.
 */
function NarrativeSection({ data, year, flipped = false, accent = false }: Readonly<NarrativeSectionProps>) {
  const paragraphs = [data.subtext1, data.subtext2, data.subtext3].filter(Boolean) as string[]

  return (
    <section className={accent ? 'bg-muted/40 py-16 lg:py-24' : 'bg-background py-16 lg:py-24'}>
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${
          flipped ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-12 lg:gap-20 items-start`}
      >
        {/* Year / label column */}
        <div className="shrink-0 md:w-40 flex flex-row md:flex-col items-center md:items-end gap-3 md:pt-1">
          {year && (
            <span className="inline-block text-sm font-bold tracking-widest text-accent uppercase bg-accent/10 border border-accent/20 rounded-full px-4 py-1">
              {year}
            </span>
          )}
          <div className="hidden md:block w-px flex-1 bg-border mt-4 self-stretch" />
        </div>

        {/* Content column */}
        <div className="flex-1 space-y-5">
          {data.mainText && (
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              {data.mainText}
            </h2>
          )}
          {paragraphs.map((p) => (
            <p key={p} className="text-muted-foreground leading-relaxed text-base lg:text-lg">
              {p}
            </p>
          ))}

          {/* Optional image */}
          {data.image && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.image} alt={data.mainText ?? ''} className="w-full object-cover" />
            </div>
          )}

          {/* Optional CTA buttons */}
          {(data.primaryButton || data.secondaryButton) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {(data.primaryButton as { text?: string; link?: string } | undefined)?.text && (
                <a
                  href={(data.primaryButton as { text?: string; link?: string }).link ?? '#'}
                  className="bg-accent text-accent-foreground rounded-lg px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  {(data.primaryButton as { text?: string; link?: string }).text}
                </a>
              )}
              {(data.secondaryButton as { text?: string; link?: string } | undefined)?.text && (
                <a
                  href={(data.secondaryButton as { text?: string; link?: string }).link ?? '#'}
                  className="border-2 border-accent text-accent rounded-lg px-6 py-2.5 font-semibold hover:bg-accent/10 transition-colors text-sm"
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

// ─── Section divider ───────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-px bg-border" />
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [sections, setSections] = useState<SectionsState>(
    Object.fromEntries(SECTION_SLUGS.map((s) => [s, null])) as SectionsState,
  )
  const [loading, setLoading] = useState<LoadingState>(
    Object.fromEntries(SECTION_SLUGS.map((s) => [s, true])) as LoadingState,
  )

  useEffect(() => {
    function loadSection(slug: SectionSlug) {
      function onSuccess(data: PageContent) {
        setSections((prev) => ({ ...prev, [slug]: data }))
      }
      function onDone() {
        setLoading((prev) => ({ ...prev, [slug]: false }))
      }

      fetchSection(slug).then(onSuccess).catch(() => {}).finally(onDone)
    }

    SECTION_SLUGS.forEach(loadSection)
  }, [])

  /** Return API data if available, fall back to hardcoded defaults */
  const get = (slug: SectionSlug): Partial<PageContent> =>
    sections[slug] ?? DEFAULTS[slug]

  return (
    <main>
      {/* ── Hero ── */}
      {loading['#history-hero'] ? (
        <HeroSkeleton />
      ) : (
        <HeroSection data={get('#history-hero')} />
      )}

      {/* ── Section 1 – The Founding (1962) ── */}
      {loading['#history-section-1'] ? (
        <SectionSkeleton />
      ) : (
        <NarrativeSection
          data={get('#history-section-1')}
          year="1962"
          flipped={false}
          accent={false}
        />
      )}

      <Divider />

      {/* ── Section 2 – A New Home (1980 / 1984) ── */}
      {loading['#history-section-2'] ? (
        <SectionSkeleton flipped />
      ) : (
        <NarrativeSection
          data={get('#history-section-2')}
          year="1980"
          flipped={true}
          accent={true}
        />
      )}

      <Divider />

      {/* ── Section 3 – Building & Giving (1989–1996) ── */}
      {loading['#history-section-3'] ? (
        <SectionSkeleton />
      ) : (
        <NarrativeSection
          data={get('#history-section-3')}
          year="1989"
          flipped={false}
          accent={false}
        />
      )}

      <Divider />

      {/* ── Section 4 – Resilience & Renewal (2020) ── */}
      {loading['#history-section-4'] ? (
        <SectionSkeleton flipped />
      ) : (
        <NarrativeSection
          data={get('#history-section-4')}
          year="2020"
          flipped={true}
          accent={true}
        />
      )}
    </main>
  )
}