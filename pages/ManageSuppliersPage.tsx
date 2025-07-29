import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { Supplier } from '../types';
import Table from '../components/common/Table';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SupplierForm from '../components/supplier/SupplierForm';
import { EditIcon, DeleteIcon } from '../constants';

const ManageSuppliersPage: React.FC = () => {
  const api = useApi();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterActive, setFilterActive] = useState('');

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data:any = await api.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError('Failed to fetch suppliers.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    fetchSuppliers();
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const deleteSupplier = async (id: string) => {
    try {
      await api.deleteSupplier(id);
      fetchSuppliers();
    } catch (err) {
      setError('Failed to delete supplier.');
    }
  };

  const toggleActiveStatus = async (supplier: Supplier) => {
    try {
      await api.updateSupplier(supplier.id, {
        ...supplier,
        isActive: !supplier.isActive,
      });
      fetchSuppliers();
    } catch (err) {
      setError('Failed to update supplier status.');
    }
  };

  const filteredSuppliers = suppliers.filter((sup) => {
    const matchesText =
      sup.name.toLowerCase().includes(searchText.toLowerCase()) ||
      sup.company.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      filterActive === ''
        ? true
        : filterActive === 'true'
        ? sup.isActive
        : !sup.isActive;

    return matchesText && matchesStatus;
  });

  const columns:any = [
    { header: 'Name', accessor: 'name' },
    { header: 'Company', accessor: 'company' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Status', accessor: (sup: Supplier) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sup.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {sup.isActive ? 'Active' : 'Inactive'}
          </span>
          <Button size="sm" variant="ghost" onClick={() => toggleActiveStatus(sup)}>Toggle</Button>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (sup: any) => (
        <div className="flex space-x-2">
        
                  <Button
            size="icon"
            variant="default"
            onClick={() => openEditModal(sup)}
            className="p-1 w-8 h-8"
          >
<EditIcon className="w-5 h-5 text-blue-600" />         
 </Button>
          <Button
            size="icon"
            variant='default'
            onClick={() => deleteSupplier(sup.id)}
            className="p-1 w-8 h-8"
          >
<DeleteIcon className="w-5 h-5 text-red-600" />          </Button>
    
        </div>
      )
    }
  ];

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card title="Manage Suppliers" className="mt-6" footer={<Button onClick={openAddModal}>Add Supplier</Button>}>
      <div className="flex flex-wrap gap-4 p-2">
        <input
          type="text"
          placeholder="Search by name or company"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm"
        />
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="border px-3 py-1 rounded shadow-sm"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <Table<Supplier>
        columns={columns}
        data={filteredSuppliers}
        isLoading={isLoading}
        emptyMessage="No suppliers found."
      />

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingSupplier(null); }}
          title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        >
          <SupplierForm currentSupplier={editingSupplier} onSuccess={handleFormSuccess} />
        </Modal>
      )}
    </Card>
  );
};

export default ManageSuppliersPage;
