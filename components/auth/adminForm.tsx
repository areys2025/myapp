import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Admin, UserRole } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';

interface AdminFormProps {
    currentAdmin: Admin | null;
    onSuccess: () => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ currentAdmin, onSuccess }) => {
    const { user } = useAuth();
    const isEditMode = Boolean(currentAdmin);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [availability, setAvailability] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const api = useApi();

    useEffect(() => {
        if (currentAdmin) {
            setId(currentAdmin.id);
            setName(currentAdmin.name || '');
            setEmail(currentAdmin.email || '');
            setContactNumber(currentAdmin.contactNumber || '');
            setSpecialization(currentAdmin.specialization || '');
            setWalletAddress(currentAdmin.walletAddress || '');
            setAvailability(currentAdmin.availability ?? true);
        } else {
            setId('');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setContactNumber('');
            setSpecialization('');
            setWalletAddress('');
            setAvailability(true);
        }
    }, [currentAdmin]);

    const validate = (): string | null => {
        if (!name || name.length < 3) return 'Name must be at least 3 characters.';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format.';
        if (!contactNumber || !/^\d{7,}$/.test(contactNumber)) return 'Contact number must be at least 7 digits.';
        if (!walletAddress) return 'Wallet address is required.';

        if (!isEditMode || password) {
            if (password.length < 6) return 'Password must be at least 6 characters.';
            if (password !== confirmPassword) return 'Passwords do not match.';
        }

        return null; // No validation errors
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        const LoginfoEml = user?.email;
        const LoginfoRle = user?.role;

        const adminData = {
            id,
            name,
            email,
            contactNumber,
            specialization,
            walletAddress,
            availability,
            role: UserRole.MANAGER,
            ...(password && { password }),
            ...(confirmPassword && { confirmPassword }),
            LoginfoEml,
            LoginfoRle,
        };

        try {
            if (isEditMode) {
                await api.updateAdmin(currentAdmin!.id, adminData);
                setSuccess('Admin updated successfully.');
            } else {
                const createdAdmin = await api.createdAdmin(adminData);
                api.registerUser(adminData)
                setSuccess(`Registration successful! Welcome, ${createdAdmin.name}.`);
                setTimeout(() => navigate('/dashboard'), 2000);
            }

            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {isEditMode ? 'Edit Admin' : 'Register Admin'}
            </h2>

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
            {success && <Alert type="success" message={success} />}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input id="name" label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        id="contactNumber"
                        label="Contact Number"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                    />
                    <Input
                        id="walletAddress"
                        label="Wallet Address"
                        required
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                    />

                    <div className="flex items-center mt-1">
                        <input
                            id="availability"
                            type="checkbox"
                            checked={availability}
                            onChange={(e) => setAvailability(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="availability" className="ml-2 text-sm text-gray-900">
                            Available
                        </label>
                    </div>

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        required={!isEditMode}
                        placeholder={isEditMode ? 'Leave blank to keep current' : ''}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        required={!isEditMode}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                    {isEditMode ? 'Update Admin' : 'Register Admin'}
                </Button>
            </form>
        </div>
    );
};

export default AdminForm;
