import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { events, rsvps } from '@/src/db/schema';
import { desc, and, gte, asc, eq } from 'drizzle-orm';

/**
 * GET /api/events?upcoming=true
 * Fetch events with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = db.select().from(events);

    if (upcoming) {
      // Get events with start date in the future
      query = db
        .select()
        .from(events)
        .where(gte(events.startDate, new Date()))
        .orderBy(asc(events.startDate))
        .limit(limit);
    } else {
      query = db
        .select()
        .from(events)
        .orderBy(desc(events.startDate))
        .limit(limit);
    }

    const eventsList = await query;

    // Fetch RSVP counts for each event
    const eventsWithRsvpCounts = await Promise.all(
      eventsList.map(async (event) => {
        const rsvpCount = await db
          .select()
          .from(rsvps)
          .where(
            and(
              eq(rsvps.eventId, event.id),
              eq(rsvps.status, 'going')
            )
          );

        return {
          ...event,
          rsvpCount: rsvpCount.length,
        };
      })
    );

    return NextResponse.json({
      success: true,
      events: eventsWithRsvpCounts,
    });
  } catch (error) {
    console.error('[API Events GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
