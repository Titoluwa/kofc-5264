'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Event } from '@/lib/constants'
import EventHero from '@/components/p-events/hero'
import EventTabs from '@/components/p-events/tabs'
import EventDetailsPanel from '@/components/p-events/detailsPanel'
import EventFormPanel from '@/components/p-events/formPanel'
import { Skeleton } from '@/components/ui/skeleton'

type Tab = 'details' | 'register' | 'volunteer'

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', zipcode: '', additionalMessage: '', volunteersToken: '',
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

export default function ProgramDetailsPage() {
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
    if (!program) return

    setFormLoading(true)
    setFormError('')
    
    if (activeTab === 'volunteer') {
      if(formData.volunteersToken === '' || formData.volunteersToken === null || formData.volunteersToken === undefined) {
        setFormError('Please enter the required token to volunteer for this event')
        setFormLoading(false)
        return
      }
      if(formData.volunteersToken !== program.volunteersToken) {
        setFormError('Please enter the correct token to volunteer for this event')
        setFormLoading(false)
        return
      }
    }
    
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
        <Link href="/programs" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </div>
    )
  }

  const hasSignupOptions = program.allowRegistration || program.allowVolunteer
  const tabs = [
    { key: 'details' as Tab, label: 'Details' },
    ...(program.allowRegistration ? [{ key: 'register' as Tab, label: 'Register' }] : []),
    ...(program.allowVolunteer   ? [{ key: 'volunteer' as Tab, label: 'Volunteer' }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      {program.image && <EventHero name={program.name} image={program.image} />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <Link href="/programs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>

        {!program.image && (
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {program.name}
          </h1>
        )}

        {hasSignupOptions && (
          <EventTabs tabs={tabs} activeTab={activeTab} onTabChange={setTab} />
        )}

        {activeTab === 'details' && (
          <EventDetailsPanel program={program} onTabChange={setTab} />
        )}

        {(activeTab === 'register' || activeTab === 'volunteer') && (
          <EventFormPanel
            program={program}
            activeTab={activeTab}
            formData={formData}
            formLoading={formLoading}
            formSuccess={formSuccess}
            formError={formError}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onBackToDetails={() => { setFormSuccess(false); setTab('details') }}
            onAlsoVolunteer={() => { setFormSuccess(false); setTab('volunteer') }}
          />
        )}
      </div>
    </div>
  )
}