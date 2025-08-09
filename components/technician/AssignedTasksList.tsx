
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
// Fix: Import UserRole to resolve 'Cannot find name UserRole' error.
import { RepairTicket, RepairStatus, UserRole } from '../../types';
import Table from '../common/Table';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import UpdateRepairStatusForm from './UpdateRepairStatusForm'; // Create this next
import {useApi} from '../../hooks/useApi'
const AssignedTasksList: React.FC = () => {
  const { user } = useAuth();
const api = useApi();
const [tasks, setTasks] = useState<RepairTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<RepairTicket | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user || user.role !== UserRole.TECHNICIAN) return;
    setIsLoading(true);
    setError(null);
    try {

      // Fetch tasks assigned to this technician, excluding completed/cancelled ones
      const allTasks: any= await api.getRepairTicketsForTech({ assignedTechnicianId: user.id });
// const pairs=await axios.get<RepairTicket>("/api/repairs")
//            if (!Array.isArray(pairs.data)) {
//           throw new Error('Expected an array of invoice repair tickets');
//         }   
// const plp=allTasks.filter((t:any)=>t.assignedTechnicianId=use?.id)
const assignedTsk=allTasks.filter((tsk:any)=>(tsk.assignedTechnicianId==user?.id)).filter((t:any)=>t.status==RepairStatus.WAITING_FOR_PARTS||t.status==RepairStatus.IN_PROGRESS)
console.log(assignedTsk)
setTasks(assignedTsk);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assigned tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [user, api]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateSuccess = () => {
    setSelectedTask(null);
    fetchTasks(); // Refresh list
  };

  const columns = [
    { header: 'Ticket ID', accessor: 'TicketId' as keyof RepairTicket, className: 'font-mono text-xs' },
    { header: 'Customer', accessor: 'customerName' as keyof RepairTicket },
    { header: 'Device Info', accessor: 'deviceInfo' as keyof RepairTicket },
    { header: 'Issue', accessor: 'issueDescription' as keyof RepairTicket, cellClassName: 'max-w-xs truncate' },
    { header: 'Status', accessor: (task: RepairTicket) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            task.status === RepairStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
            task.status === RepairStatus.WAITING_FOR_PARTS ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800' // Requested
        }`}>
            {task.status}
        </span>
    )},
    { header: 'Requested', accessor: (task: RepairTicket) => new Date(task.requestDate).toLocaleDateString() },
    { header: 'Actions', accessor: (task: RepairTicket) => (
      <Button size="sm" onClick={() => setSelectedTask(task)}>
        Update Status
      </Button>
    )},
  ];

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card title="My Assigned Tasks" className="mt-6">
<Table<RepairTicket>
  columns={columns}
  data={tasks ?? []}
  isLoading={isLoading}
  emptyMessage="No active tasks assigned to you."
/>

      {selectedTask && (
        <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title={`Update Status for Ticket ${selectedTask.id}`}>
          <UpdateRepairStatusForm ticket={selectedTask} onSuccess={handleUpdateSuccess} />
        </Modal>
      )}
    </Card>
  );
};

export default AssignedTasksList;