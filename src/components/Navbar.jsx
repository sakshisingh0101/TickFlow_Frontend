import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Clapperboard, Search, User, LogOut, ChevronDown, Ticket, LayoutDashboard, ShieldCheck } from 'lucide-react';
import api from '../api/axios';
import { logout } from '../store/auth.strore';
import ShowCard from './ShowCard';

export default function Navbar() {
  const { user: reduxUser, isLoggedIn: reduxIsLoggedIn } = useSelector((state) => state.auth);
  
  // Fallback to localStorage if Redux state is not available
  const [localStorageUser, setLocalStorageUser] = useState(null);
  
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      try {
        setLocalStorageUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse userData:", e);
      }
    }
  }, []);
  
  const user = reduxUser || localStorageUser;
  const isLoggedIn = reduxIsLoggedIn || !!localStorageUser;
  const userRole = (user?.role || user?.userType || user?.usertype)?.toString().toLowerCase();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSearchResults = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get('/public/search', { params: { query: query } });
      setSearchResults(response.data.data || response.data || []);
    } catch (err) {
      console.error('Search API error:', err);
      setSearchResults([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      await fetchSearchResults(query);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => {
      if (query.trim()) {
        fetchSearchResults(query.trim());
      } else {
        setSearchResults([]);
      }
    }, 300));
  };

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      localStorage.removeItem("userData");
      setIsDropdownOpen(false);
      navigate('/');
    }
  };

  return (
    <nav className="bg-background/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 text-primary font-black text-2xl tracking-tighter hover:scale-105 transition">
              <Clapperboard className="w-8 h-8" />
              <span>TickFlow</span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white font-medium transition">Home</Link>
              <Link to="/movies" className="text-gray-300 hover:text-white font-medium transition">Movies</Link>
              
              {!isLoggedIn ? (
                <>
                  <a href="#cities" className="text-gray-300 hover:text-white font-medium transition">Cities</a>
                  <a href="#offers" className="text-gray-300 hover:text-white font-medium transition">Offers</a>
                  <a href="#about" className="text-gray-300 hover:text-white font-medium transition">About</a>
                </>
              ) : userRole === 'admin' ? (
                <Link to="/admin" className="text-primary hover:text-red-400 font-bold transition flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition">My Bookings</Link>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium transition">Dashboard</Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-6">
            
            {/* Global Search Bar */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="hidden md:flex items-center bg-[#1A1A1A] rounded-full px-4 py-2 border border-gray-800 focus-within:border-primary transition-colors w-64">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Search movie, city, theatre..." 
                  className="bg-transparent border-none text-sm focus:outline-none text-white w-full placeholder-gray-500"
                />
              </form>
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-96 bg-card border border-gray-800 rounded-2xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-4">
                    {searchResults.slice(0, 4).map((show) => (
                      <ShowCard key={show.show_id} show={show} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold transition shadow-lg shadow-primary/20">
                  Signup
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-800/50 p-2 rounded-xl transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-gold p-[2px]">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full bg-card"
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-white leading-tight">{user?.username || user?.name || 'User'}</p>
                    <p className="text-xs text-muted capitalize">{userRole || 'guest'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-gray-800 rounded-2xl shadow-2xl py-2 z-50">
                    {userRole === 'admin' ? (
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          My Dashboard
                        </Link>
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition"
                        >
                          <Ticket className="w-4 h-4" />
                          My Bookings
                        </Link>
                      </>
                    )}
                    <div className="h-px bg-gray-800 my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-900/20 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
}
