import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET( _req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params
        const eventId = Number.parseInt(resolvedParams.id)
        if (Number.isNaN(eventId)) {
            return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
        }

        const signups = await prisma.eventSignup.findMany({
            where: { eventId, type: 'VOLUNTEER' },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                createdAt: true,
            },
        })

        return NextResponse.json(signups)
    } catch (error) {
        console.error('Failed to fetch signups:', error)
        return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 })
    }
}