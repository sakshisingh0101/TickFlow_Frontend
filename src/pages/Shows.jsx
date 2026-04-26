import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import ShowCard from '../components/ShowCard';

export default function Shows() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/public/getShowsByMovie/${movieId}`);
        setShows(response.data.data || response.data || []);
        // Assuming the API returns shows with movie info
        if (response.data.data && response.data.data.length > 0) {
          setMovie({
            id: response.data.data[0].movie_id,
            title: response.data.data[0].title,
            poster_url: response.data.data[0].poster_url
          });
        }
      } catch (err) {
        console.error('Failed to fetch shows:', err);
        setShows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [movieId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-muted hover:text-white flex items-center gap-2 transition">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        {movie && (
          <div className="flex items-center gap-4">
            <img src={movie.poster_url} alt={movie.title} className="w-12 h-16 object-cover rounded" />
            <div>
              <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
              <p className="text-muted">Available Shows</p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-white">Loading shows...</h2>
        </div>
      ) : shows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shows.map((show) => (
            <ShowCard key={show.show_id} show={show} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-white mb-2">No shows available</h2>
          <p className="text-muted">There are currently no shows scheduled for this movie.</p>
        </div>
      )}
    </div>
  );
}