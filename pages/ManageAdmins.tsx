import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { Admin } from '../types';
import Table from '../components/common/Table';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import AdminForm from '../components/auth/adminForm';
import { EditIcon, DeleteIcon } from '../constants';


const ManageAdminsPage: React.FC = () => {
  const api = useApi();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
const [searchText, setSearchText] = useState('');
const [filterAvailability, setFilterAvailability] = useState('');

const filteredAdmins = admins.filter((admin) => {
  const matchesText =
    admin.name.toLowerCase().includes(searchText.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchText.toLowerCase());

  const matchesAvailability =
    filterAvailability === ''
      ? true
      : filterAvailability === 'true'
      ? admin.availability
      : !admin.availability;

  return matchesText && matchesAvailability;
});


  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTAdmins();
      setAdmins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admins.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    fetchAdmins();
  };

  const openAddModal = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const deleteAdmin = async (id: string) => {
    try {
      await api.deleteAdmin(id);
      fetchAdmins();
    } catch (err) {
      setError('Failed to delete admin.');
    }
  };

  const toggleAvailability = async (admin: Admin) => {
    try {
      await api.updateAdmin(admin.id, {
        ...admin,
        availability: !admin.availability,
      });
      fetchAdmins();
    } catch (err) {
      setError('Failed to toggle availability.');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Admin },
    { header: 'Email', accessor: 'email' as keyof Admin },
    { header: 'Contact', accessor: 'contactNumber' as keyof Admin },
    {
      header: 'Availability',
      accessor: (admin: Admin) => (
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              admin.availability ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}
          >
            {admin.availability ? 'Available' : 'Unavailable'}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleAvailability(admin)}
          >
            Toggle
          </Button>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (admin: Admin) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="default"
            onClick={() => openEditModal(admin)}
            className="p-1 w-8 h-8"
          >
<EditIcon className="w-5 h-5 text-blue-600" />          </Button>
          <Button
            size="icon"
            variant='default'
            onClick={() => deleteAdmin(admin.id)}
            className="p-1 w-8 h-8"
          >
<DeleteIcon className="w-5 h-5 text-red-600" />          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card
      title="Manage Admins"
      className="mt-6"
      footer={<Button onClick={openAddModal}>Add New Admin</Button>}
    >
        <div className="flex flex-wrap gap-4 p-2">
  <input
    type="text"
    placeholder="Search by name or email"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="border px-3 py-1 rounded shadow-sm"
  />
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

      <Table<Admin>
        columns={columns}
data={filteredAdmins}
        isLoading={isLoading}
        emptyMessage="No admins found."
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAdmin(null);
          }}
          title={editingAdmin ? 'Edit Admin' : 'Add New Admin'}
        >
          <AdminForm currentAdmin={editingAdmin} onSuccess={handleFormSuccess} />
        </Modal>
      )}
    </Card>
  );
};

export default ManageAdminsPage;
