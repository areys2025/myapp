import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { APP_NAME } from '../../constants';
import { ethers } from 'ethers';
// Predefined users for simulation


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://myapp-ph0r.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Format user data to match the expected structure
      const formattedUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        contactNumber: data.user.contactNumber,

        walletAddress: data.user.walletAddress
      };

      // Store token and login with formatted user data
      localStorage.setItem('token', data.token);
      login(formattedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

const handleBlockchainLogin = async () => {
  setIsLoading(true);
  setError(null);

  try {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const message = `Login to ${APP_NAME} - ${new Date().toISOString()}`;
    const signature = await signer.signMessage(message);

    const response = await fetch('https://myapp-ph0r.onrender.com/api/auth/metamask-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'MetaMask login failed');
    }

    const formattedUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      contactNumber:data.user.contactNumber,
      role: data.user.role,
      walletAddress: data.user.walletAddress
    };

    localStorage.setItem('token', data.token);
    login(formattedUser);
    navigate('/dashboard');
  } catch (err) {
    console.error(err);
    setError(err instanceof Error ? err.message : 'Blockchain login failed');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-dark">
            {APP_NAME}
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-DEFAULT">
            Securely access your account
          </p>
        </div>
        
        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />}

        <form className="mt-8 space-y-6" onSubmit={handleStandardLogin}>
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button type="submit" className="w-full sm:w-auto" isLoading={isLoading} disabled={isLoading}>
            Sign in
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-DEFAULT">
                Or connect with (Simulated Blockchain Login)
              </span>
            </div>
          </div>

<div className="mt-6 grid grid-cols-1 gap-3">
  <Button 
    variant="secondary"
    onClick={handleBlockchainLogin}
    isLoading={isLoading}
    disabled={isLoading}
    className="w-full"
  >
    Sign in  with MetaMask
  </Button>
</div>
        </div>
                 <p className="mt-4 text-center text-sm text-neutral-DEFAULT">
            <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
              Forget password
            </Link>
          </p>  <p className="mt-4 text-center text-sm text-neutral-DEFAULT">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              Register here
            </Link>
          </p>

      </div>
    </div>
  );
};

export default LoginForm;
