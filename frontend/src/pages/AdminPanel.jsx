/**
 * AdminPanel Page Component
 * =========================
 * Premium admin dashboard for event moderation
 * Features:
 * - Stats overview with animated counters
 * - Pending events cards with approve/reject
 * - Modal for event preview
 * - Empty state illustration
 * - Loading skeletons
 */

import { useState, useEffect } from 'react';
import * as api from '../data/api';
import toast from 'react-hot-toast';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Eye,
  X,
  AlertTriangle,
  Inbox
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { CardSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ icon: Icon, value, label, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    warning: 'bg-amber-100 text-amber-600',
    success: 'bg-emerald-100 text-emerald-600',
    danger: 'bg-red-100 text-red-600',
  };

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EVENT PREVIEW MODAL
// ============================================
const EventPreviewModal = ({ event, onClose, onApprove, onReject, isProcessing }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Event Preview</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Image */}
          <div className="h-48 rounded-xl overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://placehold.co/600x300/059669/white?text=${encodeURIComponent(event.title)}`;
                e.target.onerror = null;
              }}
            />
          </div>

          {/* Title & Organizer */}
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h4>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>Organized by {event.organizerName}</span>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {event.type === 'virtual' ? 'Virtual' : event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex gap-3">
          <Button
            variant="danger"
            fullWidth
            onClick={() => onReject(event.id)}
            loading={isProcessing}
            leftIcon={<XCircle className="w-5 h-5" />}
          >
            Reject
          </Button>
          <Button
            variant="success"
            fullWidth
            onClick={() => onApprove(event.id)}
            loading={isProcessing}
            leftIcon={<CheckCircle className="w-5 h-5" />}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PENDING EVENT CARD
// ============================================
const PendingEventCard = ({ event, onApprove, onReject, onPreview, isProcessing }) => (
  <div className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
    <div className="flex flex-col md:flex-row gap-6">
      {/* Image */}
      <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/200x200/059669/white?text=${encodeURIComponent(event.title.charAt(0))}`;
            e.target.onerror = null;
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
          <Badge variant="warning" showDot>Pending</Badge>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          by <span className="font-medium text-gray-700">{event.organizerName}</span>
        </p>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.type === 'virtual' ? 'Virtual' : event.location}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex md:flex-col gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPreview(event)}
          leftIcon={<Eye className="w-4 h-4" />}
        >
          Preview
        </Button>
        <Button
          variant="success"
          size="sm"
          onClick={() => onApprove(event.id)}
          disabled={isProcessing}
          leftIcon={<CheckCircle className="w-4 h-4" />}
        >
          Approve
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onReject(event.id)}
          disabled={isProcessing}
          leftIcon={<XCircle className="w-4 h-4" />}
        >
          Reject
        </Button>
      </div>
    </div>
  </div>
);

// ============================================
// APPROVED EVENT CARD
// ============================================
const ApprovedEventCard = ({ event, onRestrict, onDelete, isProcessing }) => {
  const isRestricted = event.status === 'restricted';

  return (
    <div className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://placehold.co/200x200/059669/white?text=${encodeURIComponent(event.title.charAt(0))}`;
              e.target.onerror = null;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
            {isRestricted ? (
              <Badge variant="danger" showDot>Restricted</Badge>
            ) : (
              <Badge variant="success" showDot>Approved</Badge>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-3">
            by <span className="font-medium text-gray-700">{event.organizerName}</span>
          </p>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(event.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.type === 'virtual' ? 'Virtual' : event.location}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {event.volunteerCount || 0} volunteers
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex md:flex-col gap-2 flex-shrink-0">
          <Button
            variant={isRestricted ? "success" : "danger"}
            size="sm"
            onClick={() => onRestrict(event.id, !isRestricted)}
            disabled={isProcessing}
            leftIcon={isRestricted ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          >
            {isRestricted ? 'Unrestrict' : 'Restrict'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(event.id)}
            disabled={isProcessing}
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN ADMIN PANEL COMPONENT
// ============================================
export default function AdminPanel() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const [pending, all] = await Promise.all([
        api.apiGetPendingEvents(),
        api.apiGetAllApprovedEvents()
      ]);
      setPendingEvents(pending);
      setApprovedEvents(all);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApproval = async (eventId, isApproved) => {
    setIsProcessing(true);
    try {
      await api.apiHandleApproval(eventId, isApproved);
      toast.success(`Event ${isApproved ? 'approved' : 'rejected'} successfully!`);

      // Refresh data
      await fetchEvents();
      setPreviewEvent(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestrict = async (eventId, isRestricted) => {
    setIsProcessing(true);
    try {
      await api.apiRestrictEvent(eventId, isRestricted);
      toast.success(`Event ${isRestricted ? 'restricted' : 'unrestricted'} successfully!`);

      // Refresh data
      await fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to restrict event');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    setIsProcessing(true);
    try {
      await api.apiDeleteEvent(eventId);
      toast.success('Event deleted successfully!');

      // Refresh data
      await fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 animate-fade-in-down">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage events and users</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        <StatCard
          icon={Clock}
          value={pendingEvents.length}
          label="Pending Events"
          color="warning"
        />
        <StatCard
          icon={CheckCircle}
          value={approvedEvents.length}
          label="Approved Events"
          color="success"
        />
        <StatCard
          icon={XCircle}
          value={approvedEvents.filter(e => e.status === 'restricted').length}
          label="Restricted"
          color="danger"
        />
        <StatCard
          icon={Calendar}
          value={pendingEvents.length + approvedEvents.length}
          label="Total Events"
          color="primary"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`
            px-6 py-3 font-semibold transition-all duration-200
            border-b-2 
            ${activeTab === 'pending'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }
          `}
        >
          Pending ({pendingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`
            px-6 py-3 font-semibold transition-all duration-200
            border-b-2
            ${activeTab === 'approved'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }
          `}
        >
          Approved ({approvedEvents.length})
        </button>
      </div>

      {/* Pending Events Section */}
      {activeTab === 'pending' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Events</h2>
            {pendingEvents.length > 0 && (
              <Badge variant="warning" glow>
                {pendingEvents.length} awaiting review
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shimmer h-40 rounded-xl" />
              ))}
            </div>
          ) : pendingEvents.length > 0 ? (
            <div className="space-y-4">
              {pendingEvents.map((event, index) => (
                <PendingEventCard
                  key={event.id}
                  event={event}
                  onApprove={(id) => handleApproval(id, true)}
                  onReject={(id) => handleApproval(id, false)}
                  onPreview={setPreviewEvent}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="inbox"
              title="All caught up!"
              description="There are no pending events to review at the moment."
            />
          )}
        </section>
      )}

      {/* Approved Events Section */}
      {activeTab === 'approved' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Approved Events</h2>
            {approvedEvents.length > 0 && (
              <Badge variant="success">{approvedEvents.length} events</Badge>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shimmer h-40 rounded-xl" />
              ))}
            </div>
          ) : approvedEvents.length > 0 ? (
            <div className="space-y-4">
              {approvedEvents.map((event) => (
                <ApprovedEventCard
                  key={event.id}
                  event={event}
                  onRestrict={(id, isRestricted) => handleRestrict(id, isRestricted)}
                  onDelete={handleDelete}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="inbox"
              title="No approved events"
              description="Events will appear here once you approve them."
            />
          )}
        </section>
      )}

      {/* Preview Modal */}
      {previewEvent && (
        <EventPreviewModal
          event={previewEvent}
          onClose={() => setPreviewEvent(null)}
          onApprove={(id) => handleApproval(id, true)}
          onReject={(id) => handleApproval(id, false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}