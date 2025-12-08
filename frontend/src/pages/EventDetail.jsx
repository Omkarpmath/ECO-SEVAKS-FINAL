/**
 * EventDetail Page Component
 * ==========================
 * Premium event detail page with immersive design
 * Features:
 * - Immersive hero image with gradient overlay
 * - Animated join/leave button with ripple effect
 * - Participant progress visualization
 * - Event details with icon animations
 * - Skeleton loading state
 * - Responsive layout
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../data/api';
import toast from 'react-hot-toast';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle,
  AlertCircle,
  Tag,
  Clipboard,
  Globe,
  User
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const fetchedEvent = await api.apiGetEventById(eventId);
        setEvent(fetchedEvent);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleJoinEvent = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to join.');
      navigate('/login');
      return;
    }

    setIsJoining(true);
    try {
      await api.apiJoinEvent(event.id, currentUser.id);
      toast.success(`Successfully joined "${event.title}"!`);
      setEvent(prevEvent => ({
        ...prevEvent,
        attendees: [...prevEvent.attendees, currentUser.id],
        volunteerCount: (prevEvent.volunteerCount || 0) + 1,
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to join event');
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="shimmer h-80 rounded-2xl" />
          <div className="shimmer h-10 w-2/3 rounded-lg" />
          <div className="shimmer h-6 w-1/3 rounded-lg" />
          <div className="flex gap-4">
            <div className="shimmer h-8 w-32 rounded-lg" />
            <div className="shimmer h-8 w-32 rounded-lg" />
          </div>
          <div className="shimmer h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    );
  }

  const isJoined = currentUser?.joinedEvents?.includes(event.id);
  const isPast = new Date(event.date) < new Date();
  const volunteerCount = event.volunteerCount || event.attendees?.length || 0;
  const isFull = event.maxVolunteers > 0 && volunteerCount >= event.maxVolunteers;
  const volunteerPercentage = event.maxVolunteers > 0
    ? (volunteerCount / event.maxVolunteers) * 100
    : 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="
          flex items-center gap-2 mb-6
          text-gray-600 hover:text-primary-600
          transition-colors duration-300
        "
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to events</span>
      </button>

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 animate-fade-in">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/800x400/059669/white?text=${encodeURIComponent(event.title)}`;
            e.target.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/30 to-transparent" />

        {/* Badges on image */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            variant={event.type === 'virtual' ? 'accent' : 'primary'}
            glow
            className="backdrop-blur-sm"
          >
            {event.type === 'virtual' ? '🌐 Virtual' : '📍 In-person'}
          </Badge>
          {isPast && (
            <Badge variant="gray" className="backdrop-blur-sm">
              Event Completed
            </Badge>
          )}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="
            absolute top-4 right-4
            p-3 bg-white/20 backdrop-blur-md
            rounded-full text-white
            hover:bg-white/30 transition-colors
          "
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.title}
          </h1>
          <p className="text-white/80">
            Organized by <span className="font-semibold text-white">{event.organizerName}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
          {/* Event Details Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date Card */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 rounded-xl flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900 truncate">{formatDate(event.date)}</p>
                </div>
              </div>
            </div>

            {/* Time Card */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-100 rounded-xl flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900 truncate">{formatTime(event.date)}</p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary-100 rounded-xl flex-shrink-0">
                  {event.type === 'virtual' ? (
                    <Globe className="w-6 h-6 text-secondary-600" />
                  ) : (
                    <MapPin className="w-6 h-6 text-secondary-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900 truncate">
                    {event.type === 'virtual' ? 'Online Event' : event.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Volunteers Card */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-xl flex-shrink-0">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">Volunteers</p>
                  <p className="font-semibold text-gray-900">
                    {event.maxVolunteers > 0
                      ? `${volunteerCount} / ${event.maxVolunteers}`
                      : `${volunteerCount} registered`
                    }
                  </p>
                </div>
              </div>
              {/* Progress bar - full width below */}
              {event.maxVolunteers > 0 && (
                <div className="h-1.5 bg-gray-200 rounded-full mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${volunteerPercentage >= 100 ? 'bg-red-500'
                      : volunteerPercentage >= 80 ? 'bg-amber-500'
                        : 'bg-emerald-500'
                      }`}
                    style={{ width: `${Math.min(volunteerPercentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* What to Bring */}
            {event.whatToBring && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-primary-600" />
                  What to Bring
                </h3>
                <ul className="space-y-2">
                  {event.whatToBring.split('. ').filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <Badge key={tag} variant="primary" size="md">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Action Card */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {isPast ? 'Event Completed' : 'Join This Event'}
            </h3>

            {/* Status indicators */}
            {isFull && !isPast && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
                <AlertCircle className="w-5 h-5" />
                This event is currently full
              </div>
            )}

            {isJoined && !isPast && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm mb-4">
                <CheckCircle className="w-5 h-5" />
                You're registered for this event!
              </div>
            )}

            {/* CTA Button */}
            {!currentUser ? (
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Sign in to join this event and connect with other volunteers.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Sign In to Join
                </Button>
              </div>
            ) : isPast ? (
              <Button variant="secondary" size="lg" fullWidth disabled>
                Event Completed
              </Button>
            ) : isJoined ? (
              <Button variant="success" size="lg" fullWidth disabled leftIcon={<CheckCircle className="w-5 h-5" />}>
                Already Joined
              </Button>
            ) : isFull ? (
              <Button variant="secondary" size="lg" fullWidth disabled>
                Event Full
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isJoining}
                onClick={handleJoinEvent}
                leftIcon={<Heart className="w-5 h-5" />}
              >
                Join Event
              </Button>
            )}

            {/* Organizer Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Organized by</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{event.organizerName}</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}