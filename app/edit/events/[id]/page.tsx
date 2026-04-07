'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    ArrowLeft, Calendar, Clock, MapPin, RotateCcw, Edit2, Trash2,
    Users2, HandHeart, Mail, Phone, Download, Search, X, ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ImageUpload } from '@/components/image-upload'
import { toast } from 'sonner'

// Types

interface Event {
    id: number
    category: string
    name: string
    description: string
    content?: string
    location?: string
    schedule?: string
    images?: string[]
    image?: string
    date: string
    createdAt: string
    updatedAt: string
    allowRegistration?: boolean
    allowVolunteer?: boolean
    notificationEmail?: string
}

interface Signup {
    id: number
    type: 'REGISTRATION' | 'VOLUNTEER'
    firstName: string
    lastName: string
    email: string
    phone?: string
    message?: string
    createdAt: string
}

type SignupFilter = 'ALL' | 'REGISTRATION' | 'VOLUNTEER'

const CATEGORIES = ['charitable', 'faith', 'social', 'volunteer', 'youth', 'other']

const CATEGORY_STYLES: Record<string, { badge: string; dot: string }> = {
    charitable: { badge: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-400' },
    faith: { badge: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-400' },
    social: { badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    volunteer: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
    youth: { badge: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-400' },
    other: { badge: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
}

// Helpers 

function buildDatetime(date: string, time: string) {
    return time ? `${date}T${time}:00` : `${date}T00:00:00`
}

function Skeleton({ className }: Readonly<{ className?: string }>) {
    return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

// Page

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()

    // Event state
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    // Signups state
    const [signups, setSignups] = useState<Signup[]>([])
    const [signupsLoading, setSignupsLoading] = useState(true)
    const [signupSearch, setSignupSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<SignupFilter>('ALL')
    //   const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
    const [expandedSignup, setExpandedSignup] = useState<number | null>(null)
    //   const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)

    // Edit dialog state
    const [editOpen, setEditOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')
    const [formData, setFormData] = useState({
        name: '', category: 'other', description: '', date: '', time: '',
        schedule: '', location: '', image: '',
        allowRegistration: false, allowVolunteer: false, notificationEmail: '',
    })

    // Delete dialog state
    const [deleteOpen, setDeleteOpen] = useState(false)

    // Fetch event
    const fetchEvent = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/events/${id}`)
            if (!res.ok) throw new Error('Failed to fetch event')
            const data: Event = await res.json()
            setEvent(data)

            // Pre-fill edit form
            const d = new Date(data.date)
            const timeStr = d.toTimeString().slice(0, 5)
            setFormData({
                name: data.name,
                category: data.category,
                description: data.description,
                date: d.toISOString().split('T')[0],
                time: timeStr === '00:00' ? '' : timeStr,
                schedule: data.schedule || '',
                location: data.location || '',
                image: data.image || '',
                allowRegistration: data.allowRegistration ?? false,
                allowVolunteer: data.allowVolunteer ?? false,
                notificationEmail: data.notificationEmail || '',
            })
        } catch {
            toast.error('Failed to load event')
        } finally {
            setLoading(false)
        }
    }, [id])

    // Fetch signups
    const fetchSignups = useCallback(async () => {
        try {
            setSignupsLoading(true)
            const res = await fetch(`/api/events/${id}/signup`)
            if (!res.ok) throw new Error('Failed to fetch signups')
            setSignups(await res.json())
        } catch {
            toast.error('Failed to load signups')
        } finally {
            setSignupsLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchEvent()
        fetchSignups()
    }, [fetchEvent, fetchSignups])

    // Edit submit
    const handleSave = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setFormError('')
        setSaving(true)
        try {
            const res = await fetch(`/api/events/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    description: formData.description,
                    date: buildDatetime(formData.date, formData.time),
                    schedule: formData.schedule || undefined,
                    location: formData.location || undefined,
                    image: formData.image || undefined,
                    allowRegistration: formData.allowRegistration,
                    allowVolunteer: formData.allowVolunteer,
                    notificationEmail: (formData.allowRegistration || formData.allowVolunteer)
                        ? formData.notificationEmail || undefined
                        : undefined,
                }),
            })
            if (!res.ok) throw new Error('Failed to update event')
            await fetchEvent()
            setEditOpen(false)
            toast.success('Event updated', { description: `"${formData.name}" has been updated.` })
        } catch {
            setFormError('Failed to save event. Please check your details and try again.')
        } finally {
            setSaving(false)
        }
    }

    // Delete event
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete event')
            toast.success('Event deleted')
            router.push('/edit/events')
        } catch {
            toast.error('Failed to delete event')
        }
    }

    // Update signup status
    //   const handleStatusChange = async (signupId: number, status: Signup['status']) => {
    //     setUpdatingStatus(signupId)
    //     try {
    //       const res = await fetch(`/api/events/${id}/signup/${signupId}`, {
    //         method: 'PATCH',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ status }),
    //       })
    //       if (!res.ok) throw new Error()
    //       setSignups((prev) => prev.map((s) => s.id === signupId ? { ...s, status } : s))
    //       toast.success('Status updated')
    //     } catch {
    //       toast.error('Failed to update status')
    //     } finally {
    //       setUpdatingStatus(null)
    //     }
    //   }

    // Export CSV
    const exportCSV = () => {
        const rows = [
            ['Name', 'Email', 'Phone', 'Type', 'Status', 'Message', 'Signed up'],
            ...filteredSignups.map((s) => [
                `${s.firstName} ${s.lastName}`,
                s.email,
                s.phone ?? '',
                s.type,
                // s.status,
                (s.message ?? '').replaceAll('\n', ' '),
                new Date(s.createdAt).toLocaleDateString(),
            ]),
        ]
        const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${event?.name ?? 'event'}-signups.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Filtered signups
    const filteredSignups = signups.filter((s) => {
        if (typeFilter !== 'ALL' && s.type !== typeFilter) return false
        // if (statusFilter !== 'ALL' && s.status !== statusFilter) return false
        const q = signupSearch.toLowerCase()
        return !q || `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(q)
    })

    const registrationCount = signups.filter((s) => s.type === 'REGISTRATION').length
    const volunteerCount = signups.filter((s) => s.type === 'VOLUNTEER').length

    // Loading state
    if (loading) {
        return (
            <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-6">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-4 items-start">
                    <Skeleton className="h-48 w-48 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
                <p className="text-2xl font-bold">Event not found</p>
                <Link href="/edit/events" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                    <ArrowLeft className="w-4 h-4" /> Back to Events
                </Link>
            </div>
        )
    }

    const eventDate = new Date(event.date)
    const hasTime = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0
    const catStyle = CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES.other

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-8">

                {/* Breadcrumb */}
                <Link
                    href="/edit/events"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Events
                </Link>

                {/* Event overview card */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-0">

                        {/* Image */}
                        {event.image && (
                            <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0">
                                <Image src={event.image} alt={event.name} fill className="object-cover" />
                            </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 p-6 space-y-4">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="space-y-2">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle.badge}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                                        <span className="capitalize">{event.category}</span>
                                    </span>
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{event.name}</h1>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 rounded-lg"
                                        onClick={() => setEditOpen(true)}
                                    >
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                        onClick={() => setDeleteOpen(true)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </Button>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>

                            {/* Meta row */}
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground pt-1">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-accent" />
                                    {eventDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                {hasTime && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-accent" />
                                        {eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                                {event.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-accent" />
                                        {event.location}
                                    </span>
                                )}
                                {event.schedule && (
                                    <span className="flex items-center gap-1.5">
                                        <RotateCcw className="w-3.5 h-3.5 text-accent" />
                                        <span className="italic">{event.schedule}</span>
                                    </span>
                                )}
                            </div>

                            {/* Sign-up option badges */}
                            {(event.allowRegistration || event.allowVolunteer || event.notificationEmail) && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
                                    {event.allowRegistration && (
                                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <Users2 className="w-3 h-3" /> Registration open
                                        </span>
                                    )}
                                    {event.allowVolunteer && (
                                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                                            <HandHeart className="w-3 h-3" /> Volunteer open
                                        </span>
                                    )}
                                    {event.notificationEmail && (
                                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                                            <Mail className="w-3 h-3" /> {event.notificationEmail}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Signup stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Sign-ups', value: signups.length, icon: <Users2 className="w-4 h-4" />, color: 'text-foreground' },
                        { label: 'Registrations', value: registrationCount, icon: <Users2 className="w-4 h-4" />, color: 'text-emerald-600' },
                        { label: 'Volunteers', value: volunteerCount, icon: <HandHeart className="w-4 h-4" />, color: 'text-sky-600' },
                        // { label: 'Confirmed', value: signups.filter((s) => s.status === 'CONFIRMED').length, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-600' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-border bg-card p-4 space-y-1">
                            <div className={`flex items-center gap-1.5 text-xs font-medium text-muted-foreground`}>
                                {stat.icon} {stat.label}
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Signups table */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">

                    {/* Table header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
                        <div>
                            <h2 className="font-semibold text-base">Sign-ups</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {filteredSignups.length} of {signups.length} shown
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="Search name or email…"
                                    className="pl-8 pr-8 h-8 text-xs rounded-lg w-48"
                                    value={signupSearch}
                                    onChange={(e) => setSignupSearch(e.target.value)}
                                />
                                {signupSearch && (
                                    <button onClick={() => setSignupSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* Type filter */}
                            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as SignupFilter)}>
                                <SelectTrigger className="h-8 text-xs rounded-lg w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="REGISTRATION">Registration</SelectItem>
                                    <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Status filter */}
                            {/* <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="h-8 text-xs rounded-lg w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select> */}

                            {/* Export */}
                            {signups.length > 0 && (
                                <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg gap-1.5" onClick={exportCSV}>
                                    <Download className="w-3.5 h-3.5" /> Export CSV
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Loading */}
                    {signupsLoading && (
                        <div className="p-5 space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i.toFixed()} className="h-14 w-full rounded-xl" />
                            ))}
                        </div>
                    )}

                    {/* Empty */}
                    {!signupsLoading && signups.length === 0 && (
                        <div className="py-16 text-center text-muted-foreground">
                            <Users2 className="w-8 h-8 mx-auto mb-3 opacity-30" />
                            <p className="font-medium text-sm">No sign-ups yet</p>
                            <p className="text-xs mt-1">Sign-ups will appear here once people register or volunteer.</p>
                        </div>
                    )}

                    {/* No match */}
                    {!signupsLoading && signups.length > 0 && filteredSignups.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                            No sign-ups match your current filters.
                        </div>
                    )}

                    {/* Signup rows */}
                    {!signupsLoading && filteredSignups.length > 0 && (
                        <div className="divide-y divide-border/60">
                            {filteredSignups.map((signup) => {
                                // const statusCfg = STATUS_CONFIG[signup.status]
                                const isExpanded = expandedSignup === signup.id

                                return (
                                    <div key={signup.id} className="hover:bg-muted/30 transition-colors">
                                        {/* Main row */}
                                        <div className="flex items-center gap-4 px-5 py-3.5">

                                            {/* Avatar initial */}
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                                                {signup.firstName[0]}{signup.lastName[0]}
                                            </div>

                                            {/* Name + email */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {signup.firstName} {signup.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">{signup.email}</p>
                                            </div>

                                            {/* Type badge */}
                                            <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${signup.type === 'REGISTRATION'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-sky-50 text-sky-700 border-sky-200'
                                                }`}>
                                                {signup.type === 'REGISTRATION'
                                                    ? <><Users2 className="w-3 h-3" /> Register</>
                                                    : <><HandHeart className="w-3 h-3" /> Volunteer</>}
                                            </span>

                                            {/* Status selector */}
                                            {/* <Select
                        value={signup.status}
                        onValueChange={(v) => handleStatusChange(signup.id, v as Signup['status'])}
                        disabled={updatingStatus === signup.id}
                      >
                        <SelectTrigger className={`h-7 text-xs rounded-lg w-32 border font-medium ${statusCfg.classes}`}>
                          <span className="flex items-center gap-1.5">
                            {statusCfg.icon} {statusCfg.label}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-1.5 text-xs">
                                {cfg.icon} {cfg.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}

                                            {/* Expand toggle */}
                                            <button
                                                onClick={() => setExpandedSignup(isExpanded ? null : signup.id)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Expanded detail */}
                                        {isExpanded && (
                                            <div className="px-5 pb-4 pt-0 ml-12 space-y-2 text-sm border-t border-border/40 bg-muted/20">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                                                    {signup.phone && (
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                                                            <span>{signup.phone}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                                                        <a href={`mailto:${signup.email}`} className="hover:text-foreground hover:underline truncate">
                                                            {signup.email}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
                                                        <span>Signed up {new Date(signup.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                                {signup.message && (
                                                    <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground whitespace-pre-line mt-2">
                                                        {signup.message}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>Update the event details below.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-5 pt-2">
                        {formError && (
                            <Alert variant="destructive">
                                <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name *</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="capitalize">
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description">Short Description *</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="date">Date *</Label>
                                <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="time">Time <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                <Input id="time" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="schedule">Recurring Schedule <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Input id="schedule" placeholder="e.g. Every 2nd Saturday" value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location">Location <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Input id="location" placeholder="Venue or address" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                        </div>

                        <div className="space-y-1.5">
                            <ImageUpload value={formData.image} onChange={(url) => setFormData((p) => ({ ...p, image: url }))} label="Hero / Cover Image" />
                        </div>

                        <div className="space-y-2">
                            <Label>Sign-up Options</Label>
                            <div className="flex flex-col gap-2 pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                                        checked={formData.allowRegistration}
                                        onChange={(e) => setFormData({ ...formData, allowRegistration: e.target.checked })}
                                    />
                                    <span className="text-sm group-hover:text-foreground transition-colors">Allow Registration</span>
                                </label>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                                        checked={formData.allowVolunteer}
                                        onChange={(e) => setFormData({ ...formData, allowVolunteer: e.target.checked })}
                                    />
                                    <span className="text-sm group-hover:text-foreground transition-colors">Allow Volunteer Sign-up</span>
                                </label>
                            </div>
                        </div>

                        {(formData.allowRegistration || formData.allowVolunteer) && (
                            <div className="space-y-1.5">
                                <Label htmlFor="notificationEmail">
                                    Notification Email <span className="text-muted-foreground text-xs">(receives sign-up alerts)</span>
                                </Label>
                                <Input
                                    id="notificationEmail"
                                    type="email"
                                    placeholder="e.g. coordinator@example.com"
                                    value={formData.notificationEmail}
                                    onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full rounded-xl" disabled={saving}>
                            {saving ? 'Saving…' : 'Update Event'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog  */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Event</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-foreground">"{event.name}"</span>?
                            This will also remove all {signups.length} sign-up{signups.length === 1 ? '' : 's'}. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-2 justify-end mt-2">
                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg">
                            Delete Event
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}