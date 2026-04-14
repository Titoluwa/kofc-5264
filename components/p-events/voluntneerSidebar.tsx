'use client'

import { useEffect, useState } from 'react';

interface Volunteer {
    id: number
    firstName: string
    lastName: string
}

interface VolunteerSidebarProps {
    eventId: string | number
    refreshKey?: boolean
}

export default function VolunteerSidebar({ eventId, refreshKey }: Readonly<VolunteerSidebarProps>) {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const res = await fetch(`/api/events/${eventId}/volunteers`)
                if (!res.ok) throw new Error('Failed to fetch volunteers')
                const data = await res.json()
                setVolunteers(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchVolunteers()
    }, [eventId, refreshKey])

    const renderContent = () => {
        if (loading) {
            return (
                <div className="space-y-2">
                    {[1, 2, 3].map((skeletonId) => (
                        <div key={skeletonId} className="h-4 rounded bg-muted animate-pulse w-3/4" />
                    ))}
                </div>
            )
        }

        if (volunteers.length === 0) {
            return (
                <p className="text-sm text-muted-foreground italic">
                    No volunteers yet — be the first!
                </p>
            )
        }

        return (
            <ol className="space-y-1 list-decimal h-64 overflow-y-auto">
                {volunteers.map((v, index) => (
                    <li key={v.id} className="text-sm text-foreground flex items-center gap-1">
                        <span className="w-6 h-6 rounded-full text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                            {/* {v.firstName?.[0]}{v.lastName?.[0]} */}
                            {index + 1}
                        </span>
                        {v.firstName} {v.lastName}
                    </li>
                ))}
            </ol>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 h-fit">
            <div className="flex items-center">
                <h3 className="font-semibold text-sm text-accent uppercase tracking-wide">
                    Signed Up
                </h3>
            </div>

            {renderContent()}
        </div>
    )
}