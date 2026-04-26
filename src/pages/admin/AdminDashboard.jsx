import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Film, 
  MapPin, 
  MonitorPlay, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth.strore';
import api from '../../api/axios';

// Tabs
import OverviewTab from './components/OverviewTab';
import MoviesTab from './components/MoviesTab';
import TheatresTab from './components/TheatresTab';
import UsersTab from './components/UsersTab';
import ShowsTab from './components/ShowsTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      localStorage.removeItem("userData");
      navigate('/login');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'theatres', label: 'Theatres & Screens', icon: MapPin },
    { id: 'shows', label: 'Shows', icon: MonitorPlay },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab />;
      case 'movies': return <MoviesTab />;
      case 'theatres': return <TheatresTab />;
      case 'shows': return <ShowsTab />;
      case 'users': return <UsersTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative z-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-card border border-gray-800 rounded-lg text-white"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800 flex items-center justify-center">
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold tracking-tighter">
              TICKFLOW
            </span>
            <span className="ml-2 text-xs font-bold text-muted bg-gray-800 px-2 py-1 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium
                  ${activeTab === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-primary' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-900/20 transition font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-background/80 backdrop-blur-sm lg:hidden">
            <span className="text-lg font-bold text-white ml-10">Admin Panel</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
