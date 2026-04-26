import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import api from '../../../api/axios';

export default function MoviesTab() {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    movie_language: '',
    duration: '',
    release_date: '',
    movie_description: '',
    poster_url: null
  });

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/public/getAllMovies');
      setMovies(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      genre: '',
      movie_language: '',
      duration: '',
      release_date: '',
      movie_description: '',
      poster_url: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, poster_url: e.target.files[0] }));
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title || '',
      genre: movie.genre || '',
      movie_language: movie.movie_language || '',
      duration: movie.duration || '',
      release_date: movie.release_date ? new Date(movie.release_date).toISOString().split('T')[0] : '',
      movie_description: movie.movie_description || '',
      poster_url: null // Can't prefill file input
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await api.delete(`/admin/deleteMovie/${id}`);
      await fetchMovies();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete movie");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });
    
    try {
      if (editingMovie) {
        await api.put(`/admin/updateMovie/${editingMovie.id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setIsEditModalOpen(false);
        setEditingMovie(null);
      } else {
        await api.post('/admin/addMovie', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setIsModalOpen(false);
      }
      resetForm();
      await fetchMovies();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMovies = movies.filter((m) =>
    String(m.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Movies Catalog</h1>
          <p className="text-muted">Manage all movies available for booking</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:border-primary focus:outline-none transition"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Movie</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-card border border-gray-800 rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading movies...</h2>
          <p className="text-muted max-w-md">Fetching latest movies from the API.</p>
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id || movie.movie_id || movie._id} className="bg-card rounded-xl overflow-hidden border border-gray-800 group hover:border-gray-600 transition">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={movie.poster_url || movie.image} alt={movie.title || 'Movie poster'} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button 
                    onClick={() => handleEdit(movie)}
                    className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(movie.id || movie.movie_id || movie._id)}
                    className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white truncate mb-1">{movie.title || 'Untitled Movie'}</h3>
                <p className="text-xs text-muted truncate">{movie.genre || 'Unknown genre'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-gray-800 rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No movies found</h2>
          <p className="text-muted max-w-md">Try adding a movie or adjusting your search query.</p>
        </div>
      )}

      {/* Add Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Add New Movie</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Movie Title</label>
                    <input 
                      name="title" 
                      type="text" 
                      required 
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                    <input 
                      name="genre" 
                      type="text" 
                      required 
                      placeholder="e.g. Action, Sci-Fi" 
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                    <input 
                      name="movie_language" 
                      type="text" 
                      required 
                      value={formData.movie_language}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
                    <input 
                      name="duration" 
                      type="number" 
                      required 
                      min="1" 
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Release Date</label>
                    <input 
                      name="release_date" 
                      type="date" 
                      required 
                      value={formData.release_date}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none [color-scheme:dark]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Poster Image</label>
                    <div className="relative w-full h-[42px] bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 flex items-center text-gray-400 focus-within:border-primary overflow-hidden">
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="text-sm truncate">{formData.poster_url ? formData.poster_url.name : 'Upload Poster...'}</span>
                      <input 
                        name="poster_url" 
                        type="file" 
                        accept="image/*" 
                        required={!editingMovie}
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea 
                    name="movie_description" 
                    required 
                    rows="4" 
                    value={formData.movie_description}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Add Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl border border-gray-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Edit Movie</h2>
              <button onClick={() => { setIsEditModalOpen(false); setEditingMovie(null); resetForm(); }} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Movie Title</label>
                    <input 
                      name="title" 
                      type="text" 
                      required 
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Genre</label>
                    <input 
                      name="genre" 
                      type="text" 
                      required 
                      placeholder="e.g. Action, Sci-Fi" 
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                    <input 
                      name="movie_language" 
                      type="text" 
                      required 
                      value={formData.movie_language}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
                    <input 
                      name="duration" 
                      type="number" 
                      required 
                      min="1" 
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Release Date</label>
                    <input 
                      name="release_date" 
                      type="date" 
                      required 
                      value={formData.release_date}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none [color-scheme:dark]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Poster Image (Optional)</label>
                    <div className="relative w-full h-[42px] bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 flex items-center text-gray-400 focus-within:border-primary overflow-hidden">
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="text-sm truncate">{formData.poster_url ? formData.poster_url.name : 'Upload New Poster...'}</span>
                      <input 
                        name="poster_url" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea 
                    name="movie_description" 
                    required 
                    rows="4" 
                    value={formData.movie_description}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingMovie(null); resetForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Update Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
