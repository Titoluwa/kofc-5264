'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitRSVP } from '@/src/app/actions/rsvp';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description?: string;
    startDate: Date;
    location: string;
    capacity?: number;
    imageUrl?: string;
    category?: string;
    rsvpCount?: number;
  };
  userId?: number;
  currentStatus?: string;
  onRsvpSuccess?: () => void;
}

export function EventCard({ event, userId, currentStatus, onRsvpSuccess }: EventCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus || 'going');
  const [isRsvped, setIsRsvped] = useState(!!currentStatus);

  const handleRsvp = async (rsvpStatus: 'going' | 'maybe' | 'not_going') => {
    if (!userId) {
      console.log('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const result = await submitRSVP({
        eventId: event.id,
        userId,
        status: rsvpStatus,
        guestCount: 1,
      });

      if (result.success) {
        setStatus(rsvpStatus);
        setIsRsvped(true);
        onRsvpSuccess?.();
      }
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const eventDate = new Date(event.startDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-col border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
      {/* Event Image */}
      {event.imageUrl && (
        <div className="w-full h-48 bg-primary overflow-hidden">
          <img
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Event Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Category Badge */}
        {event.category && (
          <div className="inline-block w-fit mb-3">
            <span className="text-xs font-semibold text-primary bg-accent/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {event.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-serif font-bold text-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-center gap-3 text-sm text-foreground">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <div className="font-medium">{formattedDate}</div>
              <div className="text-muted-foreground text-xs">{formattedTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-medium">{event.location}</span>
          </div>

          {event.capacity && (
            <div className="flex items-center gap-3 text-sm text-foreground">
              <Users className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">{event.rsvpCount || 0} attending</span>
            </div>
          )}
        </div>

        {/* RSVP Status Display */}
        {isRsvped && (
          <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm font-medium text-primary capitalize">
              You are {status === 'maybe' ? 'maybe' : status}
            </p>
          </div>
        )}

        {/* RSVP Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => handleRsvp('going')}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              status === 'going' && isRsvped
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            } disabled:opacity-50`}
          >
            Going
          </button>
          <button
            onClick={() => handleRsvp('maybe')}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              status === 'maybe' && isRsvped
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            } disabled:opacity-50`}
          >
            Maybe
          </button>
          <button
            onClick={() => handleRsvp('not_going')}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              status === 'not_going' && isRsvped
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            } disabled:opacity-50`}
          >
            Can't Go
          </button>
        </div>
      </div>
    </div>
  );
}
