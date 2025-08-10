
import React, { useEffect, useState } from 'react';
import { RepairTicket, RepairStatus } from '../../types';
import Table from '../common/Table';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Button from '../common/Button';
import InvoiceViewModal from './InvoiceViewModal'; // To be created

import { useApi } from '@/hooks/useApi'; 

const InvoiceList: React.FC = () => {
const api=useApi();
  const [invoices, setInvoices] = useState<RepairTicket[]>([]); // Using RepairTicket as invoice data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<RepairTicket | null>(null);

const [searchText, setSearchText] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [dateFilter, setDateFilter] = useState('');


const filteredInvoices = invoices.filter(inv => {
  const matchesSearch = inv.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
  inv.deviceInfo?.toLowerCase().includes(searchText.toLowerCase());

  const matchesStatus = statusFilter
    ? inv.status === statusFilter
    : true;

  const matchesDate = dateFilter
    ? new Date(inv.completionDate || '').toISOString().split('T')[0] === dateFilter
    : true;

  return matchesSearch && matchesStatus && matchesDate;
});


const fetchInvoices= async (): Promise<RepairTicket[]> => {
try{
    setIsLoading(true);
  setError(null);
    const invoices = await api.getRepairs();
    if (!Array.isArray(invoices)) {
      throw new Error('Expected an array of repair tickets');
    }
setInvoices(invoices.filter(t => t.cost && t.cost > 0))
    return invoices;
}  

   catch (err) {
    console.error('Error fetching repairs:', err);
    setError('Failed to fetch repair history.');

    return []; 
  } finally {
    setIsLoading(false);
  }
  
}

      



  useEffect(() => {

    fetchInvoices();

  }, []);

  const totalBilledAmount = invoices.reduce((sum, inv) => sum + (inv.cost || 0), 0);
  const totalPaidAmount = invoices.filter(inv => inv.status === RepairStatus.PAID).reduce((sum, inv) => sum + (inv.cost || 0), 0);
  const outstandingAmount = totalBilledAmount - totalPaidAmount;

  const columns = [
    { header: 'Ticket ID', accessor: 'TicketId' as keyof RepairTicket, className: 'font-mono text-xs' },
    { header: 'Customer', accessor: 'customerName' as keyof RepairTicket },
    { header: 'Device', accessor: 'deviceInfo' as keyof RepairTicket },
    { header: 'Completion Date', accessor: (inv: RepairTicket) => inv.completionDate ? new Date(inv.completionDate).toLocaleDateString() : 'N/A' },
    { header: 'Amount', accessor: (inv: RepairTicket) => `$${(inv.cost || 0).toFixed(2)}`, cellClassName: 'text-right font-semibold' },
    { header: 'Status', accessor: (inv: RepairTicket) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            inv.status === RepairStatus.PAID ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800' // Completed but not paid
        }`}>
            {inv.status === RepairStatus.PAID ? 'Paid' : 'Awaiting Payment'}
        </span>
    )},
    { header: 'Actions', accessor: (inv: RepairTicket) => (
      <Button size="sm" variant="ghost" onClick={() => setSelectedInvoice(inv)}>
        View Invoice
      </Button>
    )},
  ];

  if (isLoading && invoices.length === 0) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card 
      title="Invoices & Billing" 
      className="mt-6"
      footer={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div><p className="text-sm text-neutral-DEFAULT">Total Billed:</p><p className="text-lg font-semibold text-neutral-dark">${totalBilledAmount.toFixed(2)}</p></div>
            <div><p className="text-sm text-neutral-DEFAULT">Total Paid:</p><p className="text-lg font-semibold text-green-600">${totalPaidAmount.toFixed(2)}</p></div>
            <div><p className="text-sm text-neutral-DEFAULT">Outstanding:</p><p className="text-lg font-semibold text-red-600">${outstandingAmount.toFixed(2)}</p></div>
        </div>
      }
    >
      <div className="flex flex-wrap gap-4 mb-4">
  <input
    type="text"
    placeholder="Search by customer/device"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="border px-3 py-1 rounded shadow-sm"
  />
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border px-3 py-1 rounded shadow-sm"
  >
    <option value="">All Statuses</option>
    <option value={RepairStatus.PAID}>Paid</option>
    <option value={RepairStatus.COMPLETED}>Awaiting Payment</option>
  </select>
  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="border px-3 py-1 rounded shadow-sm"
  />
</div>

      <Table<RepairTicket>
        columns={columns}
        data={filteredInvoices}
        isLoading={isLoading}
        emptyMessage="No invoices found."
      />
      {selectedInvoice && (
        <InvoiceViewModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </Card>
  );
};

export default InvoiceList;
