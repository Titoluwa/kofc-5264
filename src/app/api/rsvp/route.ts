import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { rsvps } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/rsvp?eventId=1&userId=2
 * Fetch RSVP status for a user at a specific event
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Missing eventId or userId' },
        { status: 400 }
      );
    }

    const rsvp = await db
      .select()
      .from(rsvps)
      .where(
        and(
          eq(rsvps.eventId, parseInt(eventId)),
          eq(rsvps.userId, parseInt(userId))
        )
      )
      .limit(1);

    return NextResponse.json({
      success: true,
      rsvp: rsvp[0] || null,
    });
  } catch (error) {
    console.error('[API RSVP GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rsvp?eventId=1&userId=2
 * Delete an RSVP record
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userId = searchParams.get('userId');

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Missing eventId or userId' },
        { status: 400 }
      );
    }

    await db
      .delete(rsvps)
      .where(
        and(
          eq(rsvps.eventId, parseInt(eventId)),
          eq(rsvps.userId, parseInt(userId))
        )
      );

    return NextResponse.json({
      success: true,
      message: 'RSVP deleted successfully',
    });
  } catch (error) {
    console.error('[API RSVP DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
