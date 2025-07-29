
import React from 'react';
import RepairStatusList from '../components/customer/custmRepairStatusList';

const MyRepairsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-dark mb-6">My Repairs</h1>
      <RepairStatusList />
    </div>
  );
};

export default MyRepairsPage;
