/**
 * CreateEvent Page Component
 * ==========================
 * Premium event creation form with step indicator
 * Features:
 * - Glassmorphism form card
 * - Floating label inputs
 * - Tag input with chips
 * - Image preview placeholder
 * - Form validation with error states
 * - Loading state on submit
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../data/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  FileText,
  Image,
  Globe,
  Leaf,
  Send,
  X,
  Plus,
  Info
} from 'lucide-react';
import Input, { Textarea, Select } from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function CreateEvent() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    type: 'virtual',
    location: '',
    tags: '',
    maxVolunteers: 0,
    whatToBring: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags(prev => [...prev, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.date) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.apiCreateEvent({
        ...formData,
        tags: tags.join(','),
        organizer: currentUser.id,
      });
      toast.success('Event submitted for approval!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Event creation error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    { value: 'virtual', label: '🌐 Virtual Event' },
    { value: 'in-person', label: '📍 In-person Event' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8 animate-fade-in-down">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
          <Leaf className="w-4 h-4" />
          Create Event
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Create a New Event
        </h1>
        <p className="text-gray-600 text-lg">
          Fill in the details below to submit your event for approval
        </p>
      </div>

      {/* Form Card */}
      <div className="glass rounded-2xl p-8 shadow-xl animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <Input
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            leftIcon={<FileText className="w-5 h-5" />}
            required
            helperText="E.g., Juhu Beach Cleanup Drive"
          />

          {/* Description */}
          <Textarea
            label="Event Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
            helperText="Describe what volunteers will be doing and why it matters"
          />

          {/* Date & Time + Event Type Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Date & Time - matching Select component structure */}
            <div className="relative">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="
                    w-full pl-12 pr-4 py-4 pt-6 pb-2
                    bg-white/80 backdrop-blur
                    border-2 border-gray-200 rounded-xl
                    text-gray-900
                    focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                    transition-all duration-300
                    outline-none
                  "
                />
                <label className="absolute left-12 top-2 text-xs font-medium text-gray-500 pointer-events-none">
                  Date & Time <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* Event Type */}
            <Select
              label="Event Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={eventTypes}
            />
          </div>

          {/* Location (shown for in-person events) */}
          {formData.type === 'in-person' && (
            <div className="animate-fade-in">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                leftIcon={<MapPin className="w-5 h-5" />}
                helperText="E.g., Juhu Beach, Mumbai"
              />
            </div>
          )}

          {/* Max Volunteers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Volunteers
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="maxVolunteers"
                min="0"
                value={formData.maxVolunteers}
                onChange={handleChange}
                placeholder="0 = Unlimited"
                className="
                  w-full pl-12 pr-4 py-4
                  bg-white/80 backdrop-blur
                  border-2 border-gray-200 rounded-xl
                  text-gray-900
                  focus:border-primary-500 focus:ring-4 focus:ring-primary-100
                  transition-all duration-300
                "
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Leave as 0 for unlimited volunteers
            </p>
          </div>

          {/* What to Bring */}
          <Textarea
            label="What to Bring (Optional)"
            name="whatToBring"
            value={formData.whatToBring}
            onChange={handleChange}
            rows={3}
            helperText="List items volunteers should bring, separated by periods"
          />

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (up to 5)
            </label>
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a tag and press Enter"
                  className="
                    w-full pl-12 pr-4 py-3
                    bg-white
                    border-2 border-gray-200 rounded-xl
                    text-gray-900
                    placeholder-gray-400
                    focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  disabled={tags.length >= 5}
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className="
                  px-5 py-3
                  bg-primary-500 hover:bg-primary-600
                  text-white font-medium
                  rounded-xl
                  flex items-center gap-2
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500
                "
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="primary"
                    onDismiss={() => handleRemoveTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-accent-50 border border-accent-200 rounded-xl">
            <Info className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-accent-800 font-medium">Review Process</p>
              <p className="text-sm text-accent-700">
                Your event will be reviewed by our admin team before being published. This usually takes 24-48 hours.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            leftIcon={<Send className="w-5 h-5" />}
          >
            Submit for Approval
          </Button>
        </form>
      </div>
    </div>
  );
}