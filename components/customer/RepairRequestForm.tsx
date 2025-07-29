
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RepairTicket } from '../../types';
import Button from '../common/Button';
import Input, { Textarea } from '../common/Input';
import Alert from '../common/Alert';
import Card from '../common/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_REPAIRS || 'http://localhost:5000/api/repairs';


interface RepairRequestFormProps {
  onSuccess?: (ticket: RepairTicket) => void;
}

const RepairRequestForm: React.FC<RepairRequestFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [deviceInfo, setDeviceInfo] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'Customer') {
      setError('You must be logged in as a customer to submit a request.');
      return;
    }
const LoginfoEml=user.email;
const LoginfoRle=user.role;

    if (!deviceInfo.trim() || !issueDescription.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
console.log("Submitting data:", {
  customerId: user.id,
  customerName: user.name,
  deviceInfo,
  issueDescription,
  LoginfoEml,
  LoginfoRle
});
console.log("user from context:", user);

    try {
      const response = await axios.post<RepairTicket>(API_URL, {
        customerId: user.id,
        customerName: user.name,
        deviceInfo,
        issueDescription,
        LoginfoEml,
        LoginfoRle
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data.customerName)
      const newTicket = response.data;

      setSuccessMessage(`Repair request submitted! Ticket ID: ${newTicket.id}`);
      setDeviceInfo('');
      setIssueDescription('');
      if (onSuccess)
         onSuccess(newTicket);
      setTimeout(() => navigate('/dashboard'), 2000);
    }catch (err: any) {
        console.error('Error submitting repair request:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
          setError(err.response.data?.message || 'Server returned an error.');
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('No response from server. Is it running?');
        } else {
          console.error('Request setup error:', err.message);
          setError('Unexpected error occurred.');
        }
      }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Submit New Repair Request" className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}

        <Input
          label="Device Information"
          id="deviceInfo"
          value={deviceInfo}
          onChange={(e) => setDeviceInfo(e.target.value)}
          placeholder="e.g., iPhone 12 Pro, Serial #XYZ123"
          required
          disabled={isLoading}
        />
        <Textarea
          label="Issue Description"
          id="issueDescription"
          value={issueDescription}
          onChange={(e) => setIssueDescription(e.target.value)}
          placeholder="Describe the problem with your device..."
          required
          rows={4}
          disabled={isLoading}
        />
        <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full">
          Submit Request
        </Button>
      </form>
    </Card>
  );
};

export default RepairRequestForm;

