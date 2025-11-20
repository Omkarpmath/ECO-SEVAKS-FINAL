import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

export default function EventCard({ event, onCancelRsvp }) {
  const navigate = useNavigate();
  const isPast = new Date(event.date) < new Date();

  const handleViewDetails = () => {
    navigate(`/event/${event.id}`);
  };

  const ButtonLogic = () => {
    if (onCancelRsvp) {
      return isPast ? (
        <button className="w-full mt-4 bg-gray-400 text-white px-4 py-2 rounded-lg" disabled>
          Event Past
        </button>
      ) : (
        <button
          className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={() => onCancelRsvp(event.id)}>
          Cancel RSVP
        </button>
      );
    }
    return (
      <button
        className="w-full mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        onClick={handleViewDetails}>
        View Details
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.03] flex flex-col">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.src = `https://placehold.co/400x200/a0eec0/1f4d1f?text=${event.title.replace(/ /g, '+')}`; e.target.onerror = null; }}
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-1 truncate">{event.title}</h3>
        <p className="text-sm text-gray-500 mb-2">Organized by: {event.organizerName}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{event.type === 'virtual' ? 'Virtual' : event.location}</span>
          </div>
          {/* Volunteer Count Display */}
          <div className="flex items-center gap-2">
            {event.maxVolunteers > 0 ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  {event.volunteerCount || 0} / {event.maxVolunteers} volunteers
                </span>
                {event.volunteerCount >= event.maxVolunteers ? (
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">Full</span>
                ) : event.volunteerCount >= event.maxVolunteers * 0.8 ? (
                  <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">Almost Full</span>
                ) : null}
              </>
            ) : (
              <span className="text-sm text-gray-600">{event.volunteerCount || 0} volunteers registered</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {event.tags.map((tag, index) => (
              <span key={index} className="bg-primary-light text-primary-text px-2 py-0.5 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ButtonLogic />
      </div>
    </div>
  );
}