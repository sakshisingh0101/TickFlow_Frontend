import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Monitor } from 'lucide-react';
import api from '../../../api/axios';

export default function TheatresTab() {
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [isTheatreModalOpen, setIsTheatreModalOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [isEditTheatreModalOpen, setIsEditTheatreModalOpen] = useState(false);
  const [isEditScreenModalOpen, setIsEditScreenModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [editingScreen, setEditingScreen] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form data states
  const [theatreFormData, setTheatreFormData] = useState({
    theatre_name: '',
    city: '',
    address: ''
  });

  const [screenFormData, setScreenFormData] = useState({
    theatre_id: '',
    screen_name: '',
    total_rows: '',
    total_columns: ''
  });

  const fetchTheatres = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/public/getAllTheatres');
      setTheatres(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Failed to fetch theatres:', err);
      setTheatres([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScreens = async () => {
    try {
      const response = await api.get('/public/getAllScreens');
      setScreens(response.data?.data || response.data || []);
    } catch (err) {
      console.error('Failed to fetch screens:', err);
      setScreens([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTheatres(), fetchScreens()]);
    };
    loadData();
  }, []);

  // Form handlers
  const handleTheatreInputChange = (e) => {
    const { name, value } = e.target;
    setTheatreFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScreenInputChange = (e) => {
    const { name, value } = e.target;
    setScreenFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetTheatreForm = () => {
    setTheatreFormData({
      theatre_name: '',
      city: '',
      address: ''
    });
    setEditingTheatre(null);
  };

  const resetScreenForm = () => {
    setScreenFormData({
      theatre_id: '',
      screen_name: '',
      total_rows: '',
      total_columns: ''
    });
    setEditingScreen(null);
  };

  const handleEditTheatre = (theatre) => {
    setEditingTheatre(theatre);
    setTheatreFormData({
      theatre_name: theatre.theatre_name || theatre.name || '',
      city: theatre.city || '',
      address: theatre.address || theatre.location_address || ''
    });
    setIsEditTheatreModalOpen(true);
  };

  const handleEditScreen = (screen) => {
    setEditingScreen(screen);
    setScreenFormData({
      theatre_id: screen.theatre_id || screen.theatre || '',
      screen_name: screen.screen_name || screen.name || '',
      total_rows: screen.total_rows || screen.rows || '',
      total_columns: screen.total_columns || screen.columns || ''
    });
    setIsEditScreenModalOpen(true);
  };

  const handleDeleteTheatre = async (theatreId) => {
    if (!confirm('Are you sure you want to delete this theatre?')) return;
    
    try {
      await api.delete(`/admin/deleteTheatre/${theatreId}`);
      alert('Theatre deleted successfully!');
      await fetchTheatres();
    } catch (err) {
      alert('Failed to delete theatre: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteScreen = async (screenId) => {
    if (!confirm('Are you sure you want to delete this screen?')) return;
    
    try {
      await api.delete(`/admin/deleteScreen/${screenId}`);
      alert('Screen deleted successfully!');
      await fetchScreens();
    } catch (err) {
      alert('Failed to delete screen: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddTheatre = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = theatreFormData;
      await api.post('/admin/addTheatre', data);
      setIsTheatreModalOpen(false);
      resetTheatreForm();
      alert("Theatre added successfully!");
      await fetchTheatres();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add theatre");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTheatre = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = theatreFormData;
      await api.put(`/admin/updateTheatre/${editingTheatre.id || editingTheatre.theatre_id || editingTheatre._id}`, data);
      setIsEditTheatreModalOpen(false);
      resetTheatreForm();
      alert("Theatre updated successfully!");
      await fetchTheatres();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update theatre");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddScreen = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = screenFormData;
      await api.post('/admin/addScreen', data);
      setIsScreenModalOpen(false);
      resetScreenForm();
      alert("Screen added successfully!");
      await fetchScreens();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add screen");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateScreen = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = screenFormData;
      await api.put(`/admin/updateScreen/${editingScreen.id || editingScreen.screen_id || editingScreen._id}`, data);
      setIsEditScreenModalOpen(false);
      resetScreenForm();
      alert("Screen updated successfully!");
      await fetchScreens();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update screen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Theatres & Screens</h1>
          <p className="text-muted">Manage your physical locations and projection rooms</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsScreenModalOpen(true)}
            className="bg-card hover:bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition"
          >
            <Monitor className="w-5 h-5" />
            <span className="hidden sm:inline">Add Screen</span>
          </button>
          <button 
            onClick={() => setIsTheatreModalOpen(true)}
            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Theatre</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-card border border-gray-800 rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading theatres and screens...</h2>
          <p className="text-muted max-w-md">Fetching live admin data from the backend.</p>
        </div>
      ) : ( 
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-card border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Theatres</h2>
                <p className="text-sm text-muted">{theatres.length} theatre{theatres.length === 1 ? '' : 's'} found</p>
              </div>
            </div>
            {theatres.length > 0 ? (
              <div className="space-y-4">
                {theatres.map((theatre) => (
                  <div key={theatre.id || theatre.theatre_id || theatre._id} className="border border-gray-800 rounded-3xl p-4 bg-[#111] group hover:border-gray-600 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white text-lg">{theatre.theatre_name || theatre.name || `Theatre ${theatre.theatre_id || theatre.id}`}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button 
                          onClick={() => handleEditTheatre(theatre)}
                          className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTheatre(theatre.id || theatre.theatre_id || theatre._id)}
                          className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted">City: {theatre.city || theatre.location || 'Unknown'}</p>
                    <p className="text-sm text-muted truncate">Address: {theatre.address || theatre.location_address || 'N/A'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No theatres found yet. Add a theatre to start managing locations.</p>
            )}
          </div>
          <div className="bg-card border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Screens</h2>
                <p className="text-sm text-muted">{screens.length} screen{screens.length === 1 ? '' : 's'} found</p>
              </div>
            </div>
            {screens.length > 0 ? (
              <div className="space-y-4">
                {screens.map((screen) => (
                  <div key={screen.id || screen.screen_id || screen._id} className="border border-gray-800 rounded-3xl p-4 bg-[#111] group hover:border-gray-600 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white text-lg">{screen.screen_name || screen.name || `Screen ${screen.screen_id || screen.id}`}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button 
                          onClick={() => handleEditScreen(screen)}
                          className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteScreen(screen.id || screen.screen_id || screen._id)}
                          className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted">Theatre ID: {screen.theatre_id || screen.theatre || 'Unknown'}</p>
                    <p className="text-sm text-muted">Capacity: {screen.total_rows || screen.rows || '?'} x {screen.total_columns || screen.columns || '?'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No screens found yet. Add screens to your theatres.</p>
            )}
          </div>
        </div>
      )}

      {/* Add Theatre Modal */}
      {isTheatreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Add New Theatre</h2>
              <button onClick={() => setIsTheatreModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleAddTheatre} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Theatre Name</label>
                  <input 
                    name="theatre_name" 
                    type="text" 
                    required 
                    value={theatreFormData.theatre_name}
                    onChange={handleTheatreInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <input 
                    name="city" 
                    type="text" 
                    required 
                    value={theatreFormData.city}
                    onChange={handleTheatreInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <textarea 
                    name="address" 
                    required 
                    rows="3" 
                    value={theatreFormData.address}
                    onChange={handleTheatreInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsTheatreModalOpen(false); resetTheatreForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Add Theatre'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Screen Modal */}
      {isScreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Add New Screen</h2>
              <button onClick={() => setIsScreenModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleAddScreen} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Theatre ID</label>
                  <input 
                    name="theatre_id" 
                    type="number" 
                    required 
                    value={screenFormData.theatre_id}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Screen Name (e.g. Screen 1)</label>
                  <input 
                    name="screen_name" 
                    type="text" 
                    required 
                    value={screenFormData.screen_name}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Rows</label>
                  <input 
                    name="total_rows" 
                    type="number" 
                    required 
                    min="1" 
                    value={screenFormData.total_rows}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Columns</label>
                  <input 
                    name="total_columns" 
                    type="number" 
                    required 
                    min="1" 
                    value={screenFormData.total_columns}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsScreenModalOpen(false); resetScreenForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Add Screen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Theatre Modal */}
      {isEditTheatreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Edit Theatre</h2>
              <button onClick={() => { setIsEditTheatreModalOpen(false); resetTheatreForm(); }} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleUpdateTheatre} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Theatre Name</label>
                  <input 
                    name="theatre_name" 
                    type="text" 
                    required 
                    value={theatreFormData.theatre_name}
                    onChange={handleTheatreInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <input 
                    name="city" 
                    type="text" 
                    required 
                    value={theatreFormData.city}
                    onChange={handleTheatreInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <textarea 
                    name="address" 
                    required 
                    rows="3" 
                    value={theatreFormData.address}
                    onChange={handleTheatreInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsEditTheatreModalOpen(false); resetTheatreForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Update Theatre'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Screen Modal */}
      {isEditScreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold text-white">Edit Screen</h2>
              <button onClick={() => { setIsEditScreenModalOpen(false); resetScreenForm(); }} className="text-gray-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleUpdateScreen} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Theatre ID</label>
                  <input 
                    name="theatre_id" 
                    type="number" 
                    required 
                    value={screenFormData.theatre_id}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Screen Name (e.g. Screen 1)</label>
                  <input 
                    name="screen_name" 
                    type="text" 
                    required 
                    value={screenFormData.screen_name}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Rows</label>
                  <input 
                    name="total_rows" 
                    type="number" 
                    required 
                    min="1" 
                    value={screenFormData.total_rows}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Columns</label>
                  <input 
                    name="total_columns" 
                    type="number" 
                    required 
                    min="1" 
                    value={screenFormData.total_columns}
                    onChange={handleScreenInputChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" 
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsEditScreenModalOpen(false); resetScreenForm(); }} className="px-6 py-2 rounded-xl text-white hover:bg-gray-800 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Update Screen'}
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
