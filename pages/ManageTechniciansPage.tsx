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
import { EditIcon, DeleteIcon } from '../constants';

import { FaUserCog, FaUserCheck, FaSearch, FaTools, FaUserPlus } from 'react-icons/fa';

const ManageTechniciansPage: React.FC = () => {
  const api = useApi();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<Technician | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');

  const filteredTechnicians = technicians.filter(tech => {
    const matchesText =
      tech.name.toLowerCase().includes(searchText.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesSpec = filterSpecialization
      ? Array.isArray(tech.specialization) &&
        tech.specialization.some(spec =>
          spec.toLowerCase().includes(filterSpecialization.toLowerCase())
        )
      : true;

    const matchesAvailability = filterAvailability === ''
      ? true
      : filterAvailability === 'true'
        ? tech.availability
        : !tech.availability;

    return matchesText && matchesSpec && matchesAvailability;
  });

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

  const deleteTech = async (id: string) => {
    try {
      await api.deleteTech(id);
      fetchTechnicians();
    } catch (err) {
      setError('Failed to delete technician.');
    }
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

  const columns:any = [
    { header: <><FaUserCog className="inline mr-1" /> Name</>, accessor: 'name' as keyof Technician },
    { header: <><FaUserCheck className="inline mr-1" /> Email</>, accessor: 'email' as keyof Technician },
    {
      header: <><FaTools className="inline mr-1" /> Specialization</>,
      accessor: (tech: Technician) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(tech.specialization)
            ? tech.specialization.map((s, idx) => (
              <span key={idx} className="bg-gray-200 text-xs px-2 py-1 rounded">{s}</span>
            ))
            : tech.specialization}
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: (tech: Technician) =>
        tech.contactNumber ? (
          <span>{tech.contactNumber}</span>
        ) : (
          <span className="text-gray-400 italic">No contact</span>
        ),
    },
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
    {
      header: 'Actions',
      accessor: (tech: Technician) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="default"
            onClick={() => openEditModal(tech)}
            className="p-1 w-8 h-8"
          >
            <EditIcon className="w-5 h-5 text-blue-600" />
          </Button>
          <Button
            size="icon"
            variant='default'
            onClick={() => deleteTech(tech?._id || '')}
            className="p-1 w-8 h-8"
          >
            <DeleteIcon className="w-5 h-5 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card
        title="Manage Technicians" 
 
      className="mt-6"
      footer={<Button onClick={openAddModal}><FaUserPlus className="mr-2" /> Add New Technician</Button>}
    >
      <div className="flex flex-wrap gap-4 p-2">
        <div className="relative w-full max-w-xs">
          <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 border px-3 py-1 rounded shadow-sm w-full"
          />
        </div>

        <select
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm"
        >
          <option value="">All Specializations</option>
          <option value="Android Repair">Android Repair</option>
          <option value="iOS Repair">iOS Repair</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Battery Replacement">Battery Replacement</option>
          <option value="Screen Repair">Screen Repair</option>
        </select>

        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm"
        >
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      <Table<Technician>
        columns={columns}
        data={filteredTechnicians}
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
