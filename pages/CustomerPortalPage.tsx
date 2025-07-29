
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import RepairStatusList from '../components/customer/custmRepairStatusList';
import { WrenchScrewdriverIcon, HomeIcon } from '../constants'; // Using .tsx implicitly
import { UserRole, Customer } from '../types';

const CustomerPortalPage: React.FC = () => {
  const { user } = useAuth();

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
        <Card title="Recent Activity (Placeholder)">
          <p className="text-neutral-DEFAULT">Your recent repair updates will appear here.</p>
          {/* Placeholder for actual recent activity items */}
          <ul className="mt-2 space-y-1 text-sm text-neutral-DEFAULT">
            <li>Repair #XYZ789 status updated to 'In Progress'.</li>
            <li>New message from technician regarding your device.</li>
          </ul>
        </Card>
        
        <Card title="Device Information (Placeholder)">
            <p className="text-neutral-DEFAULT">Your registered device: <span className="font-semibold">{
              user && user.role === UserRole.CUSTOMER ? (user as Customer).deviceType : 'Not specified'
            }</span></p>
            <Button size="sm" variant="ghost" className="mt-2">Manage Devices</Button>
        </Card>
      </div>
      <RepairStatusList /> 
    </div>
  );
};

export default CustomerPortalPage;
