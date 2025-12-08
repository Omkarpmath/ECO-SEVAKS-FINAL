/**
 * EventsList Page Component
 * =========================
 * Premium events listing with advanced features
 * Features:
 * - Glassmorphism search/filter bar
 * - Skeleton loading states for events
 * - Staggered card entrance animations
 * - Empty state with illustration
 * - Advanced filter options
 * - Animated filter dropdown
 */

import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, MapPin, Leaf } from 'lucide-react';
import EventCard from '../components/EventCard';
import LoadingSpinner, { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import * as api from '../data/api';

export default function EventsList() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const events = await api.apiGetAllApprovedEvents();
        setAllEvents(events);
        setFilteredEvents(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events when search term or type changes
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = allEvents.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.tags?.some(tag => tag.toLowerCase().includes(term));

      const matchesType = eventType === 'all' || event.type === eventType;

      return matchesSearch && matchesType;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, eventType, allEvents]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setEventType('all');
  };

  const hasActiveFilters = searchTerm || eventType !== 'all';

  // ============================================
  // SKELETON LOADING GRID
  // ============================================
  const LoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ============================================
          PAGE HEADER
          ============================================ */}
      <div className="text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
          <Calendar className="w-4 h-4" />
          Discover Events
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Find an Opportunity
        </h1>
        <p className="text-gray-600 text-lg">
          Browse and join environmental volunteer events across India
        </p>
      </div>

      {/* ============================================
          SEARCH AND FILTER BAR
          ============================================ */}
      <div className="glass rounded-2xl p-4 md:p-6 space-y-4">
        {/* Main search row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword (e.g., planting, Mumbai, cleanup)"
              className="
                w-full pl-12 pr-4 py-4
                bg-white/80 backdrop-blur
                border-2 border-gray-200
                rounded-xl
                text-gray-900 placeholder:text-gray-400
                focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                transition-all duration-300
              "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Event Type Select */}
          <div className="relative min-w-[180px]">
            <select
              className="
                w-full px-4 py-4 pr-10
                bg-white/80 backdrop-blur
                border-2 border-gray-200
                rounded-xl
                text-gray-900
                focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                transition-all duration-300
                appearance-none cursor-pointer
              "
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="virtual">🌐 Virtual</option>
              <option value="in-person">📍 In-person</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              md:hidden
              flex items-center justify-center gap-2
              px-6 py-4
              ${showFilters ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}
              font-medium rounded-xl
              transition-all duration-300
            `}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>

            {searchTerm && (
              <Badge
                variant="primary"
                onDismiss={() => setSearchTerm('')}
              >
                Search: "{searchTerm}"
              </Badge>
            )}

            {eventType !== 'all' && (
              <Badge
                variant="accent"
                onDismiss={() => setEventType('all')}
              >
                Type: {eventType}
              </Badge>
            )}

            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ============================================
          RESULTS COUNT
          ============================================ */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events
          </p>
        </div>
      )}

      {/* ============================================
          EVENTS GRID / LOADING / EMPTY STATE
          ============================================ */}
      {isLoading ? (
        <LoadingGrid />
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          type="search"
          title="No events found"
          description={
            hasActiveFilters
              ? "Try adjusting your search terms or filters to find what you're looking for."
              : "There are no events available at the moment. Check back soon!"
          }
          actionText={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      )}
    </div>
  );
}