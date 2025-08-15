import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import RepairStatusList from '../components/customer/custmRepairStatusList';
import { WrenchScrewdriverIcon, HomeIcon } from '../constants';
import { useApi } from '@/hooks/useApi';
import {RepairTicket} from '../types';
interface Repair {
  TicketId: string;
  status: string;
  updatedAt: string;
  deviceInfo: string;
}

const CustomerPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [recentRepairs, setRecentRepairs] = useState<Repair[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

const api=useApi();
  useEffect(() => {
    const fetchRecentRepairs = async () => {
      try {
    const res:any = await api.getRepairs();
        if (user?.id) {
      const matchingTickets:[RepairTicket] = res.filter((ticket:any) => ticket.customerId === user.id);
      setRecentRepairs(matchingTickets);
    }
console.log(recentRepairs)

      } catch (err) {
        console.error('Error fetching recent repairs:', err);
      }
    };

    fetchRecentRepairs();
  }, []);
  const latestRepairs = recentRepairs.slice(0, 3);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-dark">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Quick Actions" className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="space-y-3">
            <Link to="/request-repair">
              <Button className="w-full bg-transparent border border-white text-white hover:bg-primary-light hover:text-primary-dark focus:ring-white">
                <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                Submit New Repair Request
              </Button>
            </Link>
            <Link to="/my-repairs">
              <Button className="w-full bg-transparent border border-white text-white hover:bg-primary-light hover:text-primary-dark focus:ring-white">
                <HomeIcon className="w-5 h-5 mr-2" />
                View All My Repairs
              </Button>
            </Link>
          </div>
        </Card>
    <Card title="Recent Activity">
{recentRepairs?.length > 0 ? (
  <ul className="mt-3 space-y-2 text-sm text-neutral-700">
    {recentRepairs.slice(-3).map((repair) => (
      <li
        key={repair.TicketId}
        className="p-3 rounded-lg bg-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <span className="font-semibold text-neutral-900">{repair.deviceInfo}</span>
          <span className="ml-1">— Status updated to</span>{' '}
          <span
            className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${
              repair.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : repair.status === 'In Progress'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {repair.status}
          </span>
        </div>
        <div className="mt-2 sm:mt-0 text-xs text-neutral-500">
          {new Date(repair.updatedAt).toLocaleDateString()}
        </div>
      </li>
    ))}
  </ul>
) : (
    <div className="mt-3 text-sm text-neutral-600">
      <p>Your recent repair updates will appear here.</p>
      <ul className="mt-2 space-y-1">
        <li className="p-2 rounded bg-neutral-100">Repair #XYZ789 status updated to <span className="font-medium">In Progress</span>.</li>
        <li className="p-2 rounded bg-neutral-100">New message from technician regarding your device.</li>
      </ul>
    </div>
  )}
</Card>
{/* Notification Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-full bg-primary text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
          aria-label="Toggle notifications"
        >
          {/* Icon - you can swap for a bell icon if you want */}
          <WrenchScrewdriverIcon className="w-6 h-6" />
          {recentRepairs.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {recentRepairs.length}
            </span>
          )}
        </button>

        {/* Notification popup */}
        {showNotifications && (
          <div className="mt-2 w-80 bg-white shadow-lg rounded-md border border-neutral-300 p-4">
            <h2 className="text-lg font-semibold mb-2">Recent Repairs</h2>
            {latestRepairs.length > 0 ? (
              latestRepairs.map((repair) => (
                <div
                  key={repair.TicketId}
                  className="mb-3 last:mb-0 border-b border-neutral-200 pb-2"
                >
                  <p className="font-semibold text-neutral-900">{repair.deviceInfo}</p>
                  <p className="text-sm text-neutral-700">
                    Status updated to{' '}
                    <span
                      className={`capitalize font-medium ${
                        repair.status === 'completed'
                          ? 'text-green-600'
                          : repair.status === 'In Progress'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {repair.status}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(repair.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-600">No recent notifications</p>
            )}
          </div>
        )}
      </div>

      </div>


      <RepairStatusList /> 
    </div>
  );
};

export default CustomerPortalPage;
