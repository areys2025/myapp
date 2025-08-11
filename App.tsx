
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';
import CustomerPortalPage from './pages/CustomerPortalPage';
import TechnicianPortalPage from './pages/TechnicianPortalPage';
import ManagementPortalPage from './pages/ManagementPortalPage';
import ReportsPage from './pages/ReportsPage';
import InventoryPage from './pages/InventoryPage';
import FinancialsPage from './pages/FinancialsPage';
import RequestRepairPage from './pages/RequestRepairPage';
import MyRepairsPage from './pages/MyRepairsPage';
import AssignedTasksPage from './pages/AssignedTasksPage';
import ManageRepairsPage from './pages/ManageRepairsPage';
import ManageTechniciansPage from './pages/ManageTechniciansPage';
import SettingsPage from './pages/SettingsPage'; // Generic settings page
import { UserRole } from './types';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UsedPartsForm from './components/UsedPartsForm'
import ManageAdmins from './pages/ManageAdmins'
import LogTable from './pages/LogTable'; 
import Supplier from './pages/ManageSuppliersPage';
// Inside your <Routes>
const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* ✅ Fix: Moved here */}

      {/* 🔒 Protected Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={
          user ? (
            user.role === UserRole.CUSTOMER ? <CustomerPortalPage key={user.id} /> :
            user.role === UserRole.TECHNICIAN ? <TechnicianPortalPage key={user.id} /> :
            user.role === UserRole.MANAGER ? <ManagementPortalPage key={user.id} /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />

        {/* Customer Routes */}
        <Route path="/my-repairs" element={user && user.role === UserRole.CUSTOMER ? <MyRepairsPage key={user.id} /> : <Navigate to="/login" />} />
        <Route path="/request-repair" element={user && user.role === UserRole.CUSTOMER ? <RequestRepairPage /> : <Navigate to="/login" />} />

        {/* Technician Routes */}
        <Route path="/assigned-tasks" element={user && user.role === UserRole.TECHNICIAN ? <AssignedTasksPage key={user.id} /> : <Navigate to="/login" />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/assigned-tasks" element={user && user.role === UserRole.TECHNICIAN ? <AssignedTasksPage key={user.id} /> : <Navigate to="/login" />} />
        <Route path="/usedRep" element={user && user.role === UserRole.TECHNICIAN ? <UsedPartsForm key={user.id} inventoryItems={[]} /> : <Navigate to="/login" />} />

        {/* Manager Routes */}
        <Route path="/manage-repairs" element={user && user.role === UserRole.MANAGER ? <ManageRepairsPage key={user.id} /> : <Navigate to="/login" />} />
        <Route path="/technicians" element={user && user.role === UserRole.MANAGER ? <ManageTechniciansPage key={user.id} /> : <Navigate to="/login" />} />
        <Route path="/financials" element={user && user.role === UserRole.MANAGER ? <FinancialsPage key={user.id} /> : <Navigate to="/login" />} />
        <Route path="/reports" element={user && user.role === UserRole.MANAGER ? <ReportsPage key={user.id} /> : <Navigate to="/login" />} />
        <Route path="/Manage-admins" element={<ManageAdmins />} />
        <Route path="/views-Logs" element={<LogTable />} />
        <Route path="/suppliers" element={<Supplier />} />
        {/* Settings for all */}
        <Route path="/settings" element={user ? <SettingsPage key={user.id} /> : <Navigate to="/login" />} />

        {/* Catch-All */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};


export default App;