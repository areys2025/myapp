import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const tokens = localStorage.getItem('token');

  const Pinstance = axios.create({
    baseURL: 'https://myapp-ph0r.onrender.com/api/auth',
    headers: {
      Authorization: token ? `Bearer ${tokens}` : '',
    },
  });


  // Auto-redirect on success
  useEffect(() => {
    if (message?.type === 'success') {
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            navigate('/login');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [message, navigate]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!token) return setMessage({ type: 'error', text: 'Reset token missing.' });
    if (password !== confirmPassword) return setMessage({ type: 'error', text: 'Passwords do not match.' });

    setIsLoading(true);
    try {

      const res = await Pinstance.post<User>(`/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setMessage({ type: 'success', text: res.data.message || 'your Password successfully changed .' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Reset failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-12 px-6 py-8 bg-white shadow-md rounded-md space-y-6 "
    >
      <h2 className="text-3xl font-semibold text-center text-primary">Reset Your Password</h2>

      <AnimatePresence>
        {message && (
          <motion.div
            key="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5 ">
        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </motion.div>
      </form>

      {message?.type === 'success' && (
        <p className="text-center text-sm text-neutral-700 mt-4">
          Redirecting to{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            login
          </Link>{' '}
          in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
        </p>
      )}
    </motion.div>
  );
};

export default ResetPasswordPage;
