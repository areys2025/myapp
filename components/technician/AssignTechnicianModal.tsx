
import React, {useMemo,useCallback ,useEffect, useState, ChangeEvent } from 'react';
import { RepairTicket, Technician, RepairStatus } from '../../types';
import { useApi } from '../../hooks/useApi';
import Button from '../common/Button';
import { Select } from '../common/Input';
import Alert from '../common/Alert';
import Modal from '../common/Modal';
import { useAuth } from '../../contexts/AuthContext';

interface AssignTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: RepairTicket;
  technicians: Technician[];
  onSuccess: () => void;
}

const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({ isOpen, onClose, ticket, onSuccess }) => {
  const { user } = useAuth();

  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>(
  ticket?.assignedTechnicianId ?? ''
);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechnicianId) {
      setError('Please select a technician.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const LoginfoEml=user?.email;
const LoginfoRle=user?.role;

      // If assigning a tech, also update status to In Progress if it was Requested
      const updates: Partial<any> = { 
        assignedTechnicianId: selectedTechnicianId,
        status: ticket.status === RepairStatus.REQUESTED ? RepairStatus.IN_PROGRESS : ticket.status,
      LoginfoEml,
      LoginfoRle
      };

      
const ticketId = ticket.id || ticket._id;
await api.updateRepairTicket(ticketId, updates);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign technician.');
    } finally {
      setIsLoading(false);
    }
  };



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
  const availableTechnicians = technicians.filter(tech=>tech.availability)

  useEffect(() => {
    fetchTechnicians();
  }, []);

const allTechnicians = [...availableTechnicians];

if (
  ticket.assignedTechnicianId &&
  !availableTechnicians.find(t => t.id === ticket.assignedTechnicianId)
) {
  const assignedTech = technicians.find(t => t.id === ticket.assignedTechnicianId);
  if (assignedTech) allTechnicians.push(assignedTech);
}

  // const availableTechnicians = technicians.filter(tech => tech.availability);

const technicianOptions = useMemo(() => {
  return allTechnicians.map(tech => ({
    value: tech.id,
    label: `${tech.name} (${tech.specialization})`
  }));
}, [allTechnicians]);



  if (!isOpen) return null;
  return (

    <Modal isOpen={isOpen} onClose={onClose} title={`Assign Technician for Ticket ${ticket.TicketId}`}>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        <p>Assigning technician for device: <span className="font-semibold">{ticket.deviceInfo}</span></p>
        <p>Issue: <span className="italic">{ticket.issueDescription}</span></p>

        <Select
          label="Select Technician"
          id="technicianId"
          value={selectedTechnicianId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedTechnicianId(e.target.value)}
          options={technicianOptions}
          placeholder="Choose a technician..."
          required
          disabled={isLoading || availableTechnicians.length === 0}
        />
        {availableTechnicians.length === 0 && <p className="text-sm text-red-500">No available technicians found.</p>}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading || !selectedTechnicianId || availableTechnicians.length === 0}>
            Assign Technician
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignTechnicianModal;