import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { login } from '../store/auth.strore';

export default function Login() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', formState);
      
      const rawUser = response.data?.data || response.data?.user || response.data;
      const normalizedUser = {
        ...rawUser,
        role: rawUser?.role || rawUser?.userType || rawUser?.usertype,
      };
      const userRole = normalizedUser.role?.toString().toLowerCase();

      dispatch(login(normalizedUser));
      localStorage.setItem("userData", JSON.stringify(normalizedUser));
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-card p-10 rounded-2xl border border-gray-800 shadow-xl"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            Log in to continue booking your tickets
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <input
                name="email"
                type="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formState.password}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-[#1A1A1A] text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-red-400 transition">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
          
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-red-400 transition">
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
