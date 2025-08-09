import React, { useState } from 'react';
import axios from 'axios';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';

const RegisterAdminPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }
  const token = localStorage.getItem('token');

  const instance = axios.create({
    baseURL: 'https://myapp-ph0r.onrender.com/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
  name,
  email,
  password,
  confirmPassword, 
  contactNumber,
  walletAddress,
};


      await instance.post('/regisadmin', payload); // Unified user register endpoint
      setMessage({ type: 'success', text: 'Admin registered successfully!' });

      // Reset fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setContactNumber('');
      setWalletAddress('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card title="Register Admin" className="w-full max-w-xl">
        {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} />}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <Input
            id="name"
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
          <Input
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-type your password"
          />
          <Input
            id="contactNumber"
            label="Contact Number"
            type="tel"
            required
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="e.g., 252-61-1234567"
          />

          <Input
            id="walletAddress"
            label="Wallet Address"
            type="text"
            required
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x1234567890abcdef..."
          />

          <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full">
            Register Admin
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterAdminPage;
