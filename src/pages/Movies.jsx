import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import ShowCard from '../components/ShowCard';

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/public/getAllMovies');
      setMovies(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch default movies', err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (query) => {
    try {
      setLoading(true);
      const res = await api.get('/public/search', { params: { query } });
      setSearchResults(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch shows', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSearch) {
      fetchSearchResults(initialSearch);
    } else {
      fetchMovies();
    }
  }, [initialSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { search: searchTerm } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
          <p className="text-muted">Explore all our available movies and shows</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search movie, theatre or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition"
            />
          </div>
          <button type="button" className="bg-card border border-gray-800 p-3 rounded-lg text-white hover:bg-gray-800 transition flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-white">Searching...</h2>
        </div>
      ) : initialSearch ? (
        searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((show) => (
              <ShowCard key={show.show_id} show={show} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-white mb-2">No shows found</h2>
            <p className="text-muted">Try a different movie, theatre, or city</p>
          </div>
        )
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-white mb-2">No movies found</h2>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
