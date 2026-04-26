import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/shows/${movie.id}`} className="group relative block rounded-2xl overflow-hidden bg-card border border-gray-800 hover:border-primary transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,9,20,0.5)] hover:-translate-y-1">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.poster_url} 
          alt={movie.title} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
      </div>
      
      <div className="absolute bottom-0 w-full p-4">
        <h3 className="font-bold text-lg text-white mb-1 truncate">{movie.title}</h3>
        <div className="flex items-center gap-3 text-sm text-muted">
          <div className="flex items-center gap-1 text-gold">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold">{movie.rating}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{movie.duration}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 truncate">{movie.genre}</p>
        
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-primary hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
}
