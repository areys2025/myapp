import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import { User } from '../types';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post<User>('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage({
        type: 'success',
        text: res.data.message || 'Reset link sent. Please check your email.',
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-white"
    >
      <Card title="🔐 Forgot Password?" className="w-full max-w-md shadow-xl">
        <p className="text-sm text-neutral-600 mb-4">
          Enter your email below. We’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" isLoading={isLoading} disabled={isLoading || !email} className="w-full">
              Send Reset Link
            </Button>
          </motion.div>
        </form>

        {message?.type === 'success' && (
          <div className="text-sm text-center text-neutral-500 mt-4">
            📬 Didn’t get it? Check your spam folder or try again.
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ForgotPasswordPage;
