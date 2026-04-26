import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Globe, Calendar, Play } from 'lucide-react';
import { movies, shows } from '../data/mockData';

export default function MovieDetails() {
  const { id } = useParams();
  const movie = movies.find(m => m.id === id) || movies[0];
  const availableShows = shows[id] || [];

  return (
    <div className="w-full">
      {/* Movie Hero Banner */}
      <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full h-full object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-16">
          <div className="flex flex-col md:flex-row gap-8 md:items-end w-full">
            <motion.img 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              src={movie.poster} 
              alt={movie.title} 
              className="w-48 md:w-64 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-gray-800"
            />
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-grow"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6">
                <div className="flex items-center gap-1 text-gold font-bold">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{movie.rating}</span>
                </div>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{movie.language}</span>
                </div>
                <span className="hidden md:inline">•</span>
                <span className="bg-card px-3 py-1 rounded-full border border-gray-700">{movie.genre}</span>
              </div>
              
              <p className="text-muted max-w-2xl mb-8 leading-relaxed">
                {movie.description}
              </p>
              
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition backdrop-blur-sm border border-white/20 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Trailer
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Available Shows
        </h2>
        
        {availableShows.length > 0 ? (
          <div className="space-y-6">
            {availableShows.map((show, index) => (
              <motion.div 
                key={show.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-700 transition"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{show.theatre}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {show.time}</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold uppercase">{show.format}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-800 md:border-none">
                  <div className="text-lg font-semibold text-white">₹{show.price}</div>
                  <Link 
                    to={`/booking/${show.id}`} 
                    className="flex-grow md:flex-grow-0 bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium text-center transition"
                  >
                    Book Tickets
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-gray-800 rounded-xl p-12 text-center">
            <h3 className="text-xl font-medium text-white mb-2">No shows available</h3>
            <p className="text-muted">There are currently no scheduled shows for this movie in your selected city.</p>
          </div>
        )}
      </div>
    </div>
  );
}
