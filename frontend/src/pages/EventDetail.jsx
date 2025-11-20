import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../data/api';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users } from 'lucide-react';

export default function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      const fetchedEvent = await api.apiGetEventById(eventId);
      setEvent(fetchedEvent);
    };
    fetchEvent();
  }, [eventId]);

  const handleJoinEvent = async () => {
    if (!currentUser) {
      toast.error('You must be logged in to join.');
      navigate('/login');
      return;
    }
    try {
      await api.apiJoinEvent(event.id, currentUser.id);
      toast.success(`Successfully joined "${event.title}"!`);
      // Update local state to reflect the change
      setEvent(prevEvent => ({
        ...prevEvent,
        attendees: [...prevEvent.attendees, currentUser.id],
        volunteerCount: (prevEvent.volunteerCount || 0) + 1,
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to join event');
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const isJoined = currentUser?.joinedEvents.includes(event.id);
  const isPast = new Date(event.date) < new Date();
  const isFull = event.maxVolunteers > 0 && (event.volunteerCount || event.attendees.length) >= event.maxVolunteers;

  const RsvpButton = () => {
    if (!currentUser) {
      return (
        <p className="text-gray-600">
          Please <Link to="/login" className="text-primary hover:underline">log in</Link> to RSVP.
        </p>
      );
    }
    if (isPast) {
      return (
        <button className="w-full md:w-auto bg-gray-400 text-white px-6 py-3 rounded-lg" disabled>
          Event has passed
        </button>
      );
    }
    if (isJoined) {
      return (
        <button className="w-full md:w-auto bg-secondary text-white px-6 py-3 rounded-lg" disabled>
          Already Joined
        </button>
      );
    }
    if (isFull) {
      return (
        <button className="w-full md:w-auto bg-red-500 text-white px-6 py-3 rounded-lg" disabled>
          Event Full
        </button>
      );
    }
    return (
      <button
        className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
        onClick={handleJoinEvent}>
        RSVP / Join Event
      </button>
    );
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-64 md:h-80 object-cover rounded-md mb-6"
        onError={(e) => { e.target.src = `https://placehold.co/800x300/a0eec0/1f4d1f?text=${event.title.replace(/ /g, '+')}`; e.target.onerror = null; }}
      />

      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-sm text-gray-500 mb-4">Organized by: {event.organizerName}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-700 mb-6">
        <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> {new Date(event.date).toLocaleString()}</span>
        <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {event.type === 'virtual' ? 'Virtual' : event.location}</span>
        {/* Volunteer Count with Badge */}
        <span className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {event.maxVolunteers > 0 ? (
            <>
              <span className="font-medium">{event.volunteerCount || 0} / {event.maxVolunteers} volunteers</span>
              {isFull ? (
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold ml-1">Full</span>
              ) : (event.volunteerCount || 0) >= event.maxVolunteers * 0.8 ? (
                <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold ml-1">Almost Full</span>
              ) : null}
            </>
          ) : (
            <span>{event.volunteerCount || event.attendees.length} volunteers registered</span>
          )}
        </span>
      </div>

      <div className="prose max-w-none text-gray-800 mb-6 text-lg">
        <h3 className="text-xl font-semibold mb-2">Event Details</h3>
        <p>{event.description}</p>

        {event.whatToBring && (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-2">What to Bring</h3>
            <ul className="list-disc pl-5">
              {event.whatToBring.split('. ').map((item, i) => item && <li key={i}>{item}</li>)}
            </ul>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {event.tags.map(tag => (
          <span key={tag} className="bg-primary-light text-primary-text px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
        ))}
      </div>

      <RsvpButton />

      {event.type === 'in-person' && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            [Map Placeholder for {event.location}]
          </div>
        </div>
      )}
    </div>
  );
}