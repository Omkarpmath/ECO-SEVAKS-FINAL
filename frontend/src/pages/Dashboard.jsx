import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../data/api';
import EventCard from '../components/EventCard';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (currentUser) {
        const joined = await api.apiGetEventsForUser(currentUser.id);
        setJoinedEvents(joined);
        if (currentUser.role === 'organizer' || currentUser.role === 'admin') {
          const created = await api.apiGetCreatedEvents(currentUser.id);
          setCreatedEvents(created);
        }
      }
    };
    fetchUserEvents();
  }, [currentUser]);

  const handleCancelRsvp = async (eventId) => {
    await api.apiCancelRsvp(eventId, currentUser.id);
    toast.success('Cancelled RSVP.');
    setJoinedEvents(prev => prev.filter(event => event.id !== eventId));
  };

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  const isOrganizer = currentUser.role === 'organizer' || currentUser.role === 'admin';

  return (
    <div>
      <div className="relative bg-white p-8 rounded-lg shadow-md mb-6 overflow-hidden">
        <img src="https://placehold.co/1200x200/a7f3d0/065f46?text=Welcome+Sevak!" alt="Dashboard banner" className="absolute top-0 left-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-primary-text">Welcome, {currentUser.name}!</h1>
          <p className="text-lg text-gray-600">Here are your upcoming events and contributions.</p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Joined Events</h2>
        {joinedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedEvents.map(event => (
              <EventCard key={event.id} event={event} onCancelRsvp={handleCancelRsvp} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md">
            You haven't joined any events yet. <Link to="/events" className="text-primary hover:underline">Find one to join!</Link>
          </p>
        )}
      </section>

      {isOrganizer && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Your Created Events</h2>
          {createdEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdEvents.map(event => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    Status: <span className={`${event.status === 'pending' ? 'text-yellow-600' : 'text-green-600'} font-medium capitalize`}>{event.status}</span>
                  </p>
                  <p className="text-sm text-gray-500">{event.attendees.length} attendees</p>
                  <button
                    className="w-full mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    onClick={() => navigate(`/event/${event.id}`)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md">
              You haven't created any events yet. <Link to="/create-event" className="text-primary hover:underline">Create one now!</Link>
            </p>
          )}
        </section>
      )}
    </div>
  );
}