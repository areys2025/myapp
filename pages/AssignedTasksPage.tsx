
import React from 'react';
import AssignedTasksList from '../components/technician/AssignedTasksList';

const AssignedTasksPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-dark mb-6">My Assigned Repair Tasks</h1>
      <AssignedTasksList />
    </div>
  );
};

export default AssignedTasksPage;
