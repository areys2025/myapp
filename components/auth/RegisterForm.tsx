
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole , User } from '../../types';
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
  const [walletAddress, setwalletAddress] = useState('');

  const role = 'Customer';

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  setIsLoading(true);
  try {
    const response = await axios.post<User>('http://localhost:5000/api/auth/register', {
      name,
      email,
      password, // Backend should hash this
      contactNumber,
      deviceType,
      walletAddress,
      role
    });


  const newCustomer: User = {
    id: response.data.id,
    name: response.data.name,
    email: response.data.email,
    contactNumber: response.data.email,

    role: response.data.role,
    walletAddress: response.data.walletAddress,
  };


    login({
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      contactNumber: newCustomer.email,

      role: UserRole.CUSTOMER,
      walletAddress: newCustomer.walletAddress,
    }
  );

    setSuccess(`Registration successful! Welcome, ${response.data}. Redirecting to dashboard...`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
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
            placeholder="user@example.com"
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
            placeholder="e.g., 555-123-4567"
          />
          <Input
            id="deviceType"
            label="Primary Device Type"
            type="text"
            required
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            placeholder="e.g., iPhone 14 Pro, Samsung Galaxy S23"
          />
         <Input
            id="deviceType"
            label="wallet Address"
            type="text"
            required
            value={walletAddress}
            onChange={(e) => setwalletAddress(e.target.value)}
            placeholder="0x123customer4568"
          />
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
