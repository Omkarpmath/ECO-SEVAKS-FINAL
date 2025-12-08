/**
 * EventCard Component
 * ===================
 * Premium event card with advanced animations
 * Features:
 * - Image hover zoom effect
 * - Gradient overlay on hover
 * - Shimmer loading state
 * - Animated badges with glow
 * - Stagger animation support via index prop
 * - Scale and lift hover effects
 */

import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Badge from './Badge';

export default function EventCard({ event, onCancelRsvp, index = 0 }) {
  const navigate = useNavigate();
  const isPast = new Date(event.date) < new Date();

  const handleViewDetails = () => {
    navigate(`/event/${event.id}`);
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate volunteer capacity percentage
  const volunteerPercentage = event.maxVolunteers > 0
    ? ((event.volunteerCount || 0) / event.maxVolunteers) * 100
    : 0;

  // Determine capacity status
  const getCapacityStatus = () => {
    if (event.maxVolunteers === 0) return null;
    if (volunteerPercentage >= 100) return { variant: 'danger', text: 'Full' };
    if (volunteerPercentage >= 80) return { variant: 'warning', text: 'Almost Full' };
    return null;
  };

  const capacityStatus = getCapacityStatus();

  // ============================================
  // BUTTON LOGIC
  // ============================================
  const ActionButton = () => {
    if (onCancelRsvp) {
      return isPast ? (
        <button
          className="
            w-full mt-4 py-3
            bg-gray-100 text-gray-400
            font-medium rounded-xl
            cursor-not-allowed
          "
          disabled
        >
          Event Completed
        </button>
      ) : (
        <button
          className="
            w-full mt-4 py-3
            bg-red-50 text-red-600
            font-semibold rounded-xl
            border-2 border-red-100
            hover:bg-red-100 hover:border-red-200
            transition-all duration-300 ease-out
          "
          onClick={(e) => {
            e.stopPropagation();
            onCancelRsvp(event.id);
          }}
        >
          Cancel RSVP
        </button>
      );
    }

    return (
      <button
        className="
          w-full mt-4 py-3
          bg-primary-600 text-white
          font-semibold rounded-xl
          shadow-lg shadow-primary-500/25
          hover:bg-primary-700 hover:shadow-xl
          hover:-translate-y-0.5 active:translate-y-0
          transition-all duration-300 ease-out
        "
        onClick={handleViewDetails}
      >
        View Details
      </button>
    );
  };

  return (
    <div
      className="
        group
        bg-white rounded-2xl
        shadow-card hover:shadow-card-hover
        overflow-hidden
        transition-all duration-500 ease-out
        hover:-translate-y-2
        flex flex-col
        cursor-pointer
        animate-fade-in-up opacity-0
      "
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards',
      }}
      onClick={handleViewDetails}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {/* Event Image with hover zoom */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="
            w-full h-full object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400/059669/white?text=${encodeURIComponent(event.title)}`;
            e.target.onerror = null;
          }}
        />

        {/* Hover Gradient Overlay */}
        <div
          className="
            absolute inset-0 
            bg-gradient-to-t from-black/60 via-black/0 to-black/0
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          "
        />

        {/* Event Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={event.type === 'virtual' ? 'accent' : 'primary'}
            glow
            className="backdrop-blur-sm"
          >
            {event.type === 'virtual' ? '🌐 Virtual' : '📍 In-person'}
          </Badge>
        </div>

        {/* Capacity Status Badge */}
        {capacityStatus && (
          <div className="absolute top-3 right-3">
            <Badge variant={capacityStatus.variant} glow>
              {capacityStatus.text}
            </Badge>
          </div>
        )}

        {/* Past Event Overlay */}
        {isPast && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-gray-900/80 px-4 py-2 rounded-full">
              Event Completed
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        {/* Organizer */}
        <p className="text-sm text-gray-500 mb-3">
          by <span className="font-medium text-gray-700">{event.organizerName}</span>
        </p>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 text-sm">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{formatDate(event.date)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="truncate">
              {event.type === 'virtual' ? 'Online Event' : event.location}
            </span>
          </div>

          {/* Volunteer Count with Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 text-primary-500" />
                <span>
                  {event.maxVolunteers > 0
                    ? `${event.volunteerCount || 0} / ${event.maxVolunteers} volunteers`
                    : `${event.volunteerCount || 0} volunteers`
                  }
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {event.maxVolunteers > 0 && (
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`
                    h-full rounded-full transition-all duration-500
                    ${volunteerPercentage >= 100
                      ? 'bg-red-500'
                      : volunteerPercentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-primary-500'
                    }
                  `}
                  style={{ width: `${Math.min(volunteerPercentage, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.slice(0, 3).map((tag, idx) => (
              <Badge
                key={idx}
                variant="gray"
                size="sm"
                className="bg-gray-100 text-gray-600"
              >
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="gray" size="sm" className="bg-gray-100 text-gray-600">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <ActionButton />
      </div>
    </div>
  );
}