
import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Expense } from '../../types';
import Button from '../common/Button';
import Input, { Select, Textarea } from '../common/Input';
import Alert from '../common/Alert';
interface ExpenseFormProps {
  onSuccess: () => void;
}

const EXPENSE_CATEGORIES = [
  { value: 'Parts', label: 'Parts Purchase' },
  { value: 'Tools', label: 'Tools & Equipment' },
  { value: 'Utilities', label: 'Utilities (Rent, Electricity)' },
  { value: 'Salaries', label: 'Salaries & Wages' },
  { value: 'Marketing', label: 'Marketing & Advertising' },
  { value: 'Software', label: 'Software & Subscriptions' },
  { value: 'Other', label: 'Other' },
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess }) => {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].value);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(String(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!description.trim()) {
        setError('Description is required.');
        return;
    }

    setIsLoading(true);
    try {
      const expenseData: Omit<Expense, 'id'> = {
        category,
        description,
        amount: numAmount,
        date,
      };
      await api.createExpense(expenseData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <Select
        label="Category"
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={EXPENSE_CATEGORIES}
        required
        disabled={isLoading}
      />
      <Textarea
        label="Description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={2}
        disabled={isLoading}
        placeholder="Detailed description of the expense"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
            label="Amount ($)"
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            disabled={isLoading}
        />
        <Input
            label="Date"
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isLoading}
        />
      </div>
      
      <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full sm:w-auto">
        Add Expense
      </Button>
    </form>
  );
};

export default ExpenseForm;
