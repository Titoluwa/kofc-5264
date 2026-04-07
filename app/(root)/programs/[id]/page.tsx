'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Clock, RotateCcw, ArrowLeft, Users2, HandHeart,} from 'lucide-react'
import { Event, CATEGORY_LABELS, CATEGORY_ACCENT } from '@/lib/constants'
import EventRegisterForm from '@/components/eventRegisterForm'
import VolunteerRegisterForm from '@/components/volunterRegisterForm'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'details' | 'register' | 'volunteer'

const EMPTY_FORM = {
    // id: {id},
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  additionalMessage: '',
}

function Skeleton({ className }: Readonly<{ className?: string }>) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [program, setProgram] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  // Derive active tab from ?tab= query param
  const tabParam = searchParams.get('tab') as Tab | null
  const activeTab: Tab = tabParam === 'register' || tabParam === 'volunteer' ? tabParam : 'details'

  const setTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'details') params.delete('tab')
    else params.set('tab', tab)
    router.replace(`?${params.toString()}`, { scroll: false })
    setFormSuccess(false)
    setFormError('')
    setFormData(EMPTY_FORM)
  }

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/events/${id}`)
        if (!res.ok) throw new Error('Failed to fetch program')
        setProgram(await res.json())
      } catch (err) {
        console.error(err)
        setError('Failed to load program')
      } finally {
        setLoading(false)
      }
    }
    fetchProgram()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')
    try {
      const res = await fetch(`/api/events/${id}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          eventId: Number(id),
          type: activeTab === 'register' ? 'REGISTRATION' : 'VOLUNTEER',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? 'Submission failed')
      }
      setFormSuccess(true)
      setFormData(EMPTY_FORM)
    } catch (err: any) {
      setFormError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) return <DetailSkeleton />

  if (error || !program) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-2xl font-bold text-foreground">Program not found</p>
        <p className="text-muted-foreground text-sm">{error ?? 'This program may have been removed.'}</p>
        <Link
          href="/programs"
          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </div>
    )
  }

  const eventDate = new Date(program.date)
  const hasTime = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0
  const dateLabel = eventDate.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  const timeLabel = eventDate.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  })

  const catStyle = CATEGORY_ACCENT[program.category] ?? CATEGORY_ACCENT.other
  const catLabel = CATEGORY_LABELS[program.category] ?? program.category

  const hasSignupOptions = program.allowRegistration || program.allowVolunteer

  // ── Tab definitions (only show tabs that are enabled on the event) ──────────
  const tabs = [
    { key: 'details' as Tab, label: 'Details' },
    ...(program.allowRegistration ? [{ key: 'register' as Tab, label: 'Register' }] : []),
    ...(program.allowVolunteer   ? [{ key: 'volunteer' as Tab, label: 'Volunteer' }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
        <div className="relative w-full h-72 sm:h-96 bg-muted overflow-hidden">
          <Image
            src={program.image || "placeholder.svg"}
            alt={`${program.name} — image `}
            fill
            priority
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Category badge */}
          {/* <div className="absolute top-5 left-5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm ${catStyle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {catLabel}
            </span>
          </div> */}


          {/* Title overlaid on hero */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6">
            <div className="max-w-5xl mx-auto">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow">
                {program.name}
              </h1>
            </div>
          </div>
        </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Back link */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Programs
        </Link>

        {/* Title (only shown when no hero image) */}
        {!program.image && (
          <div className="space-y-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${catStyle}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {catLabel}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {program.name}
            </h1>
          </div>
        )}

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        {hasSignupOptions && (
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Details tab ────────────────────────────────────────────────────── */}
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">

            {/* Main content */}
            <div className="lg:col-span-1 space-y-8">
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {program.description}
              </p>
              {program.content && (
                <div
                  className="prose prose-sm sm:prose max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: program.content }}
                />
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Event info card */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Event Details
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{dateLabel}</span>
                  </div>
                  {hasTime && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-foreground">{timeLabel}</span>
                    </div>
                  )}
                  {program.schedule && (
                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-muted-foreground italic">{program.schedule}</span>
                    </div>
                  )}
                  {program.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-foreground">{program.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sign-up CTA card */}
              {hasSignupOptions && (
                <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Get Involved
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {program.allowRegistration && (
                      <button
                        onClick={() => setTab('register')}
                        className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        <Users2 className="w-4 h-4" />
                        Register for Event
                      </button>
                    )}
                    {program.allowVolunteer && (
                      <button
                        onClick={() => setTab('volunteer')}
                        className="w-full flex items-center justify-center gap-2 border border-border bg-transparent text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-muted transition-colors"
                      >
                        <HandHeart className="w-4 h-4" />
                        Volunteer
                      </button>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* ── Register / Volunteer tabs ───────────────────────────────────────── */}
        {(activeTab === 'register' || activeTab === 'volunteer') && (
          <div className="max-w-2xl space-y-6">

            {/* Tab intro */}
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {activeTab === 'register' ? 'Event Registration' : 'Volunteer Sign-up'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {activeTab === 'register'
                  ? `Complete the form below to register for "${program.name}".`
                  : `Complete the form below to volunteer for "${program.name}".`}
              </p>
            </div>

            {/* Success state */}
            {formSuccess ? (
              <div className="rounded-2xl border border-border bg-card p-10 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  {activeTab === 'register'
                    ? <Users2 className="w-7 h-7 text-emerald-600" />
                    : <HandHeart className="w-7 h-7 text-emerald-600" />}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-lg text-foreground">
                    {activeTab === 'register' ? 'Registration Received!' : 'Volunteer Sign-up Received!'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Thank you! We'll be in touch with next steps.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setFormSuccess(false); setTab('details') }}
                    className="px-5 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    Back to Details
                  </button>
                  {activeTab === 'register' && program.allowVolunteer && (
                    <button
                      onClick={() => { setFormSuccess(false); setTab('volunteer') }}
                      className="px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      Also Volunteer
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* API error banner */}
                {formError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3">
                    {formError}
                  </div>
                )}

                {activeTab === 'register' ? (
                  <EventRegisterForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    loading={formLoading}
                    formType="register"
                  />
                ) : (
                  <VolunteerRegisterForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    loading={formLoading}
                    formType="volunteer"
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}