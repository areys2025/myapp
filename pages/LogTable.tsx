import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import { Select } from '../components/common/Input';
import Button from '../components/common/Button';

const LogTable: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
        throw new Error("Expected an array of logs");
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilter = () => {
    let filtered = [...logs];

    if (filterDate) {
      filtered = filtered.filter(log =>
        new Date(log.timestamp).toISOString().split('T')[0] === filterDate
      );
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
  }, [filterDate, filterRole, filterAction, searchText, logs]);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <Card className="p-6 space-y-6">
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">📜 System Logs</h2>
        <Button onClick={handleExport} className="ml-auto">Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} label="Filter by Date" />
        <Input placeholder="Filter by Action" value={filterAction} onChange={e => setFilterAction(e.target.value)} label="Filter by Action" />
        <Select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          label="Filter by Role"
          options={[
            { value: '', label: 'All Roles' },
            { value: 'Customer', label: 'Customer' },
            { value: 'Technician', label: 'Technician' },
            { value: 'Manager', label: 'Manager' },
          ]}
        />
        <Input placeholder="Search" value={searchText} onChange={e => setSearchText(e.target.value)} label="Global Search" />
      </div>

      <div className="overflow-auto max-h-[500px] border rounded shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-gray-700">
              <th className="px-4 py-2 border-b">📅 Date</th>
              <th className="px-4 py-2 border-b">🛠 Action</th>
              <th className="px-4 py-2 border-b">👤 User</th>
              <th className="px-4 py-2 border-b">🎭 Role</th>
              <th className="px-4 py-2 border-b">📄 Details</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-all">
                <td className="px-4 py-2 border-b">{log.date}</td>
                <td className="px-4 py-2 border-b">{log.action}</td>
                <td className="px-4 py-2 border-b">{log.actor || '-'}</td>
                <td className="px-4 py-2 border-b">{log.role || '-'}</td>
                <td className="px-4 py-2 border-b max-w-sm whitespace-pre-wrap break-words">
                  <ul className="list-disc list-inside space-y-1">
                    {log.details && Object.entries(log.details).map(([k, v]) => (
                      <li key={k}><strong>{k}:</strong> {typeof v === 'object' ? JSON.stringify(v) : String(v)}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
            {currentLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              variant={i + 1 === currentPage ? 'default' : 'outline'}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LogTable;
