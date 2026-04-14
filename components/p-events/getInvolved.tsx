import { Users2, HandHeart } from 'lucide-react'
import { Event } from '@/lib/constants'

type Tab = 'details' | 'register' | 'volunteer'

interface GetInvolvedCTAProps {
    program: Event
    onTabChange: (tab: Tab) => void
}

export default function GetInvolvedCTA({ program, onTabChange }: Readonly<GetInvolvedCTAProps>) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Get Involved
            </h3>
            <div className="flex flex-col gap-2.5">
                {program.allowRegistration && (
                    <button onClick={() => onTabChange('register')} className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                        <Users2 className="w-4 h-4" />
                        Register for Event
                    </button>
                )}
                {program.allowVolunteer && (
                    <button onClick={() => onTabChange('volunteer')} className="w-full flex items-center justify-center gap-2 border border-border bg-transparent text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-muted transition-colors">
                        <HandHeart className="w-4 h-4" />
                        Volunteer
                    </button>
                )}
            </div>
        </div>
    )
}