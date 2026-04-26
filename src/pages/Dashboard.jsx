import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Star, CreditCard, LogOut, Settings, Bell, ChevronRight, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { logout } from '../store/auth.strore';
import MovieCard from '../components/MovieCard';
import { movies } from '../data/mockData'; // Fallback for recommended movies

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile'); // 'profile' | 'password'
  
  // Forms States
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [modalMessage, setModalMessage] = useState({ type: '', text: '' }); // type: 'success' | 'error'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          api.get('/users/getProfile'),
          api.get('/bookings/getMyBookings')
        ]);
        
        const profileData = profileRes.data.data;
        setProfile(profileData);
        setProfileForm({ username: profileData.username, email: profileData.email });
        setBookings(bookingsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      localStorage.removeItem("userData");
      navigate('/');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setModalMessage({ type: '', text: '' });
    try {
      const res = await api.post('/users/updateProfile', profileForm);
      setProfile(res.data.data);
      setModalMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setModalMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setModalMessage({ type: '', text: '' });
    try {
      await api.post('/users/changePassword', passwordForm);
      setModalMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setModalMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-800 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalSpent = bookings.reduce((sum, b) => sum + Number(b.total_amount), 0);
  const upcomingCount = bookings.filter(b => b.status.toLowerCase() === 'upcoming' || new Date(b.start_time) > new Date()).length;

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Upcoming Shows', value: upcomingCount, icon: Bell, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Money Spent', value: `₹${totalSpent}`, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Reward Points', value: Math.floor(totalSpent / 100), icon: Star, color: 'text-gold', bg: 'bg-yellow-500/10' }
  ];

  // Mock Recommended based on watched genres (since backend doesn't provide it yet)
  const recommendedMovies = movies.filter(m => m.genre.includes('Action') || m.genre.includes('Sci-Fi')).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dashboard Header / Welcome Hero */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-card border border-gray-800 rounded-3xl p-10 mb-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none group-hover:bg-primary/20 transition duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary via-red-500 to-gold p-1 shadow-[0_0_20px_rgba(229,9,20,0.3)]">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || user?.username || 'Guest'}`} 
              alt="Avatar" 
              className="w-full h-full rounded-full bg-[#111] object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Hi {profile?.username || user?.username || 'There'} 👋</h1>
            <p className="text-gray-400 text-lg">Ready for another magical movie night?</p>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8 md:mt-0 relative z-10">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 bg-[#1A1A1A] hover:bg-gray-800 border border-gray-700 rounded-2xl text-white transition flex items-center justify-center group-hover:border-gray-500"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={handleLogout}
            className="p-4 bg-red-900/10 text-red-500 border border-red-900/30 hover:bg-red-900/30 hover:border-red-500/50 rounded-2xl transition flex items-center justify-center shadow-lg"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-card border border-gray-800 rounded-2xl p-6 flex items-center gap-5 hover:border-gray-600 transition duration-300 relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">My Tickets</h2>
            <p className="text-muted">Your recent and upcoming bookings</p>
          </div>
        </div>
        
        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-card border border-gray-800 rounded-3xl">
            <Ticket className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No tickets yet</h3>
            <p className="text-gray-400 mb-6">You haven't booked any movies yet.</p>
            <Link to="/movies" className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bookings.map((booking, index) => {
              const isUpcoming = new Date(booking.start_time) > new Date();
              const bookingStatus = isUpcoming ? 'Upcoming' : booking.status;
              const dateObj = new Date(booking.start_time);
              const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-gray-800 rounded-3xl overflow-hidden flex flex-col sm:flex-row hover:border-primary/50 transition duration-500 relative shadow-xl"
                >
                  <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-background rounded-full hidden sm:block border-r border-gray-800 shadow-inner"></div>
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-background rounded-full hidden sm:block border-l border-gray-800 shadow-inner"></div>
                  
                  <div className="p-8 flex-grow border-b sm:border-b-0 sm:border-r-2 border-dashed border-gray-800 relative bg-gradient-to-br from-card to-[#111]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-1 block">Booking ID</span>
                        <span className="text-white font-mono bg-[#1A1A1A] px-2 py-1 rounded text-sm">{booking.booking_code}</span>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${bookingStatus === 'Upcoming' ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(229,9,20,0.2)]' : 'bg-green-900/20 text-green-500 border border-green-900/30'}`}>
                        {bookingStatus}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-6 line-clamp-1">{booking.movie_title}</h3>
                    
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <span className="block text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">Date & Time</span>
                        <span className="text-white font-medium">{dateStr} <br/> <span className="text-gray-300">{timeStr}</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 sm:w-56 bg-[#0a0a0a] flex flex-col justify-center items-center text-center relative">
                    <div className="mb-8 w-full">
                      <span className="block text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">Total Amount</span>
                      <span className="text-2xl font-black text-gold">₹{booking.total_amount}</span>
                    </div>
                    <button className="w-full bg-transparent hover:bg-gray-800 border-2 border-gray-700 hover:border-gray-500 text-white font-bold py-3 rounded-xl transition duration-300 uppercase tracking-wide text-sm">
                      View Ticket
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Movies */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Recommended For You</h2>
            <p className="text-muted">Based on your recent Action & Sci-Fi watches</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedMovies.map((movie, index) => (
            <motion.div 
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-gray-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                <button 
                  onClick={() => { setIsSettingsOpen(false); setModalMessage({ type: '', text: '' }); }}
                  className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex border-b border-gray-800">
                <button 
                  onClick={() => setSettingsTab('profile')}
                  className={`flex-1 py-4 text-sm font-bold transition ${settingsTab === 'profile' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                >
                  Profile Information
                </button>
                <button 
                  onClick={() => setSettingsTab('password')}
                  className={`flex-1 py-4 text-sm font-bold transition ${settingsTab === 'password' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
                >
                  Change Password
                </button>
              </div>

              <div className="p-8">
                {modalMessage.text && (
                  <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${modalMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                    {modalMessage.text}
                  </div>
                )}

                {settingsTab === 'profile' ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                      <input 
                        type="text" 
                        value={profileForm.username}
                        onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.oldPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition"
                        required
                        minLength={6}
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                      Update Password
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
