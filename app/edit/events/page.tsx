'use client'

import { useEffect, useState } from 'react'
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
import { Trash2, Edit2, Plus, Calendar, MapPin, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react'

interface Event {
  id: number
  category: string
  name: string
  description: string
  content?: string
  location?: string
  schedule?: string
  images?: string[]
  date: string
  createdAt: string
  updatedAt: string
}

const CATEGORIES = ['charitable', 'faith', 'social', 'volunteer', 'youth', 'other']

const CATEGORY_COLORS: Record<string, string> = {
  charitable: 'bg-rose-100 text-rose-700',
  faith: 'bg-blue-100 text-blue-700',
  social: 'bg-amber-100 text-amber-700',
  volunteer: 'bg-green-100 text-green-700',
  youth: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
}

const PAGE_SIZE = 6

const emptyForm = {
  name: '',
  category: 'other',
  description: '',
  date: '',
  time: '',
  schedule: '',
  location: '',
  images: '',
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
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')

    const datetime = buildDatetime(formData.date, formData.time)
    const images = parseImages(formData.images)

    try {
      if (editingId) {
        const response = await fetch(`/api/events/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            description: formData.description,
            date: datetime,
            schedule: formData.schedule || undefined,
            location: formData.location || undefined,
            images: images.length > 0 ? images : undefined,
          }),
        })
        if (!response.ok) throw new Error("failed to fetch")
      } else {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.name,
            category: formData.category,
            description: formData.description,
            datetime,
            schedule: formData.schedule || undefined,
            location: formData.location || undefined,
            images: images.length > 0 ? images : undefined,
          }),
        })
        if (!response.ok) throw new Error("Failed")
      }

      await fetchEvents()
      closeDialog()
    } catch {
      setError('Failed to save event')
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
    })
    setIsOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const response = await fetch(`/api/events/${deleteId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error("failed:")
      await fetchEvents()
      setDeleteId(null)
    } catch {
      setError('Failed to delete event')
    }
  }

  const closeDialog = () => {
    setIsOpen(false)
    setEditingId(null)
    setFormData(emptyForm)
    setError('')
  }

  const handleFilterChange = (category: string) => {
    setFilterCategory(category)
    setPage(1)
  }

  const filteredEvents =
    filterCategory === 'all' ? events : events.filter((e) => e.category === filterCategory)

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE)
  const paginatedEvents = filteredEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events & Programs</h1>
          <p className="text-muted-foreground mt-1">Create and manage upcoming events and programs</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog() }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setFormData(emptyForm) }}>
              <Plus className="w-4 h-4 mr-2" />
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
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
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
                    Time (24-hours){' '}
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

              <div className="space-y-1.5">
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
              </div>

              <Button type="submit" className="w-full">
                {editingId ? 'Update Event' : 'Create Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilterChange(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${filterCategory === cat
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background border-border hover:border-foreground'
              }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Event cards */}
      {loading && (
        <div className="text-center py-20 text-muted-foreground">Loading events…</div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <Card>
          <CardContent className="pt-8 pb-8 text-center text-muted-foreground">
            {filterCategory === 'all'
              ? 'No events yet. Click "Add Event" to create one.'
              : `No events in the "${filterCategory}" category.`}
          </CardContent>
        </Card>
      )}

      {!loading && filteredEvents.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedEvents.map((event) => {
              const eventDate = new Date(event.date)
              const hasTime = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0
              const firstImage =
                Array.isArray(event.images) && event.images.length > 0
                  ? event.images[0]
                  : '/placeholder.svg'

              return (
                <Card key={event.id} className="flex flex-col overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={firstImage} alt={event.name} className="w-full h-40 object-cover" />

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight truncate">
                          {event.name}
                        </CardTitle>
                        <div className="mt-1">
                          <Badge
                            className={`text-xs capitalize ${CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.other}`}
                            variant="outline"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDeleteId(event.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col gap-3 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 mt-auto pt-3 border-t border-border text-xs text-muted-foreground">
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
                          <Clock className="w-3.5 h-3.5 shrink-0 opacity-60" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-full border border-border bg-background hover:border-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-medium border transition-colors ${p === page
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background border-border hover:border-foreground'
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-full border border-border bg-background hover:border-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => { if (!open) setDeleteId(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}