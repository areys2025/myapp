import { useState } from 'react';
import { ethers } from 'ethers';

const LoginWithWallet = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!window.ethereum) {
        alert('Please install MetaMask extension');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []); // request account access

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = `Login to Repair System - ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      const res = await fetch('/api/auth/metamask-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert(`Welcome, ${data.user.name}`);
        // Optionally redirect here
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('MetaMask login error:', err);
      alert('MetaMask login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Connecting...' : 'Login with MetaMask'}
    </button>
  );
};

export default LoginWithWallet;
