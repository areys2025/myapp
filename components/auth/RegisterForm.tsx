import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, User } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { APP_NAME } from '../../constants';
import axios from 'axios';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const role = 'Customer';

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhoneNumber = (number: string): boolean =>
    /^\+?[0-9\s\-]{7,15}$/.test(number);

  const validateWalletAddress = (address: string): boolean =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!validatePhoneNumber(contactNumber)) {
      return setError("Invalid contact number format.");
    }

    if (!validateWalletAddress(walletAddress)) {
      return setError("Invalid wallet address format.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (!deviceType.trim()) {
      return setError("Device type is required.");
    }

    setIsLoading(true);
    try {
      const response = await axios.post<User>('https://myapp-ph0r.onrender.com/api/auth/register', {
        name,
        email,
        password,
        contactNumber,
        deviceType,
        walletAddress,
        role
      });

      const newCustomer = response.data;

      login({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        contactNumber: newCustomer.contactNumber,
        role: UserRole.CUSTOMER,
        walletAddress: newCustomer.walletAddress,
      });

      setSuccess(`Registration successful! Welcome, ${newCustomer.name}. Redirecting...`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-dark">
            Create an Account for {APP_NAME}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-DEFAULT">
            All new registrations are for Customer role.
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}
        {success && <Alert type="success" message={success} className="mb-4" />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input id="name" label="Full Name" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input id="email" label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input id="password" label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input id="confirmPassword" label="Confirm Password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Input id="contactNumber" label="Contact Number" type="tel" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          <Input id="deviceType" label="Device Type" type="text" required value={deviceType} onChange={(e) => setDeviceType(e.target.value)} />
          <Input id="walletAddress" label="Wallet Address" type="text" required value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
          <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading || !!success}>
            Register
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-DEFAULT">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
