import React, { useState, useEffect, ChangeEvent } from 'react';
import { PurchaseOrder, InventoryItem } from '../../types';
import Button from '../common/Button';
import Input, { Select } from '../common/Input';
import Alert from '../common/Alert';
import { useApi } from '../../hooks/useApi';

interface PurchaseOrderFormProps {
  inventoryItems: InventoryItem[];
  onSuccess: () => void;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ inventoryItems, onSuccess }) => {
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState<number | string>(1);
  const [supplier, setSupplier] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const selectedItem = inventoryItems.find(item => item._id === itemId);
  console.log(selectedItem)
useEffect(() => {
  if (selectedItem) {  
    setSupplier(selectedItem.supplier || '');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setExpectedDeliveryDate(nextWeek.toISOString().split('T')[0]); // format YYYY-MM-DD
  } else {
    setSupplier('');
    setExpectedDeliveryDate('');
  }
}, [selectedItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedItem) {
      setError('Please select an item to order.');
      return;
    }
    const numQuantity = parseInt(String(quantity), 10);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }
    if (!expectedDeliveryDate) {
      setError('Please select an expected delivery date.');
      return;
    }
    if (!supplier.trim()) {
      setError('Supplier name is required.');
      return;
    }
    setIsLoading(true);
    try {
      const orderData: Omit<any, 'id'> = {
        itemId,
        itemName: selectedItem.name,
        purchInvId:itemId,
        quantity: numQuantity,

        orderDate: new Date().toISOString(),
        expectedDeliveryDate,
        status: 'Pending',
        supplier,
        totalCost: numQuantity * selectedItem.price,
      };
      await api.createPurchaseOrder(orderData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create purchase order.');
    } finally {
      setIsLoading(false);
    }
  };

const itemOptions = inventoryItems.map(item => ({
  value: item._id,
  label: `${item.name} (Price: $${item.price.toFixed(2)})`,
}));



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <Select
        label="Item to Order"
        id="itemId"
        value={itemId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setItemId(e.target.value)}
        options={itemOptions}
        placeholder="Select an item"
        required
        disabled={isLoading}
      />

      {selectedItem && <p className="text-sm text-neutral-DEFAULT">Selected item price: ${selectedItem.price.toFixed(2)} per unit.</p>}

      <Input
        label="Quantity"
        id="quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        min="1"
        disabled={isLoading || !selectedItem}
      />

      <Input
        label="Supplier"
        id="supplier"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        required
        disabled={isLoading || !selectedItem}
        placeholder={selectedItem?.supplier ? `Default: ${selectedItem.supplier}` : "Enter supplier name"}
      />

      <Input
        label="Expected Delivery Date"
        id="expectedDeliveryDate"
        type="date"
        value={expectedDeliveryDate}
        onChange={(e) => setExpectedDeliveryDate(e.target.value)}
        required
        disabled={isLoading || !selectedItem}
        min={new Date().toISOString().split('T')[0]}
      />

  {selectedItem && (
  <>
    <div className="text-sm">Item Name: <span className="font-medium">{selectedItem.name}</span></div>
    <div className="text-sm">Supplier: <span className="font-medium">{selectedItem.supplier}</span></div>
  </>
)}


      <Button type="submit" isLoading={isLoading} disabled={isLoading || !selectedItem}  className="w-full">
        Create Purchase Order
      </Button>
    </form>
  );
};

export default PurchaseOrderForm;
