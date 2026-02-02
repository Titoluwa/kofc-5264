import { Metadata } from 'next';
import { Calendar, Filter } from 'lucide-react';
import { EventCard } from '@/src/components/EventCard';
import { db } from '@/src/db';
import { events, rsvps } from '@/src/db/schema';
import { desc, eq, and } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Community Events',
  description: 'Explore and RSVP to upcoming community events',
};

async function getEvents() {
  const eventsList = await db
    .select()
    .from(events)
    .orderBy(desc(events.startDate))
    .limit(12);

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

  return eventsWithRsvpCounts;
}

export default async function EventsPage() {
  const eventsList = await getEvents();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white bg-opacity-10 rounded-lg">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Community Events
          </h1>
          <p className="text-lg text-slate-300 text-balance max-w-2xl">
            Join us for meaningful gatherings, charity initiatives, and community-building activities.
            RSVP to events below to stay connected.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Upcoming & Past Events
            </h2>
            <p className="text-slate-600 mt-1">
              {eventsList.length} events available
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">Filter</span>
          </div>
        </div>

        {/* Events Grid */}
        {eventsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsList.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  ...event,
                  startDate: new Date(event.startDate),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-slate-100 rounded-lg mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No events yet
            </h3>
            <p className="text-slate-600">
              Check back soon for upcoming community events
            </p>
          </div>
        )}
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-slate-900 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to organize an event?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Contact our events team to propose a community event or activity
          </p>
          <button className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </main>
  );
}
