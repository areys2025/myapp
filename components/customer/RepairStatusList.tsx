import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { RepairTicket, RepairStatus } from '../../types';
import Table from '../common/Table';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import FeedbackForm from './FeedbackForm';
import BlockchainPaymentModal from '../financial/BlockchainPaymentModal';
import { useApi } from '@/hooks/useApi';

const RepairStatusList: React.FC = () => {
  const api = useApi();
  const { user } = useAuth();

  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicketForFeedback, setSelectedTicketForFeedback] = useState<RepairTicket | null>(null);
  const [selectedTicketForPayment, setSelectedTicketForPayment] = useState<RepairTicket | null>(null);

  const getRepairs = async () => {
    try {
      const res = await api.getRepairs();

      if (!Array.isArray(res)) {
        throw new Error('Expected an array of repair tickets');
      }

      if (user?.id) {
        const matchingTickets = res.filter(ticket => ticket?.customerId === user.id);
        setRepairs(matchingTickets.filter(Boolean)); // filter out any undefined
      }
    } catch (err) {
      console.error('Error fetching repairs:', err);
      setError('Failed to fetch repair history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRepairs();
  }, []);

  const handleFeedbackSuccess = () => {
    setSelectedTicketForFeedback(null);
    getRepairs();
  };

  const handlePaymentSuccess = () => {
    setSelectedTicketForPayment(null);
    getRepairs();
  };

  const columns = [
    { header: 'Ticket ID', accessor: 'TicketId' as keyof RepairTicket, className: 'font-mono text-xs' },
    { header: 'Device Info', accessor: 'deviceInfo' as keyof RepairTicket },
    {
      header: 'Status',
      accessor: (ticket: RepairTicket) => (
        <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
          ticket.status === RepairStatus.COMPLETED ? 'bg-green-100 text-green-800' :
          ticket.status === RepairStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-800' :
          ticket.status === RepairStatus.REQUESTED ? 'bg-blue-100 text-blue-800' :
          ticket.status === RepairStatus.PAID ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {ticket.status}
        </span>
      ),
    },
    {
      header: 'Requested',
      accessor: (ticket: RepairTicket) =>
        ticket?.requestDate ? new Date(ticket.requestDate).toLocaleDateString() : 'N/A',
    },
    {
      header: 'Cost',
      accessor: (ticket: RepairTicket) =>
        ticket?.cost ? `$${ticket.cost.toFixed(2)}` : '$0.00',
    },
    {
      header: 'Actions',
      accessor: (ticket: RepairTicket) => (
        <div className="space-x-2">
          {ticket.status === RepairStatus.COMPLETED && !ticket.feedback && (
            <Button size="sm" variant="ghost" onClick={() => setSelectedTicketForFeedback(ticket)}>
              Leave Feedback
            </Button>
          )}
          {ticket.status === RepairStatus.COMPLETED && ticket.cost && (
            <Button size="sm" variant="secondary" onClick={() => setSelectedTicketForPayment(ticket)}>
              Pay Now
            </Button>
          )}
          {ticket.feedback && (
            <span className="text-xs text-green-600 italic">Feedback Submitted</span>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card title="My Repair Requests" className="mt-6">
      <Table<RepairTicket>
        columns={columns}
        data={repairs}
        isLoading={isLoading}
        emptyMessage="You have no repair requests matching this status."
      />

      {selectedTicketForFeedback && (
        <Modal
          isOpen={!!selectedTicketForFeedback}
          onClose={() => setSelectedTicketForFeedback(null)}
          title={`Feedback for ${selectedTicketForFeedback.deviceInfo ?? 'Unknown Device'}`}
        >
          <FeedbackForm
            ticketId={selectedTicketForFeedback.TicketId}
            assignedTechnicianId={selectedTicketForFeedback.assignedTechnicianId ?? ''}
            onSuccess={handleFeedbackSuccess}
          />
        </Modal>
      )}

      {selectedTicketForPayment && selectedTicketForPayment.cost && (
        <BlockchainPaymentModal
          isOpen={!!selectedTicketForPayment}
          onClose={() => setSelectedTicketForPayment(null)}
          ticket={selectedTicketForPayment}
          amount={selectedTicketForPayment.cost}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </Card>
  );
};

export default RepairStatusList;
