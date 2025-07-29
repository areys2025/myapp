import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import ReportChart from '../components/reports/ReportChart';
import { ChartDataItem, DashboardStats, RepairTicket, Feedback } from '../types';
import {
  ArchiveBoxIcon,
  ChartBarIcon,
  CreditCardIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,ManagerIcon, SuppliersIcon, SystemLogsIcon 
} from '../constants';
import { useApi } from '../hooks/useApi';
import { RepairStatus } from '../types';
import axios from 'axios';

const ManagementPortalPage: React.FC = () => {
  const token = localStorage.getItem('token');
  const { user } = useAuth();
  const api = useApi();
  const { getDashboardData } = useApi();

  const instance = axios.create({
    baseURL: 'http://localhost:5000/api/auth',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [repairStats, setRepairStats] = useState<ChartDataItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  // const [inventoryValue, setInventoryValue] = useState(0);

  // const [invoices, setInvoices] = useState<RepairTicket[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  const formatDate = (isoString: any) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get dashboard overview data
        const data = await getDashboardData();
        setDashboardData(data);

        const repairResponse: RepairTicket[] = await api.getRepairs();
        if (!Array.isArray(repairResponse)) throw new Error('Expected array of repair tickets');

        const allRepairs: RepairTicket[] = repairResponse;

        // setInvoices(allRepairs.filter(t => t.cost && t.cost > 0));

        const feedbackRes: Feedback[] = await api.getAllFeedBacks();
        if (!Array.isArray(repairResponse)) throw new Error('Expected array of feedbacks');

        setFeedbackList(feedbackRes);

        const statusCounts = allRepairs.reduce((acc: Record<string, number>, repair) => {
          acc[repair.status] = (acc[repair.status] || 0) + 1;
          return acc;
        }, {});
        setRepairStats(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

        setTotalRevenue(allRepairs
          .filter(t => [RepairStatus.PAID, RepairStatus.COMPLETED].includes(t.status))
          .reduce((sum, t) => sum + (t.cost || 0), 0));

        // Get inventory
        const inventory = await api.getInventoryItems();
        // setInventoryValue(inventory.reduce((sum, item) => sum + item.quantity * item.price, 0));
        setLowStockItems(inventory.filter(item => item.quantity < item.minStockLevel).length);

        // Get users
        const userRes = await instance.get('/users');
        if (!Array.isArray(userRes.data)) throw new Error('Expected array of users');
        setCustomers(userRes.data.filter((u: any) => u.role === 'Customer'));

        // Get techs
        const techRes = await instance.get('/technicians');
        if (!Array.isArray(techRes.data)) throw new Error('Expected array of technicians');
        setTechnicians(techRes.data);

        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err.message || err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getDashboardData]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const summaryCards = [
    { title: "Total Repairs", value: dashboardData?.stats.totalRepairs || 0, color: "bg-blue-500", link: "/manage-repairs" },
    { title: "Active Repairs", value: dashboardData?.stats.activeRepairs || 0, color: "bg-yellow-500", link: "/manage-repairs" },
    { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "bg-green-500", link: "/financials" },
    { title: "Total Customers", value: customers.length, color: "bg-purple-500", link: "/customers" },
    { title: "Total Technicians", value: technicians.length, color: "bg-indigo-500", link: "/technicians" },
    // { title: "Pending Tasks", value: invoices.filter(t => [RepairStatus.REQUESTED, RepairStatus.IN_PROGRESS].includes(t.status)).length, color: "bg-yellow-500", link: "/manage-repairs" },
    { title: "Low Stock Items", value: lowStockItems, color: lowStockItems > 0 ? "bg-red-500" : "bg-gray-500", link: "/inventory" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-dark">Management Dashboard</h1>
      <p className="text-neutral-DEFAULT">Overview of operations, {user?.name}.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.map(card => (
          <Link to={card.link} key={card.title}>
            <Card className={`${card.color} text-white hover:opacity-90 transition-opacity`}>
              <h4 className="text-md font-semibold">{card.title}</h4>
              <p className="text-3xl font-bold">{card.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportChart data={repairStats} title="Repair Status Overview" chartType="pie" />
        <Card title="Recent Repairs">
          <div className="space-y-2">
            {dashboardData?.recentRepairs?.map(repair => (
              <div key={repair._id} className="p-2 bg-gray-50 rounded">
                <div className="font-semibold">{repair.customerName}</div>
                <div className="text-sm text-gray-600">{repair.deviceInfo}</div>
                <div className="text-xs text-gray-500">
                  Status: {repair.status} | Date: {new Date(repair.requestDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* <ReportChart data={repairStats} title="Repair Status Overview" chartType="pie" /> */}

        <Card title="Customer Feedback">
          {feedbackList.length === 0 ? (
            <p className="text-gray-400 italic text-sm text-center py-4">No feedback yet.</p>
          ) : (
            <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {feedbackList.map((fb) => (
                <div
                  key={fb._id}
                  className="p-5 rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {fb.customerName || "Anonymous"}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(fb.date)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                      <span className="text-lg">⭐</span>
                      <span>{fb.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {fb.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>


        <Card title="Quick Links">
          <div className="grid grid-cols-2 gap-4">
            <Link to="/manage-repairs" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <WrenchScrewdriverIcon className="w-6 h-6 mx-auto mb-1" />Manage Repairs
            </Link>
            <Link to="/inventory" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <ArchiveBoxIcon className="w-6 h-6 mx-auto mb-1" />Inventory
            </Link>
            <Link to="/technicians" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <UserGroupIcon className="w-6 h-6 mx-auto mb-1" />Technicians
            </Link>
            <Link to="/financials" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <CreditCardIcon className="w-6 h-6 mx-auto mb-1" />Financials
            </Link>

            <Link to="/Manage-admins" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <ManagerIcon className="w-6 h-6 mx-auto mb-1" />Manage admins
            </Link>
            <Link to="/suppliers" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <SuppliersIcon className="w-6 h-6 mx-auto mb-1" />Manage suppliers
            </Link>
            <Link to="/views-Logs" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <SystemLogsIcon className="w-6 h-6 mx-auto mb-1" />View Logs
            </Link>
            <Link to="/reports" className="block p-3 bg-primary-light hover:bg-primary rounded text-primary-dark hover:text-white text-center font-semibold">
              <ChartBarIcon className="w-6 h-6 mx-auto mb-1" />View All Reports
            </Link>

          </div>
        </Card>

      </div>

    </div>
  );
};

export default ManagementPortalPage;
