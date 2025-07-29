// src/components/UsedPartsForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Input from './common/Input';
import Button from './common/Button';
import Alert from './common/Alert';

interface UsedPart {
  partName: string;
  partId: string;
  quantity: number;
  workOrderId?: string;
  notes?: string;
}

const UsedPartsForm: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
   
      await axios.post('http://localhost:5000/api/used-parts', form);
      setSuccess('Part registered successfully!');
      setForm({
        partName: '',
        partId: '',
        quantity: 1,
        workOrderId: '',
        notes: '',
      });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error registering part.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto bg-white p-10 rounded-xl shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Register Used Part</h2>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} />}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          id="partName"
          name="partName"
          label="Part Name"
          required
          value={form.partName}
          onChange={handleChange}
        />
        <Input
          id="partId"
          name="partId"
          label="Part ID"
          required
          value={form.partId}
          onChange={handleChange}
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
        />
        <Input
          id="workOrderId"
          name="workOrderId"
          label="Work Order ID"
          value={form.workOrderId}
          onChange={handleChange}
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
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UsedPartsForm;
