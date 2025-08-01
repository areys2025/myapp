// frontend/components/PartForm.tsx

import React, { useState, useEffect , useCallback } from 'react';
import { InventoryItem, Supplier } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { useApi } from '@/hooks/useApi';
import CreatableSelect from 'react-select/creatable';

interface PartFormProps {
  currentItem?: InventoryItem | null;
  onSuccess: () => void;
}

const PartForm: React.FC<PartFormProps> = ({ currentItem, onSuccess }) => {
 const api=useApi();
   
const [supplierOptions, setSupplierOptions] = useState<{ label: string; value: string }[]>([]);

const fetchSuppliers = useCallback(async () => {
  setIsLoading(true);
  setError(null);

  try {
    const data: Supplier[] = await api.getSuppliers();
    const options = data.map((supplier: Supplier) => ({
      label: supplier.company,
      value: supplier.company,
    }));
    setSupplierOptions(options); // ✅ store options
  } catch (error) {
    setError('Failed to load suppliers');
    console.error('Supplier fetch error:', error);
  } finally {
    setIsLoading(false);
  }
}, [api]);


 const [form, setForm] = useState({
    name: '',
    quantity: '',
    minStockLevel: '',
    price: '',
    supplier: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentItem) {
      console.log("waa yimid")
      setForm({
        name: currentItem.name,
        quantity: String(currentItem.quantity),
        minStockLevel: String(currentItem.minStockLevel),
        price: String(currentItem.price),
        supplier: currentItem.supplier || '',
      });
    } else {
      fetchSuppliers()
      setForm({ name: '', quantity: '', minStockLevel: '', price: '', supplier: '' });
    }
  }, [currentItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { name, quantity, minStockLevel, price, supplier } = form;
    const parsedQuantity = parseInt(quantity);
    const parsedMinStock = parseInt(minStockLevel);
    const parsedPrice = parseFloat(price);

    if (!name.trim() || isNaN(parsedQuantity) || isNaN(parsedMinStock) || isNaN(parsedPrice)) {
      setError('Please provide valid values for all required fields.');
      return;
    }

    const payload = {
      name: name.trim(),
      quantity: parsedQuantity,
      minStockLevel: parsedMinStock,
      price: parsedPrice,
      supplier: supplier.trim(),
    };
    try {
      setIsLoading(true);
      if (currentItem?._id) {
        api.updateInventory(currentItem._id,payload)
      } else {
        console.log('Sending payload:', payload);
        api.storeInv(payload)

      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save part.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <Input id="name" label="Part Name" value={form.name} onChange={handleChange} required disabled={isLoading} />
      <div className="grid grid-cols-2 gap-4">
        <Input id="quantity" label="Quantity" type="number" value={form.quantity} onChange={handleChange} required min="0" disabled={isLoading} />
        <Input id="minStockLevel" label="Min. Stock Level" type="number" value={form.minStockLevel} onChange={handleChange} required min="0" disabled={isLoading} />
      </div>
      <Input id="price" label="Price ($)" type="number" step="0.01" value={form.price} onChange={handleChange} required min="0" disabled={isLoading} />
<label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
  <CreatableSelect
    options={supplierOptions}
    value={
      form.supplier
        ? { label: form.supplier, value: form.supplier }
        : null
    }
    onChange={(selected) =>
      setForm({ ...form, supplier: selected?.value || '' })
    }
    isClearable
    placeholder="Select or type supplier"
    className="react-select-container"
    classNamePrefix="react-select"
    isDisabled={isLoading}
  />
</div>

      <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full">
        {currentItem ? 'Update Part' : 'Add Part'}
      </Button>
    </form>
  );
};

export default PartForm;
