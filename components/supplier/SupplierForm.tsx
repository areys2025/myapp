import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '../common/Input';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';
import { Supplier } from '../../types';

interface SupplierFormProps {
  currentSupplier: Supplier | null;
  onSuccess: () => void;
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required'),
  companyName: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  products: z.array(z.object({ label: z.string(), value: z.string() })),
});

type FormData = z.infer<typeof schema>;

const SupplierForm: React.FC<SupplierFormProps> = ({ currentSupplier, onSuccess }) => {
  const api = useApi();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      companyName: '',
      address: '',
      products: [],
    },
  });

  useEffect(() => {
    if (currentSupplier) {
      setValue('name', currentSupplier.name);
      setValue('email', currentSupplier.email);
      setValue('phone', currentSupplier.phone);
      setValue('companyName', currentSupplier.company);
      setValue('address', currentSupplier.address);
      setValue(
        'products',
        (currentSupplier.products || []).map((p) => ({ label: p, value: p }))
      );
    }
  }, [currentSupplier, setValue]);

  const onSubmit = async (data: FormData) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.companyName,
      address: data.address,
      products: data.products.map((p) => p.value),
    };

    try {
      if (currentSupplier) {
        await api.updateSupplier(currentSupplier.id, payload);
      } else {
        await api.createSupplier(payload);
      }
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
<form
  onSubmit={handleSubmit(onSubmit)}
  className="w-full max-w-3xl mx-auto bg-white text-gray-900 p-4 rounded-xl shadow-lg space-y-4"
>
  <h2 className="text-xl font-semibold text-center text-gray-800">
    {currentSupplier ? 'Edit Supplier' : 'Add Supplier'}
  </h2>

  {/* 2-column grid for compactness */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Name"
      {...register('name')}
      error={errors.name?.message}
      className="text-sm py-1.5"
    />
    <Input
      label="Email"
      type="email"
      {...register('email')}
      error={errors.email?.message}
      className="text-sm py-1.5"
    />
    <Input
      label="Phone"
      {...register('phone')}
      error={errors.phone?.message}
      className="text-sm py-1.5"
    />
    <Input
      label="Company"
      {...register('companyName')}
      error={errors.companyName?.message}
      className="text-sm py-1.5"
    />
    <Input
      label="Address"
      {...register('address')}
      error={errors.address?.message}
      className="text-sm py-1.5 md:col-span-2"
    />
  </div>

  <div className="md:col-span-2">
    <label className="block text-sm font-medium mb-1 text-gray-700">Products</label>
    <Controller
      name="products"
      control={control}
      render={({ field }) => (
        <CreatableSelect
          {...field}
          isMulti
          placeholder="Select or type products"
          className="text-black text-sm"
          classNamePrefix="react-select"
        />
      )}
    />
    {errors.products && (
      <p className="text-red-600 text-sm mt-1">{errors.products.message as string}</p>
    )}
  </div>

  <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
    {currentSupplier ? 'Update Supplier' : 'Add Supplier'}
  </Button>
</form>


  );
};

export default SupplierForm;
