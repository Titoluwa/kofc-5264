import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEventParticipationNotification } from '@/lib/email'

type EventParticipationType = 'registered' | 'volunteered';

export async function GET( _req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const eventId = Number.parseInt(params.id)
        if (Number.isNaN(eventId)) {
        return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
        }

        const signups = await prisma.eventSignup.findMany({
        where: { eventId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            type: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            message: true,
            createdAt: true,
        },
        })

        return NextResponse.json(signups)
    } catch (error) {
        console.error('Failed to fetch signups:', error)
        return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {

        const { type, firstName, lastName, email, phone, street, city, state, zipcode, additionalMessage, eventId } = await request.json()
        if (Number.isNaN(eventId)) {
            return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
        }

        // Verify the event exists and the requested signup type is enabled
        const event = await prisma.event.findUnique({
        where: { id: eventId },
            select: {
                id: true,
                name: true,
                allowRegistration: true,
                allowVolunteer: true,
                notificationEmail: true,
            },
        })

        if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 })
        }

        // Validate required fields
        if (!type || !firstName || !lastName || !email) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate type is a valid enum value
        if (type !== 'REGISTRATION' && type !== 'VOLUNTEER') {
        return NextResponse.json({ error: 'Invalid signup type' }, { status: 400 })
        }

        // Check the event allows this signup type
        if (type === 'REGISTRATION' && !event.allowRegistration) {
        return NextResponse.json({ error: 'Registration is not open for this event' }, { status: 403 })
        }
        if (type === 'VOLUNTEER' && !event.allowVolunteer) {
        return NextResponse.json({ error: 'Volunteer signup is not open for this event' }, { status: 403 })
        }
        let participationType  = 'registered' ;
        if(type === 'VOLUNTEER'){
            participationType  = 'volunteered' 
        }

        const addressBlock = [street, city, state, zipcode].filter(Boolean).join(', ')
        const fullMessage = [
        addressBlock ? `Address: ${addressBlock}` : null,
        additionalMessage || null,
        ].filter(Boolean).join('\n\n') || undefined

        const signup = await prisma.eventSignup.create({
            data: {
                eventId: Number(eventId),
                type,
                firstName,
                lastName,
                email,
                phone: phone || undefined,
                message: fullMessage,
            },
        })

        await sendEventParticipationNotification({ 
            member: signup, 
            event: { id: event.id.toString(), title: event.name},
            participationType: participationType as EventParticipationType, 
            notifyEmail: event.notificationEmail || "admin@kofc5264.ca"
        })

        return NextResponse.json(signup, { status: 201 })
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return NextResponse.json(
                { error: 'You have already signed up for this event in this role.' },
                { status: 409 }
            )
        }
        console.error('Failed to create signup:', error)
        return NextResponse.json({ error: 'Failed to create signup' }, { status: 500 })
    }
}