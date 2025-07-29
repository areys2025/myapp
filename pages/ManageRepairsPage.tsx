
import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { RepairTicket, RepairStatus, Technician } from '../types';
import Table from '../components/common/Table';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import AssignTechnicianModal from '../components/technician/AssignTechnicianModal'; // To be created
import axios from 'axios';

const ManageRepairsPage: React.FC = () => {
  const api = useApi();
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);

const getTickets= async (): Promise<RepairTicket[]> => {
    const res = await axios.get('http://localhost:5000/api/repairs');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of expenses');
      }
      setRepairs(res.data);
      return res.data;
    }


const [technicianMap, setTechnicianMap] = useState<{ [id: string]: string }>({});

const fetchData = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const [repairsRes, fetchedTechnicians] = await Promise.all([
      api.getRepairTickets(),
      api.getTechnicians()
    ]);

    const techMap: { [id: string]: string } = {};
    fetchedTechnicians.forEach(t => {
      if (t.id) techMap[t.id] = t.name;
    });

    setRepairs(repairsRes);
    setTechnicians(fetchedTechnicians);
    setTechnicianMap(techMap);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch data.');
  } finally {
    setIsLoading(false);
  }
}, [api]);



getTickets()
  useEffect(() => {
    fetchData();
  }, []);
  const handleAssignSuccess = () => {
    setSelectedTicket(null);
    fetchData(); // Refresh list
  };
  const columns = [
    { header: 'Ticket ID', accessor: 'TicketId' as keyof RepairTicket, className: 'font-mono text-xs' },
    { header: 'Customer', accessor: 'customerName' as keyof RepairTicket },
    { header: 'Device Info', accessor: 'deviceInfo' as keyof RepairTicket },
    // Fix: Corrected 'Technician' column definition.
    // - 'accessor' function now correctly returns 'Unassigned' if no technicianName.
    // - Removed 'accessorValue' as it's not a valid prop for Column<T>.
    // - 'cellClassName' function is now compatible with the updated Table component.
{
  header: 'Technician',
  accessor: (ticket: RepairTicket) =>
    technicianMap[ticket.assignedTechnicianId || ''] || 'Unassigned',
  cellClassName: (ticket: RepairTicket) =>
    technicianMap[ticket.assignedTechnicianId || '']
      ? ''
      : 'italic text-gray-400',
},

    { header: 'Status', accessor: (ticket: RepairTicket) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            ticket.status === RepairStatus.COMPLETED ? 'bg-green-100 text-green-800' :
            ticket.status === RepairStatus.PAID ? 'bg-purple-100 text-purple-800' :
            ticket.status === RepairStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
            ticket.status === RepairStatus.REQUESTED ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
        }`}>
            {ticket.status}
        </span>
    )},
    { header: 'Cost', accessor: (ticket: RepairTicket) => ticket.cost ? `$${ticket.cost.toFixed(2)}` : 'N/A' },
    { header: 'Actions', accessor: (ticket: RepairTicket) => (
      <div className="space-x-1">
        {(ticket.status === RepairStatus.REQUESTED || !ticket.assignedTechnicianId) && (
          <Button size="sm" onClick={() => setSelectedTicket(ticket)}>
            Assign Tech
          </Button>
        )}
        
        {/* Add other actions like View Details, Edit, etc. */}
      </div>
    )},
  ];

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card title="All Repair Tickets" className="mt-6">
      <Table<RepairTicket>
        columns={columns}
        data={repairs}
        isLoading={isLoading}
        emptyMessage="No repair tickets found."
      />
      {selectedTicket && (
        <AssignTechnicianModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          ticket={selectedTicket}
          technicians={technicians}
          onSuccess={handleAssignSuccess}
        />
      )}
    </Card>
  );
};

export default ManageRepairsPage;