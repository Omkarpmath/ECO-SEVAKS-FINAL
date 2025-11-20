import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import * as api from '../data/api';

export default function EventsList() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await api.apiGetAllApprovedEvents();
      setAllEvents(events);
      setFilteredEvents(events);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = allEvents.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.tags.some(tag => tag.toLowerCase().includes(term));

      const matchesType = eventType === 'all' || event.type === eventType;

      return matchesSearch && matchesType;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, eventType, allEvents]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Find an Opportunity</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search by keyword (e.g., planting, Mumbai, Chennai)"
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="virtual">Virtual</option>
          <option value="in-person">In-person</option>
        </select>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No events found matching your criteria.</p>
      )}
    </div>
  );
}