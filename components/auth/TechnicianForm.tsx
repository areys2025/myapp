import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Technician, UserRole } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { useApi } from '../../hooks/useApi';
import Select from 'react-select';

interface TechnicianFormProps {
  currentTechnician: any | null;
  onSuccess: () => void;
}

const specializationOptions = [
  { label: 'Android Repair', value: 'Android Repair' },
  { label: 'iOS Repair', value: 'iOS Repair' },
  { label: 'Hardware', value: 'Hardware' },
  { label: 'Software', value: 'Software' },
  { label: 'Battery Replacement', value: 'Battery Replacement' },
  { label: 'Screen Repair', value: 'Screen Repair' },
];

const TechnicianForm: React.FC<TechnicianFormProps> = ({ currentTechnician, onSuccess }) => {
  const isEditMode = Boolean(currentTechnician);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialization, setSpecialization] = useState<{ label: string; value: string }[]>([]);
  const [walletAddress, setWalletAddress] = useState('');
  const [availability, setAvailability] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    // console.log(contactNumber)
    if (currentTechnician) {
      setName(currentTechnician.name || '');
      setEmail(currentTechnician.email || '');
      setContactNumber(currentTechnician.contactNumber || '');

      setSpecialization(

        currentTechnician.specialization?.map((spec:Technician) => ({
          label: spec,
          value: spec,
        })) || []
      );
      setWalletAddress(currentTechnician.walletAddress || '');
      setAvailability(currentTechnician.availability ?? true);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setContactNumber('');
      setSpecialization([]);
      setWalletAddress('');
      setAvailability(true);
    }
  }, [currentTechnician]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isEditMode || password) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setIsLoading(true);

    const selectedSpecs = specialization.map((s) => s.value);

    const technicianData: any = {
      name,
      email,
      contactNumber,
      specialization: selectedSpecs,
      walletAddress,
      availability,
      role: UserRole.TECHNICIAN,
      ...(password && { password }),
    };
console.log(technicianData.contactNumber)
    try {
      if (isEditMode) {
        await api.updateTechnician(currentTechnician!.id, technicianData);
        setSuccess('Technician updated successfully.');
      } else {
        const createdTech = await api.createTechnician(technicianData);
        setSuccess(`Technician "${createdTech?.name || 'Unnamed'}" created.`);

        await api.registerUser({
          name: createdTech.name,
          email: createdTech.email,
          password,
          contactNumber,
          specialization: selectedSpecs,
          deviceType: 'None',
          walletAddress,
          role: UserRole.TECHNICIAN,
        });

        setSuccess(`Registration successful! Welcome, ${createdTech.name}.`);
      }

      onSuccess();
      if (!isEditMode) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {isEditMode ? 'Edit Technician' : 'Register Technician'}
      </h2>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input id="name" label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input id="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input id="contactNumber" label="Contact Number" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <Select
              isMulti
              options={specializationOptions}
              value={specialization}
              onChange={(selected) => setSpecialization(selected as any)}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select specialization(s)"
              isDisabled={isLoading}
            />
          </div>

          <Input id="walletAddress" label="Wallet Address" required value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
                   <div className="flex items-center col-span-2">
            <input
              id="availability"
              type="checkbox"
              checked={availability}
              onChange={(e) => setAvailability(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
              Available
            </label>
          </div> <Input
            id="password"
            label="Password"
            type="password"
            required={!isEditMode}
            placeholder={isEditMode ? 'Leave blank to keep current' : ''}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            required={!isEditMode}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />


        </div>

        <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
          {isEditMode ? 'Update Technician' : 'Register Technician'}
        </Button>
      </form>
    </div>
  );
};

export default TechnicianForm;
