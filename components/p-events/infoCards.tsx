import { Calendar, Clock, RotateCcw, MapPin } from 'lucide-react'
import { Event } from '@/lib/constants'

export default function EventInfoCard({ program }: Readonly<{ program: Event }>) {
    const eventDate = new Date(program.date)
    const hasTime = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0

    return (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Event Details
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">
                        {program.date
                        ? new Date(program.date).toLocaleDateString(undefined, {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                            })
                        : 'TBD'}
                    </span>
                </div>
                {hasTime && (
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-accent shrink-0" />
                        <span>
                            {program.date ? eventDate.toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                              }) : 'TBD'}
                        </span>
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
    )
}