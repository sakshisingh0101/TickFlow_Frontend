import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Building } from 'lucide-react';

export default function ShowCard({ show }) {
  const navigate = useNavigate();

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBookNow = () => {
    navigate(`/booking/${show.show_id}`, { state: { show } });
  };

  return (
    
    <div className="group relative block rounded-2xl overflow-hidden bg-card border border-gray-800 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.5)] hover:-translate-y-1 cursor-pointer" onClick={handleBookNow}>
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={show.poster_url}
          alt={show.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
      </div>

      <div className="absolute bottom-0 w-full p-4">
        <h3 className="font-bold text-lg text-white mb-1 truncate">{show.title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Building className="w-4 h-4" />
          <span className="truncate">{show.theatre_name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{show.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Clock className="w-4 h-4" />
          <span>{formatTime(show.start_time)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2 truncate">{show.genre} • {show.movie_language}</p>

        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-primary hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}