'use server';

import { revalidateTag } from 'next/cache';
import { db } from '@/src/db';
import { rsvps, users, events } from '@/src/db/schema';
import { eq, and } from 'drizzle-orm';

interface RSVPActionParams {
  eventId: number;
  userId: number;
  status: 'going' | 'maybe' | 'not_going' | 'cancelled';
  guestCount?: number;
  notes?: string;
}

/**
 * Server Action to handle RSVP submission
 * - Validates event exists in Payload
 * - Ensures user exists in Payload Users collection
 * - Records RSVP in Drizzle-managed table
 */
export async function submitRSVP(params: RSVPActionParams) {
  try {
    const { eventId, userId, status, guestCount = 1, notes } = params;

    console.log('[RSVP] Submitting RSVP:', { eventId, userId, status, guestCount });

    // Step 1: Verify event exists
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (event.length === 0) {
      throw new Error(`Event with ID ${eventId} not found`);
    }

    // Step 2: Verify user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Step 3: Check if RSVP already exists for this user and event
    const existingRsvp = await db
      .select()
      .from(rsvps)
      .where(
        and(
          eq(rsvps.eventId, eventId),
          eq(rsvps.userId, userId)
        )
      )
      .limit(1);

    let result;
    if (existingRsvp.length > 0) {
      // Update existing RSVP
      result = await db
        .update(rsvps)
        .set({
          status,
          guestCount,
          notes,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(rsvps.eventId, eventId),
            eq(rsvps.userId, userId)
          )
        )
        .returning();

      console.log('[RSVP] Updated existing RSVP:', result);
    } else {
      // Insert new RSVP
      result = await db
        .insert(rsvps)
        .values({
          eventId,
          userId,
          status,
          guestCount,
          notes,
        })
        .returning();

      console.log('[RSVP] Created new RSVP:', result);
    }

    // Revalidate event page cache
    revalidateTag(`event-${eventId}`, 'max');
    revalidateTag('events-list', 'max');

    return {
      success: true,
      message: existingRsvp.length > 0 ? 'RSVP updated successfully' : 'RSVP submitted successfully',
      rsvp: result[0],
    };
  } catch (error) {
    console.error('[RSVP] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit RSVP',
    };
  }
}

/**
 * Server Action to cancel an RSVP
 */
export async function cancelRSVP(eventId: number, userId: number) {
  try {
    console.log('[RSVP] Cancelling RSVP:', { eventId, userId });

    await db
      .update(rsvps)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(rsvps.eventId, eventId),
          eq(rsvps.userId, userId)
        )
      );

    // Revalidate cache
    revalidateTag(`event-${eventId}`, 'max');
    revalidateTag('events-list', 'max');

    return {
      success: true,
      message: 'RSVP cancelled successfully',
    };
  } catch (error) {
    console.error('[RSVP] Cancel error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to cancel RSVP',
    };
  }
}

/**
 * Fetch RSVPs for a specific event
 */
export async function fetchEventRSVPs(eventId: number) {
  try {
    const eventRsvps = await db
      .select()
      .from(rsvps)
      .where(eq(rsvps.eventId, eventId));

    return {
      success: true,
      count: eventRsvps.length,
      rsvps: eventRsvps,
    };
  } catch (error) {
    console.error('[RSVP] Fetch error:', error);
    return {
      success: false,
      rsvps: [],
      count: 0,
    };
  }
}
