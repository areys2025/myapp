import React from 'react';
import { RepairTicket, Customer } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { APP_NAME } from '../../constants';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: RepairTicket;
}

const token = localStorage.getItem('token');
const instance = axios.create({
    baseURL: 'https://myapp-ph0r.onrender.com/api',
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({ isOpen, onClose, invoice }) => {
  const [customer, setCustomer] = React.useState<Customer | null>(null);

  React.useEffect(() => {
    if (isOpen && invoice.customerId) {
      instance.get<Customer>(`/users/${invoice.customerId}`).then(cust => {
        if (cust) setCustomer(cust.data);
      });
    }
  }, [isOpen, invoice.customerId]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-content');
    if (element) {
      const opt = {
        margin: 0.3,
        filename: `invoice_${invoice.TicketId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1.2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

const handleEmailInvoice = async () => {
  try {
await instance.post(`/invoices/send`, {
  billedTo: {
    name: invoice.customerName,
    email: customer?.email,
    contact: customer?.contactNumber,
  },
  invoiceInfo: {
    id: invoice.TicketId,
    date: invoice.completionDate,
    status: invoice.status,
  },
repairDetails: [
    { description: `Repair for: ${invoice.deviceInfo}`, amount: invoice.cost }
  ],  totalDue: invoice.cost,
});
    alert('Invoice sent to customer!');
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Failed to send invoice.');
  }
};


  const handlePrint = () => {
    const printableContent = document.getElementById('invoice-content');
    if (printableContent) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write('<html><head><title>Print Invoice</title>');
      printWindow?.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } }</style>');
      printWindow?.document.write('</head><body>');
      printWindow?.document.write(printableContent.innerHTML);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.focus();
      setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
      }, 500);
    }
  };

  if (!invoice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invoice #${invoice.TicketId}`} size="lg">
      <div id="invoice-content" className="bg-white p-4 md:p-6 rounded shadow text-gray-800 max-w-3xl mx-auto space-y-4 print:p-0 print:shadow-none print:max-w-full text-sm">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-primary">{APP_NAME}</h2>
          <p className="text-neutral-600">Repair Invoice</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-1">Billed To:</h3>
            <p><strong>Name:</strong> {invoice.customerName || 'N/A'}</p>
            <p><strong>Email:</strong> {customer?.email || 'N/A'}</p>
            <p><strong>Contact:</strong> {customer?.contactNumber || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Invoice Info:</h3>
            <p><strong>Invoice ID:</strong> #{invoice.id}</p>
            <p><strong>Date:</strong> {invoice.completionDate ? new Date(invoice.completionDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong>{' '}
              <span className={invoice.status === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Repair Details</h3>
          <table className="w-full border border-neutral-300">
            <thead className="bg-neutral-100">
              <tr>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">Repair for: {invoice.deviceInfo}</td>
                <td className="p-2 text-right">${(invoice.cost || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-right border-t pt-2">
          <p>Subtotal: ${(invoice.cost || 0).toFixed(2)}</p>
          <p>Tax: $0.00</p>
          <p className="text-base font-semibold">Total Due: ${(invoice.cost || 0).toFixed(2)}</p>
        </div>

        {invoice.notes && (
          <div className="border-t pt-2">
            <h4 className="font-semibold mb-1">Notes:</h4>
            <p>{invoice.notes}</p>
          </div>
        )}

        <p className="text-center text-xs text-neutral-500 mt-2">Thank you for choosing {APP_NAME}!</p>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2 no-print text-sm">
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button variant="outline" onClick={handleEmailInvoice}>Email</Button>
        <Button variant="outline" onClick={handleDownloadPDF}>Download PDF</Button>
        <Button onClick={handlePrint}>Print</Button>
      </div>
    </Modal>
  );
};

export default InvoiceViewModal;
