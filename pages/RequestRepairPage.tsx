
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RepairRequestForm from '../components/customer/RepairRequestForm';
import { RepairTicket } from '../types';

const RequestRepairPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (ticket: RepairTicket) => {
    // Optionally navigate or show further instructions
    console.log('Repair request successful, ticket:', ticket);
    // navigate('/my-repairs'); // Or stay on page to allow multiple requests
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-dark mb-6">Request New Repair</h1>
      <RepairRequestForm onSuccess={handleSuccess} />
    </div>
  );
};

export default RequestRepairPage;
