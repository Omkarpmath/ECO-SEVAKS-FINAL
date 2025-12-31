/**
 * Dashboard Page Component
 * ========================
 * Premium user dashboard with animated stats
 * Features:
 * - Animated welcome banner with gradient
 * - Stats cards with counter animations
 * - Tabbed sections for joined/created events
 * - Loading skeletons
 * - Empty states with illustrations
 * - Quick action buttons
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../data/api';
import EventCard from '../components/EventCard';
import { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge, { StatusBadge } from '../components/Badge';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Calendar,
  Heart,
  PlusCircle,
  Users,
  Leaf,
  TrendingUp,
  Clock,
  Eye,
  ChevronRight,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useScrollAnimation, useCountAnimation } from '../hooks/useScrollAnimation';

// ============================================
// ANIMATED STAT CARD
// ============================================
const StatCard = ({ icon: Icon, value, label, color = 'primary', suffix = '' }) => {
  const { ref, count } = useCountAnimation({ end: value, duration: 1500 });

  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div ref={ref} className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {count}{suffix}
          </p>
          <p className="text-gray-500 mt-1">{label}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// CREATED EVENT CARD (Compact)
// ============================================
const CreatedEventCard = ({ event, onClick, onDelete }) => {
  const isRestricted = event.status === 'restricted';

  return (
    <div
      className="
        glass rounded-xl p-5
        hover:shadow-lg
        transition-all duration-300
      "
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{event.title}</h3>
        <StatusBadge status={event.status} />
      </div>

      {/* Admin Reason Alert for Restricted Events */}
      {isRestricted && event.adminReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Restriction Reason</p>
              <p className="text-sm text-red-600 mt-1">{event.adminReason}</p>
              {event.adminActionDate && (
                <p className="text-xs text-red-400 mt-1">
                  {new Date(event.adminActionDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(event.date).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {event.attendees?.length || 0} attendees
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClick}
          className="
            flex-1 flex items-center justify-center gap-2
            py-2.5 px-4
            bg-gray-100 hover:bg-gray-200
            text-gray-700 font-medium
            rounded-lg
            transition-colors duration-300
          "
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
              onDelete(event.id);
            }
          }}
          className="
            flex items-center justify-center gap-2
            py-2.5 px-4
            bg-red-100 hover:bg-red-200
            text-red-600 font-medium
            rounded-lg
            transition-colors duration-300
          "
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
export default function Dashboard() {
  const { currentUser } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joined');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!currentUser || !currentUser.id) {
        console.log('Dashboard: No current user or user ID');
        return;
      }

      console.log('Dashboard: Fetching events for user', currentUser.id);
      setIsLoading(true);

      try {
        const joined = await api.apiGetEventsForUser(currentUser.id);
        console.log('Dashboard: Joined events fetched:', joined);
        setJoinedEvents(joined || []);

        // All users can create events now (no role restriction)
        const created = await api.apiGetCreatedEvents(currentUser.id);
        console.log('Dashboard: Created events fetched:', created);
        setCreatedEvents(created || []);
      } catch (error) {
        console.error('Dashboard: Error fetching events:', error);
        toast.error('Failed to load events');
        setJoinedEvents([]);
        setCreatedEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEvents();
  }, [currentUser?.id]); // Changed dependency to currentUser?.id for better tracking

  const handleCancelRsvp = async (eventId) => {
    try {
      await api.apiCancelRsvp(eventId, currentUser.id);
      toast.success('Cancelled RSVP successfully.');
      setJoinedEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      toast.error('Failed to cancel RSVP');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await api.apiDeleteEvent(eventId);
      toast.success('Event deleted successfully.');
      setCreatedEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  if (!currentUser) {
    return null;
  }

  // Filter events by status and date for proper categorization
  const now = new Date();
  const upcomingEvents = (joinedEvents || []).filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= now && e.status === 'approved';
  });
  const pastEvents = (joinedEvents || []).filter(e => {
    const eventDate = new Date(e.date);
    return eventDate < now || e.status === 'restricted';
  });

  return (
    <div className="space-y-8">
      {/* ============================================
          WELCOME BANNER
          ============================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-8 md:p-10 animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {currentUser.role === 'admin' ? 'Admin' : 'Member'}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-primary-100 text-lg">
            Here's an overview of your eco-volunteering journey.
          </p>
        </div>
      </div>

      {/* ============================================
          STATS GRID
          ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
        <StatCard
          icon={Heart}
          value={isLoading ? '...' : (joinedEvents?.length || 0)}
          label="Events Joined"
          color="primary"
        />
        <StatCard
          icon={Calendar}
          value={isLoading ? '...' : (upcomingEvents?.length || 0)}
          label="Upcoming"
          color="accent"
        />
        <StatCard
          icon={Clock}
          value={isLoading ? '...' : (pastEvents?.length || 0)}
          label="Completed"
          color="emerald"
        />
        <StatCard
          icon={Users}
          value={isLoading ? '...' : (createdEvents?.length || 0)}
          label="Events Created"
          color="secondary"
        />
      </div>

      {/* ============================================
          QUICK ACTIONS
          ============================================ */}
      <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <Link to="/events">
          <Button variant="secondary" leftIcon={<Calendar className="w-5 h-5" />}>
            Browse Events
          </Button>
        </Link>
        <Link to="/create-event">
          <Button variant="primary" leftIcon={<PlusCircle className="w-5 h-5" />}>
            Create Event
          </Button>
        </Link>
      </div>

      {/* ============================================
          JOINED EVENTS SECTION
          ============================================ */}
      <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Joined Events</h2>
          {(joinedEvents?.length || 0) > 0 && (
            <Badge variant="primary">{joinedEvents.length} events</Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (joinedEvents?.length || 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(joinedEvents || []).map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onCancelRsvp={handleCancelRsvp}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="joined"
            actionText="Find Events"
            onAction={() => navigate('/events')}
          />
        )}
      </section>

      {/* ============================================
          CREATED EVENTS SECTION
          ============================================ */}
      <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Created Events</h2>
          {(createdEvents?.length || 0) > 0 && (
            <Badge variant="secondary">{createdEvents.length} events</Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (createdEvents?.length || 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(createdEvents || []).map(event => (
              <CreatedEventCard
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="created"
            actionText="Create Event"
            onAction={() => navigate('/create-event')}
          />
        )}
      </section>
    </div>
  );
}