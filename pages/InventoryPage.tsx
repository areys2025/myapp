import React, { useState } from 'react';
import InventoryList from '../components/inventory/InventoryList';
import PurchaseOrderList from '../components/inventory/PurchaseOrderList';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';


const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'parts' | 'orders'>('parts');

  const isTechnician = user?.role === UserRole.TECHNICIAN;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-dark">Inventory & Procurement</h1>

        {/* Hide buttons for technicians */}
        {!isTechnician && (
          <div className="space-x-2">
            <Button
              variant={activeTab === 'parts' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('parts')}
            >
              Manage Parts
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('orders')}
            >
              Purchase Orders
            </Button>
          </div>
        )}
      </div>

      {/* Show tab content regardless of buttons */}
      {activeTab === 'parts' && <InventoryList />}
      {activeTab === 'orders' && <PurchaseOrderList />}
    </div>
  );
};

export default InventoryPage;
