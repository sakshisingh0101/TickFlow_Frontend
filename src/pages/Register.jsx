import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { login } from '../store/auth.strore';

export default function Register() {
  const [formState, setFormState] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', formState);
      setStep(2);
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/verifyEmail', {
        email: formState.email,
        otp: otp
      });
      
      if (response.data?.user) {
        dispatch(login(response.data.user));
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'OTP Verification failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-card p-10 rounded-2xl border border-gray-800 shadow-xl"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            {step === 1 ? 'Join TickFlow' : 'Verify Email'}
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            {step === 1 ? 'Create an account to book tickets instantly.' : `We sent an OTP to ${formState.email}`}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  name="userName"
                  type="text"
                  required
                  value={formState.userName}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  placeholder="johndoe"
                />
              </div>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
            
            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-red-400 transition">
                Log in
              </Link>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifySubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Enter OTP</label>
              <input
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition text-center text-2xl tracking-widest"
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
