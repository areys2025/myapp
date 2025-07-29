import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import { Select } from '../components/common/Input';
import Button from '../components/common/Button';

const LogTable: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
    const [filterDate, setFilterDate] = useState<string>('');
    const [filterRole, setFilterRole] = useState<string>('');
    const [filterAction, setFilterAction] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const logsPerPage = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/system-logs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!Array.isArray(res.data)) {
                throw new Error("expected  Array of technician data");
            }
            setLogs(res.data);
            setFilteredLogs(res.data);
        };
        fetchLogs();
    }, []);

    const handleExport = () => {
        const csvRows = [
            ['Date', 'Action', 'Actor', 'Role', 'Details'],
            ...filteredLogs.map(log => [
                log.date,
                log.action,
                log.actor || '-',
                log.role || '-',
                JSON.stringify(log.details || {})
            ])
        ];

        const csvContent = csvRows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'system_logs.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

const handleFilter = () => {
  let filtered = [...logs];

  // Filter by date (convert both to yyyy-mm-dd)
  if (filterDate) {
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0]; // e.g., '2025-07-23'
      return logDate === filterDate;
    });
  }

  if (filterRole) {
    filtered = filtered.filter(log => log.role === filterRole);
  }

  if (filterAction) {
    filtered = filtered.filter(log =>
      log.action?.toLowerCase().includes(filterAction.toLowerCase())
    );
  }

  if (searchText) {
    const lower = searchText.toLowerCase();
    filtered = filtered.filter(log =>
      log.actor?.toLowerCase().includes(lower) ||
      log.role?.toLowerCase().includes(lower) ||
      log.action?.toLowerCase().includes(lower) ||
      JSON.stringify(log.details || {}).toLowerCase().includes(lower)
    );
  }

  setFilteredLogs(filtered);
  setCurrentPage(1);
};

useEffect(() => {
  handleFilter();
}, [filterDate, filterRole, filterAction, searchText, logs]); // ← Re-run when these change

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    return (
        <Card className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">System Logs</h2>
<div className="flex flex-wrap gap-4 items-center">
  <Input
    type="date"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
    className="max-w-xs"
  />
  <Input
    placeholder="Filter by action"
    value={filterAction}
    onChange={(e) => setFilterAction(e.target.value)}
    className="max-w-xs"
  />
  <Select
    value={filterRole}
    onChange={(e) => setFilterRole(e.target.value)}
    className="max-w-xs"
    options={[
      { value: '', label: 'All Roles' },
      { value: 'Customer', label: 'Customer' },
      { value: 'Technician', label: 'Technician' },
      { value: 'Manager', label: 'Manager' },
    ]}
  />
  <Input
    placeholder="Search text"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="max-w-xs"
  />
  <Button onClick={handleExport} className="ml-auto">Export CSV</Button>
</div>
<div className="overflow-auto max-h-[500px] border rounded">
    <table className="w-full text-sm text-left">
<thead>
  <tr>
    <th>Date</th>
    <th>Action</th>
    <th>User</th>
    <th>Role</th>
    <th>Details</th>
  </tr>
</thead>
<tbody>
  {currentLogs.map((log, idx) => (
    <tr key={idx}>
      <td>{log.date}</td>
      <td>{log.action}</td>
      <td>{log.actor || '-'}</td> {/* Fix: actor here */}
      <td>{log.role || '-'}</td>
      <td>
        <ul>
          {log.details && Object.entries(log.details).map(([k, v]) => (
            <li key={k}><b>{k}:</b> {typeof v === 'object' ? JSON.stringify(v) : String(v)}</li>
          ))}
        </ul>
      </td>
    </tr>
))}
</tbody>
    </table>
        </div>
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            variant={i + 1 === currentPage ? 'default' : 'outline'}
                            onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </Button>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default LogTable;
