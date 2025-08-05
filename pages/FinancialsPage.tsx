
import React, { useState } from 'react';
import ExpenseList from '../components/financial/ExpenseList'; // To be created
import InvoiceList from '../components/financial/InvoiceList'; // To be created (simplified)
import Button from '../components/common/Button';

const FinancialsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-dark">Financial Management</h1>
        <div className="space-x-2">
            <Button className="w-full sm:w-auto" variant={activeTab === 'invoices' ? 'primary' : 'ghost'} onClick={() => setActiveTab('invoices')} >
            Invoices & Billing
            </Button>
            <Button className="w-full sm:w-auto" variant={activeTab === 'expenses' ? 'primary' : 'ghost'} onClick={() => setActiveTab('expenses')}>
            Expense Tracking
            </Button>
        </div>
      </div>
      
      {activeTab === 'invoices' && <InvoiceList />}
      {activeTab === 'expenses' && <ExpenseList />}
    </div>
  );
};

export default FinancialsPage;
