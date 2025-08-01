import React, { useState, ChangeEvent, useEffect } from 'react';
import Button from './common/Button';
import Input, { Select } from './common/Input';
import Alert from './common/Alert';
import { useApi } from '@/hooks/useApi';
import { InventoryItem } from '../types'; // ensure path correct

interface UsedPart {
  partName: string;
  partId: string;
  quantity: number;
  workOrderId?: string;
  notes?: string;
}

interface UsedPartsFormProps {
  inventoryItems: InventoryItem[];
  onSuccess?: () => void;
}

const UsedPartsForm: React.FC<UsedPartsFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<UsedPart>({
    partName: '',
    partId: '',
    quantity: 1,
    workOrderId: '',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const api = useApi();

  // Find selected item from inventory list when partId updates:
const selectedItem = form.partId
  ? inventoryItems.find(item => item._id === form.partId)
  : undefined;
  useEffect(() => {
  const fetchInventory = async () => {
   console.log(inventoryItems)
    try {
      const items = await api.getInventoryItems(); // assuming it returns a Promise
      setInventoryItems(items);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    }
  };

  fetchInventory();
    if (selectedItem) {
      setForm(prev => ({
        ...prev,
        partName: selectedItem.name,
        partId: selectedItem._id,
      }));
    } else {
      setForm(prev => ({ ...prev, partName: '', partId: '' }));
    }
  }, [form.partId, selectedItem]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.partId || !form.partName) {
      setError('Please select a valid part from the list.');
      return;
    }

    if (isNaN(form.quantity) || form.quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('https://myapp-ph0r.onrender.com/api/used-parts', form);

      setSuccess('Part registered successfully!');
      setForm({
        partName: '',
        partId: '',
        quantity: 1,
        workOrderId: '',
        notes: '',
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error registering part.');
    } finally {
      setIsLoading(false);
    }
  };
  const itemOptions = inventoryItems.map((item:any) => ({
    label: `${item.name} (${item._id})`,
    value: item._id,
  }));
  return (
    <div className="max-w-lg w-full mx-auto bg-white p-10 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Register Used Part</h2>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} />}

      <form className="space-y-6" onSubmit={handleSubmit}>
  
  <Select
        label="Select Part"
        id="itemId"
        value={form.partId}
          onChange={(e) => setForm(prev => ({ ...prev, partId: e.target.value }))}
        options={itemOptions}
        placeholder="Select an item"
        required
        disabled={isLoading}
      />
        <Input
          id="partName"
          name="partName"
          label="Part Name"
          value={form.partName}
          readOnly
        />

        <Input
          id="quantity"
          name="quantity"
          label="Quantity"
          type="number"
          min={1}
          required
          value={form.quantity}
          onChange={handleChange}
          disabled={isLoading}
        />

        <Input
          id="workOrderId"
          name="workOrderId"
          label="Work Order ID"
          value={form.workOrderId}
          onChange={handleChange}
          disabled={isLoading}
        />

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add any relevant notes..."
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UsedPartsForm;
