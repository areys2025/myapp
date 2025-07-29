import React, { useMemo, useEffect, useState, } from 'react';
import ReportChart from '../components/reports/ReportChart';

import { ChartDataItem, Technician, RepairStatus, RepairTicket } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button'; // Added Button import
import { useApi } from '../hooks/useApi';
import LogTable from './LogTable'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';




const ReportsPage: React.FC = () => {
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  // At the top of component
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [technicianPerformanceData, setTechnicianPerformanceData] = useState<ChartDataItem[]>([]);
  const api = useApi();
  const [selectedTechId, setSelectedTechId] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, techsRes] = await Promise.all([
          api.getRepairs(),
          api.getTechnicians()
        ]);

        if (!Array.isArray(ticketsRes) || !Array.isArray(techsRes)) {
          throw new Error('Expected array data');
        }

        setTickets(ticketsRes);
        setTechnicians(techsRes);

        const repairTickets: RepairTicket[] = ticketsRes;
        const allData: ChartDataItem[] = techsRes.map((tech) => {
          const completed = repairTickets.filter(
            t =>
              t.assignedTechnicianId === tech.id &&
              (t.status === RepairStatus.COMPLETED || t.status === RepairStatus.PAID)
          ).length;

          return { name: tech.name, value: completed };
        });

        if (selectedTechId) {
          const filteredData = allData.filter(d => {
            const selectedTech = techsRes.find(t => t.id === selectedTechId);
            return d.name === selectedTech?.name;
          });
          setTechnicianPerformanceData(filteredData);
        } else {
          setTechnicianPerformanceData(allData);
        }

      } catch (err) {
        console.error('Failed to load reports data:', err);
      }
    };

    fetchData();
  }, [api, selectedTechId]);


  const handleExportToExcel = () => {
    const completedSales = tickets.filter(
      t => t.status === RepairStatus.COMPLETED || t.status === RepairStatus.PAID
    );

    const worksheetData = completedSales.map(t => ({
      ID: t.id,
      Customer: t.customerName || 'N/A',
      Device: t.deviceInfo || 'Unknown',
      Technician: t.technicianName || 'N/A',
      Cost: `$${(t.cost || 0).toFixed(2)}`,
      Date: new Date(t.completionDate || t.requestDate).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

    XLSX.writeFile(workbook, 'sales_report.xlsx');
  };
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Repair Logs Report', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Device', 'Status', 'Cost', 'Date']],
      body: tickets.map(t => [
        t.id,
        t.deviceInfo,
        t.status,
        `$${(t.cost || 0).toFixed(2)}`,
        new Date(t.completionDate || t.requestDate).toLocaleDateString()
      ])
    });

    doc.save('repair_logs_report.pdf');
  };
  const topDevicesData = useMemo(() => {
    const counts: { [device: string]: number } = {};
    tickets.forEach(t => {
      const device = t.deviceInfo || 'Unknown';
      counts[device] = (counts[device] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tickets]);


  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const date = new Date(t.completionDate || t.requestDate);
      return (!startDate || new Date(startDate) <= date) && (!endDate || date <= new Date(endDate));
    });
  }, [tickets, startDate, endDate]);

  const revenueStats = useMemo(() => {
    const completed = tickets.filter(t => t.status === RepairStatus.COMPLETED || t.status === RepairStatus.PAID);
    const total = completed.reduce((sum, t) => sum + (t.cost || 0), 0);
    const avg = completed.length ? total / completed.length : 0;
    return { total, count: completed.length, avg };
  }, [tickets]);

  // Memoize data transformations to prevent re-computation on every render
  const salesData = useMemo(() => {
    const monthlySales: { [month: string]: number } = {};
    filteredTickets.forEach(ticket => {
      if ((ticket.status === RepairStatus.COMPLETED || ticket.status === RepairStatus.PAID) && ticket.cost && ticket.completionDate) {
        const monthYear = new Date(ticket.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlySales[monthYear] = (monthlySales[monthYear] || 0) + ticket.cost;
      }
    });
    return Object.entries(monthlySales).map(([name, value]) => ({ name, value }));
  }, [filteredTickets]);

  const repairTypeData = useMemo(() => {
    const typeCounts: { [type: string]: number } = {};
    filteredTickets.forEach(ticket => {
      let type = "General";
      if (ticket.deviceInfo?.toLowerCase().includes("screen")) type = "Screen";
      else if (ticket.deviceInfo?.toLowerCase().includes("battery")) type = "Battery";
      else if (ticket.deviceInfo?.toLowerCase().includes("water")) type = "Water Damage";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [filteredTickets]);

  const handleExportCSV = () => {
    const rows = tickets.map(t => ({
      id: t.id,
      device: t.deviceInfo,
      status: t.status,
      cost: t.cost || 0,
      date: t.completionDate || t.requestDate
    }));
    const csv = [
      ['ID', 'Device', 'Status', 'Cost', 'Date'],
      ...rows.map(r => [r.id, r.device, r.status, r.cost, r.date])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repair_report.csv';
    a.click();
  };
  const handleExportSalesCSV = () => {
    const completedSales = tickets.filter(
      t => t.status === RepairStatus.COMPLETED || t.status === RepairStatus.PAID
    );

    const rows = completedSales.map(t => ({
      id: t.id,
      customer: t.customerName || 'N/A',
      device: t.deviceInfo,
      technician: t.technicianName || 'N/A',
      cost: t.cost || 0,
      date: t.completionDate || t.requestDate,
    }));

    const csv = [
      ['ID', 'Customer', 'Device', 'Technician', 'Cost', 'Date'],
      ...rows.map(r => [r.id, r.customer, r.device, r.technician, `$${r.cost}`, r.date])
    ]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_data.csv';
    a.click();
  };





  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-neutral-dark">Reports & Analytics</h1>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm text-gray-600 font-medium mb-1">From</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm text-gray-600 font-medium mb-1">To</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>


      <select onChange={e => setSelectedTechId(e.target.value)} className="form-select">
        <option value="">All Technicians</option>
        {technicians.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ReportChart data={salesData} title="Monthly Sales Revenue" chartType="bar" />
        <ReportChart data={repairTypeData} title="Repair Type Frequency" chartType="pie" />
      </div>
      <ReportChart
        data={technicianPerformanceData}
        title="Technician Performance (Completed Repairs)"
        chartType="bar"
      />
      <ReportChart title="Top Repaired Devices" data={topDevicesData} chartType="pie" />
      <Card title="Quick Stats" className="grid grid-cols-1">
        <div className="grid grid-cols-1 gap-4">
          <p > Total Repairs: {tickets.length}</p>
          <p>Total Revenue: ${tickets.reduce((sum, inv) => sum + (inv.cost || 0), 0).toFixed(2)}</p>
          <p>Revenue Average : ${(tickets.reduce((sum, inv) => sum + (inv.cost || 0), 0) / (tickets.length)).toFixed(2)}</p>
        </div>
      </Card>


      <Card title="Detailed Data (Placeholder)">
        <p className="text-neutral-DEFAULT">This section could include tables for detailed sales, repair logs, or options to export data.</p>
    <div className="mt-4 space-x-2">
  <Button variant="primary" onClick={handleExportSalesCSV}>
    Export Sales Data (CSV)
  </Button>
  <Button variant="secondary" onClick={handleExportPDF}>
    Export Repair Logs (PDF)
  </Button>
  <Button onClick={handleExportCSV}>
    Download CSV
  </Button>
  <Button variant="ghost" onClick={handleExportToExcel}>
    Export as Excel
  </Button>
</div>

      </Card>
      <LogTable />
    </div>

  );
};

export default ReportsPage;