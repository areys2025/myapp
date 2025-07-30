
import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { Technician } from '../types';
import Table from '../components/common/Table';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import TechnicianForm from '../components/auth/TechnicianForm';

const ManageTechniciansPage: React.FC = () => {
  const api = useApi();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);

  const fetchTechnicians = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTechnicians();
      setTechnicians(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch technicians.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingTechnician(null);
    fetchTechnicians();
  };

  const openAddModal = () => {
    setEditingTechnician(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tech: Technician) => {
    setEditingTechnician(tech);
    setIsModalOpen(true);
  };

  const handleAvailabilityToggle = async (tech: Technician) => {
    try {
      await api.updateTechnician(tech.id, {
        ...tech,
        availability: !tech.availability
      });
      fetchTechnicians();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update technician availability.');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Technician },
    { header: 'Email', accessor: 'email' as keyof Technician },
    { header: 'Specialization', accessor: 'specialization' as keyof Technician },
    { header: 'Contact', accessor: 'contactNumber' as keyof Technician },
    { header: 'Availability', accessor: (tech: Technician) => (
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tech.availability ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {tech.availability ? 'Available' : 'Unavailable'}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleAvailabilityToggle(tech)}
          className="ml-2"
        >
          Toggle
        </Button>
      </div>
    )},
    { header: 'Actions', accessor: (tech: Technician) => (
      <Button size="sm" variant="ghost" onClick={() => openEditModal(tech)}>
        Edit
      </Button>
    )}
  ];

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card 
      title="Manage Technicians" 
      className="mt-6"
      footer={<Button onClick={openAddModal}>Add New Technician</Button>}
    >
      <Table<Technician>
        columns={columns}
        data={technicians}
        isLoading={isLoading}
        emptyMessage="No technicians found."
      />
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingTechnician(null); }} 
          title={editingTechnician ? 'Edit Technician' : 'Add New Technician'}
        >
          <TechnicianForm currentTechnician={editingTechnician} onSuccess={handleFormSuccess} />
        </Modal>
      )}
    </Card>
  );
};

export default ManageTechniciansPage;
