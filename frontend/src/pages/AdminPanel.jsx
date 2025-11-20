import { useState, useEffect } from 'react';
import * as api from '../data/api';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [pendingEvents, setPendingEvents] = useState([]);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      const events = await api.apiGetPendingEvents();
      setPendingEvents(events);
    };
    fetchPendingEvents();
  }, []);

  const handleApproval = async (eventId, isApproved) => {
    try {
      await api.apiHandleApproval(eventId, isApproved);
      toast.success(`Event ${isApproved ? 'approved' : 'rejected'}.`);
      setPendingEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      toast.error(error.message || 'Failed to update event');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <h2 className="text-2xl font-semibold mb-4">Pending Events for Approval</h2>

      {pendingEvents.length > 0 ? (
        <div className="space-y-4">
          {pendingEvents.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600">by {event.organizerName}</p>
                <p className="text-sm text-gray-500 mt-1">{event.description.substring(0, 100)}...</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
                  onClick={() => handleApproval(event.id, true)}>
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => handleApproval(event.id, false)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md">No pending events to approve.</p>
      )}
    </div>
  );
}