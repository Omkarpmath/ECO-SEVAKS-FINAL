import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../data/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'virtual',
    location: '',
    tags: '',
    maxVolunteers: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      api.apiCreateEvent({
        ...formData,
        organizer: currentUser.id,
      });
      toast.success('Event submitted for approval!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create event.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title (e.g., Juhu Beach Cleanup)" className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Event Description" className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required></textarea>
        <input name="date" value={formData.date} onChange={handleChange} type="datetime-local" className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
        <select name="type" value={formData.type} onChange={handleChange} className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="virtual">Virtual</option>
          <option value="in-person">In-person</option>
        </select>
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location (e.g., Juhu Beach, Mumbai)" className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated, e.g., cleanup, mumbai, beach)" className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Volunteers</label>
          <input
            name="maxVolunteers"
            type="number"
            min="0"
            value={formData.maxVolunteers}
            onChange={handleChange}
            placeholder="0 = Unlimited"
            className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-gray-500 mt-1">Leave as 0 or empty for unlimited volunteers</p>
        </div>
        <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
          Submit for Approval
        </button>
      </form>
    </div>
  );
}