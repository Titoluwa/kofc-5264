'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { PaginationMeta, PAGE_SIZE } from '@/lib/constants'
import Pagination from '@/components/admin/pagination'
import { Trash2, Edit2, Plus, Calendar, MapPin, Clock, Search, CalendarDays, X, Eye } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { ImageUpload } from '@/components/image-upload'
import { EventCardSkeleton } from '@/components/skeleton'

interface Event {
  id: number
  category: string
  name: string
  description: string
  content?: string
  location?: string
  schedule?: string
  images?: string[]
  image: string
  date: string
  createdAt: string
  updatedAt: string
  allowRegistration?: boolean
  allowVolunteer?: boolean
  notificationEmail?: string
}

const CATEGORIES = ['charitable', 'faith', 'social', 'volunteer', 'youth', 'other']

const CATEGORY_STYLES: Record<string, { badge: string; dot: string }> = {
  charitable: { badge: 'bg-rose-100 text-rose-700 border-rose-200',   dot: 'bg-rose-400' },
  faith:      { badge: 'bg-sky-100 text-sky-700 border-sky-200',       dot: 'bg-sky-400' },
  social:     { badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
  volunteer:  { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  youth:      { badge: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-400' },
  other:      { badge: 'bg-gray-100 text-gray-600 border-gray-200',    dot: 'bg-gray-400' },
}

const emptyForm = {
  name: '',
  category: 'other',
  description: '',
  date: '',
  time: '',
  schedule: '',
  location: '',
  images: '',
  image: '',
  allowRegistration: false,
  allowVolunteer: false,
  notificationEmail: '',
}

function buildDatetime(date: string, time: string) {
  return time ? `${date}T${time}:00` : `${date}T00:00:00`
}

function parseImages(raw: string) {
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState(emptyForm)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load events',{
        description: 'There was a problem fetching events. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  // Reset to page 1 on filter/search change
  useEffect(() => { setCurrentPage(1) }, [filterCategory, search])

  const getEventPayload = () => {
    // const datetime = buildDatetime(formData.date, formData.time)
    const images = parseImages(formData.images)
    const notificationEmail = (formData.allowRegistration || formData.allowVolunteer)
      ? formData.notificationEmail || undefined
      : undefined

    return {
      category: formData.category,
      description: formData.description,
      schedule: formData.schedule || undefined,
      location: formData.location || undefined,
      images: images.length > 0 ? images : undefined,
      image: formData.image || undefined,
      allowRegistration: formData.allowRegistration,
      allowVolunteer: formData.allowVolunteer,
      notificationEmail,
    }
  }

  const saveEvent = async () => {
    const payload = getEventPayload()
    const datetime = buildDatetime(formData.date, formData.time)
    if (editingId) {
      const res = await fetch(`/api/events/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, name: formData.name, date: datetime }),
      })
      if (!res.ok) throw new Error('Failed to update event')
    } else {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, title: formData.name, datetime }),
      })
      if (!res.ok) throw new Error('Failed to create event')
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)

    try {
      await saveEvent()
      await fetchEvents()
      closeDialog()
      toast.success(editingId ? 'Event updated' : 'Event created', {
        description: editingId
          ? `"${formData.name}" has been updated.`
          : `"${formData.name}" has been added to the schedule.`,
      })
    } catch {
      setFormError('Failed to save event. Please check your details and try again.')
      toast.error(editingId ? 'Failed to update event' : 'Failed to create event', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (event: Event) => {
    const d = new Date(event.date)
    const timeStr = d.toTimeString().slice(0, 5)
    setEditingId(event.id)
    setFormData({
      name: event.name,
      category: event.category,
      description: event.description,
      date: d.toISOString().split('T')[0],
      time: timeStr === '00:00' ? '' : timeStr,
      schedule: event.schedule || '',
      location: event.location || '',
      images: Array.isArray(event.images) ? event.images.join(', ') : '',
      image: event.image || '',
      allowRegistration: event.allowRegistration ?? false,
      allowVolunteer: event.allowVolunteer ?? false,
      notificationEmail: event.notificationEmail || '',
    })
    setIsOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const target = events.find((e) => e.id === deleteId)
    try {
      const res = await fetch(`/api/events/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchEvents()
      setDeleteId(null)
      toast.success('Event deleted', {
        description: target ? `"${target.name}" has been removed.` : 'The event has been removed.',
      })
    } catch {
      toast.error('Failed to delete event', {
        description: 'Something went wrong while removing this event.',
      })
    }
  }

  const closeDialog = () => {
    setIsOpen(false)
    setEditingId(null)
    setFormData(emptyForm)
    setFormError('')
  }

  // Filter + search
  const filteredEvents = events.filter((e) => {
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    limit: PAGE_SIZE,
    total: filteredEvents.length,
    totalPages: Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE)),
  }

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const eventToDelete = events.find((e) => e.id === deleteId)

  let submitButtonText = 'Create Event'
  if (saving) {
    submitButtonText = 'Saving…'
  } else if (editingId) {
    submitButtonText = 'Update Event'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-1">
            {/* <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold tracking-widest uppercase mb-2">
              <CalendarDays className="w-4 h-4" />
              <span>Event Management</span>
            </div> */}
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Events & Programs</h1>
              {!loading && (
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-sm">
                  {events.length}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Create and manage upcoming events and programs
            </p>
          </div>

          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              if (open) {
                // Reset form when opening fresh (not when closing)
                setEditingId(null);
                setFormData(emptyForm);
                setFormError('');
              } else {
                closeDialog();
              }
              setIsOpen(open);
            }}
          >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogDescription>
                  {editingId
                    ? 'Update the event details below.'
                    : 'Fill in the details for the new event or program.'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                {formError && (
                  <Alert variant="destructive">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Event or program name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
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
                  <Textarea
                    id="description"
                    placeholder="Brief summary shown in listings"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="time">
                      Time{' '}
                      <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="schedule">
                    Recurring Schedule{' '}
                    <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="schedule"
                    placeholder="e.g. Every 2nd Saturday, Weekly on Thursdays"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">
                    Location{' '}
                    <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="Venue or address"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* <div className="space-y-1.5">
                  <Label htmlFor="images">
                    Image URLs{' '}
                    <span className="text-muted-foreground text-xs">(optional, comma-separated)</span>
                  </Label>
                  <Textarea
                    id="images"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    rows={2}
                  />
                </div> */}
                <div className='space-y-1.5'>
                  <ImageUpload
                    value={formData.image}
                    onChange={url => setFormData(p => ({ ...p, image: url }))}
                    label="Hero / Cover Image"
                  />
                </div>
                {/* Registration / Volunteer checkboxes */}
                <div className="space-y-2">
                  <Label>Sign-up Options</Label>
                  <div className="flex flex-col gap-2 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                        checked={formData.allowRegistration}
                        onChange={(e) =>
                          setFormData({ ...formData, allowRegistration: e.target.checked })
                        }
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">
                        Allow Registration
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                        checked={formData.allowVolunteer}
                        onChange={(e) =>
                          setFormData({ ...formData, allowVolunteer: e.target.checked })
                        }
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">
                        Allow Volunteer Sign-up
                      </span>
                    </label>
                  </div>
                </div>

                {/* Notification email — shown only when at least one checkbox is checked */}
                {(formData.allowRegistration || formData.allowVolunteer) && (
                  <div className="space-y-1.5">
                    <Label htmlFor="notificationEmail">
                      Notification Email{' '}
                      <span className="text-muted-foreground text-xs">(receives sign-up alerts)</span>
                    </Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      placeholder="e.g. coordinator@example.com"
                      value={formData.notificationEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, notificationEmail: e.target.value })
                      }
                    />
                  </div>
                )}

                <Button type="submit" className="w-full rounded-xl" disabled={saving}>
                  {submitButtonText}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search + Category filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search events by name, location…"
              className="pl-9 pr-9 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5">
            {['all', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 capitalize ${
                  filterCategory === cat
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i.toFixed()} />)}
          </div>
        )}

        {/* Empty states */}
        {!loading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-2xl bg-muted/20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CalendarDays className="w-7 h-7 text-muted-foreground opacity-60" />
            </div>
            <p className="font-semibold text-lg">No events yet</p>
            <p className="text-muted-foreground text-sm mt-1 mb-5">
              Add your first event or program to get started.
            </p>
            <Button
              className="gap-2 rounded-xl"
              onClick={() => { setEditingId(null); setFormData(emptyForm); setIsOpen(true) }}
            >
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        )}

        {!loading && events.length > 0 && filteredEvents.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p className="font-medium">
              No events match{search ? ` "${search}"` : ''}{filterCategory === 'all' ? '' : ` in "${filterCategory}"`}
            </p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Event cards */}
        {!loading && filteredEvents.length > 0 && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedEvents.map((event) => {
                const eventDate = new Date(event.date)
                const hasTime = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0
                const catStyle = CATEGORY_STYLES[event.category] ?? CATEGORY_STYLES.other

                return (
                  <Card
                    key={event.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border hover:shadow-md hover:border-border/80 transition-all duration-200"
                  >
                    {/* Image / placeholder */}
                    <div className="relative w-full h-44 bg-muted overflow-hidden shrink-0">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <CalendarDays className="w-10 h-10 text-muted-foreground opacity-30" />
                        </div>
                      )}
                      {/* Category badge overlaid on image */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${catStyle.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                          <span className="capitalize">{event.category}</span>
                        </span>
                      </div>
                      {/* Action buttons overlaid on image */}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/edit/events/${event.id}`}
                          className="w-7 h-7 rounded-lg bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
                          title="View event"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(event)}
                          className="w-7 h-7 rounded-lg bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
                          title="Edit event"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(event.id)}
                          className="w-7 h-7 rounded-lg bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-base leading-snug line-clamp-2">
                        {event.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-3 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>

                      <div className="mt-auto pt-3 border-t border-border/60 space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {eventDate.toLocaleDateString(undefined, {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {hasTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {eventDate.toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                        {event.schedule && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 shrink-0 opacity-50" />
                            <span className="italic">{event.schedule}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Pagination
              meta={paginationMeta}
              onPageChange={(p) => {
                setCurrentPage(p)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </div>
        )}

        {/* Delete confirmation */}
        <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                <p>Are you sure you want to delete{' '}
                  <span className="font-semibold text-foreground">
                    {eventToDelete ? `"${eventToDelete.name}"` : 'this event'}
                  </span>
                  {'? This action cannot be undone.'}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end mt-2">
              <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg"
              >
                Delete Event
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  )
}