'use client'

import Link from 'next/link'
import { Calendar, MapPin, Clock, RotateCcw, Users, Tag } from 'lucide-react'
import Image from 'next/image'
import { Event, CATEGORY_LABELS, CATEGORY_ACCENT } from '@/lib/constants'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export default function EventModal({ event, onClose }: Readonly<{ event: Event; onClose: () => void }>) {
    const eventDate = new Date(event.date)
    const dateLabel = eventDate.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    const timeLabel = eventDate.toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit',
    })
    const hasTime  = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0
    const catStyle = CATEGORY_ACCENT[event.category] ?? CATEGORY_ACCENT.other
    const catLabel = CATEGORY_LABELS[event.category] ?? event.category

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="p-0 gap-0 max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border shadow-2xl">
                
                {/* Visually hidden title for accessibility */}
                <DialogTitle className="sr-only">{event.name}</DialogTitle>

                {/* Image carousel (if images exist) */}
                {event.image && (
                    <div className="relative h-64 sm:h-72 shrink-0 bg-muted overflow-hidden">
                        <Image src={event.image} alt={event.name} fill className="object-cover"/>
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                            {catLabel}
                        </span>
                        </div>
                    </div>
                )}

                {/* Scrollable body */}
                <div className="flex flex-col overflow-y-auto">

                <div className="px-6 pt-5 pb-6 space-y-5">
                    {/* Title */}
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-snug">
                        {event.name}
                    </h2>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-accent shrink-0" />
                            <span className="font-medium text-foreground">{dateLabel}</span>
                        </div>
                        {hasTime && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span>{timeLabel}</span>
                        </div>
                    )}
                    {event.location && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-accent shrink-0" />
                        <span>{event.location}</span>
                        </div>
                    )}
                    {event.schedule && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <RotateCcw className="w-4 h-4 text-accent shrink-0" />
                        <span className="italic">{event.schedule}</span>
                        </div>
                    )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/70" />

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-line">
                        {event.description}
                    </p>

                    {/* Extra fields */}
                    {(event as any).capacity && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-accent shrink-0" />
                            <span>Capacity: <span className="text-foreground font-medium">{(event as any).capacity}</span></span>
                        </div>
                    )}
                    {(event as any).tags?.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Tag className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div className="flex flex-wrap gap-1.5">
                        {(event as any).tags.map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-foreground/70">
                            {tag}
                            </span>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        {event.allowRegistration && (
                            <Link href={`/programs/${event.id}?tab=register`} className="flex-1 bg-accent text-accent-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity text-center">
                                Register
                            </Link>
                        )}
                        {event.allowVolunteer && (
                            <Link href={`/programs/${event.id}?tab=volunteer`} className="flex-1 border border-border bg-transparent text-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-muted transition-colors text-center">
                                Volunteer
                            </Link>
                        )}
                    </div>
                </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}