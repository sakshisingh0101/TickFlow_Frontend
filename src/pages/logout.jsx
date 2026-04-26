import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import api from '../api/axios';
import { logout } from '../store/auth.strore';

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await api.get('/auth/logout'); // Calling the logout API endpoint
      } catch (err) {
        console.error('Logout API call failed', err);
      } finally {
        dispatch(logout());
        localStorage.removeItem("userData");
        navigate('/login');
      }
    };

    handleLogout();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto border border-gray-800">
          <LogOut className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white">Signing you out...</h2>
        <p className="text-muted">Please wait while we securely end your session.</p>
      </motion.div>
    </div>
  );
}
