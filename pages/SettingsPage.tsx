
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { useNavigate } from 'react-router-dom';

import { User, UserRole, Customer } from '../types';
import axios from 'axios';


 const token = localStorage.getItem('token');

  const instance = axios.create({
    baseURL: 'https://myapp-ph0r.onrender.com/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
const SettingsPage: React.FC = () => {
  const { user, login } = useAuth(); // Assuming login can update user details
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const navigate = useNavigate();
  
  // For Customer specific fields - Initialize with type safety
  const [contactNumber, setContactNumber] = useState(
    user && user.role === UserRole.CUSTOMER ? (user as Customer).contactNumber : ''
  );
  const [deviceType, setDeviceType] = useState(
    user && user.role === UserRole.CUSTOMER ? (user as Customer).deviceType : ''
  );
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

const handleProfileUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage(null);

  try {
    if (!user) throw new Error('User not found');

    const payload: Partial<User | Customer> = {
      name,
      email,
    };

    if (user.role === UserRole.CUSTOMER) {
      (payload as Customer).contactNumber = contactNumber;
      (payload as Customer).deviceType = deviceType;
    }

const res = await instance.put<User>(`/users/${user.id}`, payload);
    
    // ✅ No need to check for array
    login(res.data); // assumes backend returns the updated user object

    setMessage({ type: 'success', text: 'Profile updated successfully!' });
        navigate('/dashboard');

  } catch (err: any) {
    console.error(err);
    setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
  } finally {
    setIsLoading(false);
  }
};



const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage(null);

  if (newPassword !== confirmNewPassword) {
    setMessage({ type: 'error', text: 'New passwords do not match.' });
    setIsLoading(false);
    return;
  }

  if (newPassword.length < 6) {
    setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
    setIsLoading(false);
    return;
  }

  try {
    const res = await instance.put<User>(`/users/${user?.id}/password`, {
      currentPassword,
      newPassword
    });

        setMessage({
        type: 'success',
        text: res.data.message || 'success! , your password changed.',
      });
    navigate('/dashboard');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  } catch (err: any) {
    console.error(err);
    setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed.' });
  } finally {
    setIsLoading(false);
  }
};


  if (!user) return <p>Loading user settings...</p>;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-dark">Settings</h1>
      {message && <Alert type={message.type} message={message.text} onClose={() => setMessage(null)} className="mb-4" />}

      <Card title="Profile Information">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input label="Full Name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          {user.role === UserRole.CUSTOMER && (
            <>
              <Input label="Contact Number" id="contactNumber" type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              <Input label="Primary Device Type" id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)} />
            </>
          )}
          {/* Add role-specific fields here if needed, e.g., Technician specialization */}

          <Button type="submit" isLoading={isLoading} disabled={isLoading}>Update Profile</Button>
        </form>
      </Card>

      <Card title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input label="Current Password" id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          <Input label="New Password" id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <Input label="Confirm New Password" id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>Change Password</Button>
        </form>
      </Card>

      {user.walletAddress && (
        <Card title="Blockchain Identity (Simulated)">
            <p className="text-sm text-neutral-DEFAULT">Your simulated blockchain wallet address:</p>
            <p className="font-mono text-primary break-all">{user.walletAddress}</p>
            <p className="text-xs text-neutral-DEFAULT mt-2">This address is used for simulated secure login and transactions within the system.</p>
        </Card>
      )}

       <Card title="Notification Preferences (Placeholder)">
        <p className="text-neutral-DEFAULT">Configure your email and SMS notification settings here.</p>
        <div className="mt-4 space-y-2">
            <div>
                <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" defaultChecked/>
                    <span className="ml-2 text-neutral-dark">Email notifications for repair status</span>
                </label>
            </div>
            <div>
                <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded" />
                    <span className="ml-2 text-neutral-dark">SMS notifications for urgent updates</span>
                </label>
            </div>
             <Button className="mt-2" size="sm" variant="ghost">Save Preferences</Button>
        </div>
      </Card>

    </div>
  );
};

export default SettingsPage;
