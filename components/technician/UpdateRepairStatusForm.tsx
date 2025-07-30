import React, { useState } from 'react';
import { RepairTicket, RepairStatus } from '../../types';
import Button from '../common/Button';
import { Select, Textarea } from '../common/Input';
import Alert from '../common/Alert';
import { useApi  } from '@/hooks/useApi';
interface UpdateRepairStatusFormProps {
  ticket: RepairTicket;
  onSuccess: () => void;
}
const API_URL =  'https://myapp-ph0r.onrender.com/api/repairs';

const api = useApi();

const UpdateRepairStatusForm: React.FC<UpdateRepairStatusFormProps> = ({ ticket, onSuccess }) => {
  const [newStatus, setNewStatus] = useState<RepairStatus>(ticket.status);
  const [notes, setNotes] = useState(ticket.notes || '');
  const [cost, setCost] = useState<number | undefined>(ticket.cost);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableStatuses = [
    RepairStatus.IN_PROGRESS,
    RepairStatus.WAITING_FOR_PARTS,
    RepairStatus.COMPLETED,
    RepairStatus.CANCELLED,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updates: Partial<RepairTicket> = { status: newStatus, notes };

      if (newStatus === RepairStatus.COMPLETED) {
        if (cost === undefined || cost <= 0) {
          setError("Please enter a valid cost for completed repairs.");
          setIsLoading(false);
          return;
        }
        updates.cost = cost;
        updates.completionDate = new Date().toISOString();
      } else {
        updates.cost = undefined;
        updates.completionDate = undefined;
      }
console.log("meeshaan fiiri: "+ticket.id)

await api.updateRepairTicket( ticket.id,updates);

//       console.log(ticket.id)
// await axios.put(`${API_URL}/${ticket._id}`, updates, {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//   },
// });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <p>Updating status for ticket: <span className="font-semibold">{ticket.id}</span></p>
      <p>Device: <span className="font-semibold">{ticket.deviceInfo}</span></p>

      <Select
        label="New Status"
        id="newStatus"
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value as RepairStatus)}
        options={availableStatuses.map(s => ({ value: s, label: s }))}
        required
        disabled={isLoading}
      />

      <Textarea
        label="Notes (Optional)"
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add any relevant notes for the customer or internal records."
        rows={3}
        disabled={isLoading}
      />

      {newStatus === RepairStatus.COMPLETED && (
        <div className="mt-4">
          <label htmlFor="cost" className="block text-sm font-medium text-neutral-dark mb-1">Repair Cost ($)</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={cost ?? ''}
            onChange={(e) => setCost(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Enter final cost"
            required
            min="0.01"
            step="0.01"
            disabled={isLoading}
          />
        </div>
      )}

      <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full">
        Update Status
      </Button>
    </form>
  );
};

export default UpdateRepairStatusForm;
