
import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { InventoryItem, UserRole } from '../../types';
import Table from '../common/Table';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import PartForm from './PartForm'; // Create this next
import { useAuth } from '../../contexts/AuthContext';
import { EditIcon } from '../../constants';

const InventoryList: React.FC = () => {
  const api = useApi();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { user } = useAuth();
const isTechnician = user?.role === UserRole.TECHNICIAN;

const [filterText, setFilterText] = useState('');
const [filterSupplier, setFilterSupplier] = useState('');
const [stockFilterType] = useState<'all' | 'low' | 'high'>('all');
const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

const filteredInventory = inventory
  .filter(item => {
    const matchesText = item.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesSupplier = item.supplier?.toLowerCase().includes(filterSupplier.toLowerCase());

    const matchesStock =
      stockFilterType === 'all' ||
      (stockFilterType === 'low' && item.quantity < item.minStockLevel) ||
      (stockFilterType === 'high' && item.quantity >= item.minStockLevel);

    return matchesText && matchesSupplier && matchesStock;
  })
  .sort((a, b) => {
    if (sortOrder === 'asc') return a.quantity - b.quantity;
    if (sortOrder === 'desc') return b.quantity - a.quantity;
    return 0;
  });

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await api.getInventoryItems();
      setInventory(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);
 

  useEffect(() => { 
    fetchInventory()
  }, []);
  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    fetchInventory();
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const getRowClass = (item: InventoryItem) => {


    return item.quantity < item.minStockLevel ? 'bg-red-50 hover:bg-red-100' : '';
  };

const columns:any = [
      { header: 'Part id', accessor: '_id' as keyof InventoryItem, className: 'font-mono text-xs' },

  { header: 'Name', accessor: 'name' as keyof InventoryItem },
  { 
    header: 'Quantity',
    accessor: 'quantity' as keyof InventoryItem,
    cellClassName: (item: InventoryItem) =>
      item.quantity < item.minStockLevel ? 'text-red-600 font-semibold' : '',
  },
  { header: 'Min. Stock', accessor: 'minStockLevel' as keyof InventoryItem },
  { header: 'Price', accessor: (item: InventoryItem) => `$${item.price.toFixed(2)}` },
  { header: 'Supplier', accessor: 'supplier' as keyof InventoryItem },
    
  !isTechnician && {
    header: 'Actions',
    accessor: (item: InventoryItem) => (
      <Button size="sm" variant="ghost" onClick={() => openEditModal(item)} >
<EditIcon className="w-5 h-5 text-blue-600" />      </Button>
    ),
  },
].filter(Boolean); 


  if (isLoading && inventory.length === 0) return <Spinner />; 
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card title="Inventory Management" 
      className="mt-6"
footer={
  !isTechnician && (
    <Button onClick={openAddModal}>
      Add New Product
    </Button>
  )
}

    >
      {isLoading && <div className="p-4 text-center"><Spinner size="sm" /> Updating...</div>}
      <div className="flex flex-wrap gap-4 p-2">
  <input
    type="text"
    placeholder="Search by name..."
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    className="border px-3 py-1 rounded shadow-sm"
  />
<select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
  className="border px-3 py-1 rounded shadow-sm"
>
  <option value="none">No Sorting</option>
  <option value="asc">Quantity: Low → High</option>
  <option value="desc">Quantity: High → Low</option>
</select>

  <input
    type="text"
    placeholder="Filter by supplier"
    value={filterSupplier}
    onChange={(e) => setFilterSupplier(e.target.value)}
    className="border px-3 py-1 rounded shadow-sm"
  />


</div>

      <Table<InventoryItem>
        columns={columns}
data={filteredInventory}
        isLoading={isLoading}
        emptyMessage="No inventory items found."
        rowClassName={getRowClass}
      />
{!isTechnician && (
  <Modal
    isOpen={isModalOpen}
    onClose={() => {
      setIsModalOpen(false);
      setEditingItem(null);
    }}
    title={editingItem ? 'Edit Product' : 'Add New Product'}
  >
    <PartForm currentItem={editingItem} onSuccess={handleFormSuccess} />
  </Modal>
)}

    </Card>
  );
};

export default InventoryList;
