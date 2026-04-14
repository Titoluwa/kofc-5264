import { Event } from '@/lib/constants'
import EventInfoCard from '@/components/p-events/infoCards'
import GetInvolvedCTA from '@/components/p-events/getInvolved'

type Tab = 'details' | 'register' | 'volunteer'

interface EventDetailsPanelProps {
    program: Event
    onTabChange: (tab: Tab) => void
}

export default function EventDetailsPanel({ program, onTabChange }: Readonly<EventDetailsPanelProps>) {
    const hasSignupOptions = program.allowRegistration || program.allowVolunteer

    return (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
            <div className="lg:col-span-1 space-y-8">
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg whitespace-pre-line">
                    {program.description}
                </p>
                {program.content && (
                    <div className="prose prose-sm sm:prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: program.content }}/>
                )}
            </div>
            <aside className="space-y-6">
                <EventInfoCard program={program} />
                {hasSignupOptions && (
                    <GetInvolvedCTA program={program} onTabChange={onTabChange} />
                )}
            </aside>
        </div>
    )
}