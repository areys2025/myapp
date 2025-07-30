import React, { useEffect, useState, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { Expense } from '../../types';
import Table from '../common/Table';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ExpenseForm from './ExpenseForm';
import Input from '../common/Input'; // assuming reusable input component
import axios from 'axios';

const ExpenseList: React.FC = () => {
  const api = useApi();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get<Expense[]>('https://myapp-ph0r.onrender.com/api/expenses');
      setExpenses(res.data);
      setFilteredExpenses(res.data); // Set initially
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expenses.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let filtered = [...expenses];

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.category.toLowerCase().includes(lower) ||
        exp.description.toLowerCase().includes(lower)
      );
    }

    if (filterDate) {
      filtered = filtered.filter(exp => new Date(exp.date).toISOString().split('T')[0] === filterDate);
    }

    setFilteredExpenses(filtered);
  }, [searchText, filterDate, expenses]);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchExpenses();
  };

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Expense, className: 'font-mono text-xs' },
    { header: 'Date', accessor: (exp: Expense) => new Date(exp.date).toLocaleDateString() },
    { header: 'Category', accessor: 'category' as keyof Expense },
    { header: 'Description', accessor: 'description' as keyof Expense },
    { 
      header: 'Amount',
      accessor: (exp: Expense) => `$${exp.amount.toFixed(2)}`,
      cellClassName: 'text-right font-semibold text-neutral-dark'
    },
  ];

  if (isLoading && expenses.length === 0) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card
      title="Operational Expenses"
      className="mt-6"
      footer={
        <div className="flex justify-between items-center">
          <Button onClick={openAddModal}>Add New Expense</Button>
          <div>
            <span className="text-sm text-neutral-DEFAULT mr-1">Total Expenses:</span>
            <span className="text-lg font-semibold text-neutral-dark">${totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      }
    >
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Input
          placeholder="Search category or description"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Table<Expense>
        columns={columns}
        data={filteredExpenses}
        isLoading={isLoading}
        emptyMessage="No expenses recorded yet."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Expense">
        <ExpenseForm onSuccess={handleFormSuccess} />
      </Modal>
    </Card>
  );
};

export default ExpenseList;
