import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { RepairTicket } from '../types';

const RepairHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const api = useApi();
  const [repairs, setRepairs] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const res: any = await api.getRepairs();
        if (user?.id) {
          const matchingTickets: RepairTicket[] = res
            .filter((ticket: any) => ticket.assignedTechnicianId === user.id)
            .sort(
              (a: RepairTicket, b: RepairTicket) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          setRepairs(matchingTickets);
        }
      } catch (err) {
        console.error('Error fetching repairs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, [user?.id]);

  if (loading) {
    return <p className="text-center mt-8">Loading repair history...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-dark mb-6">
        Repair History
      </h1>

      {repairs.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-neutral-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-neutral-700">
              <thead className="bg-neutral-100 text-neutral-900 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair, idx) => (
                  <tr
                    key={repair.TicketId}
                    className={`hover:bg-neutral-50 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-primary-dark">
                      {repair.TicketId}
                    </td>
                    <td className="px-4 py-3">{repair.deviceInfo}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          repair.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : repair.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {new Date(repair.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-neutral-600">No repair history found.</p>
      )}
    </div>
  );
};

export default RepairHistoryPage;
