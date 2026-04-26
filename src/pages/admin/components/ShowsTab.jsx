import { useState, useEffect } from 'react';
import { Calendar, Plus, X, Edit2, Trash2 } from 'lucide-react';
import api from '../../../api/axios';

export default function ShowsTab() {
  const [shows, setShows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    movie_id: '',
    screen_id: '',
    start_time: '',
    end_time: '',
    base_price: ''
  });

  const fetchShows = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await api.get('/public/getAllShows');
      const data = response.data?.data || response.data || [];
      if (Array.isArray(data)) {
        setShows(data);
      } else {
        setShows([]);
        setFetchError('Invalid response format from server.');
      }
    } catch (err) {
      console.error('Failed to fetch shows:', err);
      setShows([]);
      setFetchError('Unable to load shows. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      movie_id: '',
      screen_id: '',
      start_time: '',
      end_time: '',
      base_price: ''
    });
    setEditingShow(null);
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({
      movie_id: show.movie_id || '',
      screen_id: show.screen_id || '',
      start_time: show.start_time ? new Date(show.start_time).toISOString().slice(0, 16) : '',
      end_time: show.end_time ? new Date(show.end_time).toISOString().slice(0, 16) : '',
      base_price: show.base_price || show.price || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (showId) => {
    if (!confirm('Are you sure you want to delete this show?')) return;
    
    try {
      await api.delete(`/admin/deleteShow/${showId}`);
      alert('Show deleted successfully!');
      await fetchShows();
    } catch (err) {
      alert('Failed to delete show: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = formData;
      await api.post('/admin/addShow', data);
      setIsModalOpen(false);
      resetForm();
      alert("Show added successfully!");
      fetchShows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add show");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = formData;
      await api.put(`/admin/updateShow/${editingShow.id || editingShow.show_id || editingShow._id}`, data);
      setIsEditModalOpen(false);
      resetForm();
      alert("Show updated successfully!");
      fetchShows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update show");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Shows Schedule</h1>
          <p className="text-muted">Manage movie showtimes across all screens</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add Show</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-card border border-gray-800 rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-gray-500" />
           </div>
           <h2 className="text-xl font-bold text-white mb-2">Loading shows...</h2>
           <p className="text-muted max-w-md">Fetching live show schedule from the backend.</p>
        </div>
      ) : shows.length > 0 ? (
        <div className="grid gap-4">
          {shows.map((show) => (
            <div key={show.id || show.show_id || show._id} className="bg-card border border-gray-800 rounded-3xl p-5 hover:border-primary transition group">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{show.title || show.movie_title || `Show ${show.show_id || show.id}`}</h3>
                  <p className="text-sm text-muted">{show.theatre_name || `Theatre ${show.theatre_id || 'N/A'}`}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted">Screen: {show.screen_name || show.screen_id || 'N/A'}</p>
                    <p className="text-sm text-muted">Price: ₹{show.base_price || show.price || 'N/A'}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={() => handleEdit(show)}
                      className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(show.id || show.show_id || show._id)}
                      className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted">
                <div>
                  <span className="font-medium text-white">Start:</span> {new Date(show.start_time).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium text-white">End:</span> {new Date(show.end_time).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-gray-800 rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-10 h-10 text-gray-500" />
           </div>
           <h2 className="text-xl font-bold text-white mb-2">No Shows Scheduled</h2>
           {fetchError ? (
             <p className="text-red-400 max-w-md">{fetchError}</p>
           ) : (
             <p className="text-muted max-w-md">Click "Add Show" to schedule a movie on a specific screen. A calendar view will appear here once connected to the API.</p>
           )}
        </div>
      )}

      {/* Add Show Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Schedule New Show</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-1">Movie ID</label>
                     <input 
                       name="movie_id" 
                       type="number" 
                       required 
                       value={formData.movie_id}
                       onChange={handleInputChange}
                       className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-1">Screen ID</label>
                     <input 
                       name="screen_id" 
                       type="number" 
                       required 
                       value={formData.screen_id}
                       onChange={handleInputChange}
                       className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                     />
                   </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input 
                    name="start_time" 
                    type="datetime-local" 
                    required 
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none [color-scheme:dark]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input 
                    name="end_time" 
                    type="datetime-local" 
                    required 
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none [color-scheme:dark]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Base Price (₹)</label>
                  <input 
                    name="base_price" 
                    type="number" 
                    required 
                    min="1" 
                    value={formData.base_price}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Add Show'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Show Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Edit Show</h2>
              <button onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-1">Movie ID</label>
                     <input 
                       name="movie_id" 
                       type="number" 
                       required 
                       value={formData.movie_id}
                       onChange={handleInputChange}
                       className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-1">Screen ID</label>
                     <input 
                       name="screen_id" 
                       type="number" 
                       required 
                       value={formData.screen_id}
                       onChange={handleInputChange}
                       className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                     />
                   </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input 
                    name="start_time" 
                    type="datetime-local" 
                    required 
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none [color-scheme:dark]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input 
                    name="end_time" 
                    type="datetime-local" 
                    required 
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none [color-scheme:dark]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Base Price (₹)</label>
                  <input 
                    name="base_price" 
                    type="number" 
                    required 
                    min="1" 
                    value={formData.base_price}
                    onChange={handleInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Update Show'}
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
