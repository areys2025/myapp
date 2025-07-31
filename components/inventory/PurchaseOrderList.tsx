import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { PurchaseOrder, InventoryItem } from '../../types';
import Table from '../common/Table';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import PurchaseOrderForm from './PurchaseOrderForm';
import Input, { Select } from '../common/Input';

const PurchaseOrderList: React.FC = () => {
  const api = useApi();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

const updateStatus = async (orderId: string, newStatus: 'Received' | 'Cancelled') => {
  try {
    await api.updatePurchaseOrderStatus(orderId, newStatus);
    fetchData(); // Refresh orders after update
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update order status.');
  }
};


  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedOrders, fetchedItems] = await Promise.all([
        api.getPurchaseOrders(),
        api.getInventoryItems()
      ]);
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders); // Initial state
      setInventoryItems(fetchedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchase orders or inventory.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(order =>
        order.itemName.toLowerCase().includes(lower) ||
        order.supplier.toLowerCase().includes(lower)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    setFilteredOrders(filtered);
  }, [searchText, statusFilter, orders]);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchData(); // Refresh list
  };

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'PO ID', accessor: 'itemId' as keyof PurchaseOrder, className: 'font-mono text-xs' },
    { header: 'Item Name', accessor: 'itemName' as keyof PurchaseOrder },
    { header: 'Quantity', accessor: 'quantity' as keyof PurchaseOrder },
    { header: 'Supplier', accessor: 'supplier' as keyof PurchaseOrder },
    { header: 'Order Date', accessor: (order: PurchaseOrder) => new Date(order.orderDate).toLocaleDateString() },
    { header: 'Expected Delivery', accessor: (order: PurchaseOrder) => new Date(order.expectedDeliveryDate).toLocaleDateString() },
    { header: 'Total Cost', accessor: (order: PurchaseOrder) => `$${order.totalCost.toFixed(2)}` },
    {
      header: 'Status', accessor: (order: PurchaseOrder) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status}
        </span>
      )
    },
    {
  header: 'Actions',
  accessor: (order: PurchaseOrder) => (
    <div className="flex gap-2">
      {order.status === 'Pending' && (
        <>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => updateStatus(order.itemId, 'Received')}
          >
            Received
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => updateStatus(order.itemId, 'Cancelled')}
          >
            Cancel
          </Button>
        </>
      )}
      {order.status !== 'Pending' && <span className="text-gray-400 text-xs">No actions</span>}
    </div>
  )
}

  ];

  if (isLoading && orders.length === 0) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card
      title="Purchase Orders"
      className="mt-6"
      footer={
        <Button onClick={openAddModal} >
          Create New Purchase Order
        </Button>
      }
    >
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Input
          placeholder="Search by item or supplier"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-xs"
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Delivered', value: 'Delivered' },
            { label: 'Cancelled', value: 'Cancelled' }
          ]}
        />
      </div>

      {inventoryItems.length === 0 && !isLoading && (
        <Alert type="info" message="No inventory items available to order. Add items to inventory first." />
      )}

      <Table<PurchaseOrder>
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        emptyMessage="No purchase orders found."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Purchase Order">
        <PurchaseOrderForm inventoryItems={inventoryItems} onSuccess={handleFormSuccess} />
      </Modal>
    </Card>
  );
};

export default PurchaseOrderList;
