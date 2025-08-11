
import React from 'react';
import { UserRole, NavItem } from './types';

export const APP_NAME = "ChainRepair Mobile Management";

// SVG Icons (Heroicons style, simplified)
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M1.5 10.5v7.5A1.5 1.5 0 003 19.5h4.5V15a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v4.5h4.5a1.5 1.5 0 001.5-1.5v-7.5M22.5 12l-2.25-2.25" />
  </svg>
);
export const SystemLogsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2.25-11.25H6.75A2.25 2.25 0 004.5 7.5v9A2.25 2.25 0 006.75 18.75h10.5A2.25 2.25 0 0019.5 16.5v-9A2.25 2.25 0 0017.25 4.5zM12 6.75a.75.75 0 01-.75-.75h1.5a.75.75 0 01-.75.75z" />
  </svg>
);

export const ManagerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75A3.75 3.75 0 1013.5 10.5M6.75 6.75a3.75 3.75 0 107.5 0m5.25 12v-1.5a2.25 2.25 0 00-2.25-2.25H7.5a2.25 2.25 0 00-2.25 2.25V18.75M17.25 18.75v-.75a3 3 0 00-3-3H9.75a3 3 0 00-3 3v.75" />
  </svg>
);

export const SuppliersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25a2.25 2.25 0 11-4.5 0m10.5 0a2.25 2.25 0 114.5 0M3 5.25A2.25 2.25 0 015.25 3h10.5A2.25 2.25 0 0118 5.25v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 14.25v-9zm13.5 0h3a2.25 2.25 0 012.25 2.25V12" />
  </svg>
);

export const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M9 2.25a.75.75 0 00-.75.75v.75H4.5a.75.75 0 000 1.5h.768l.715 12.852A2.25 2.25 0 008.23 20.25h7.54a2.25 2.25 0 002.246-2.148L19.23 5.25h.77a.75.75 0 000-1.5h-3.75V3a.75.75 0 00-.75-.75H9z" />
  </svg>
);



export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M17.414 2.586a2 2 0 010 2.828l-1.793 1.793-2.828-2.828 1.793-1.793a2 2 0 012.828 0zM2 13.586l7.793-7.793 2.828 2.828L4.828 16.414H2v-2.828z" />
  </svg>
);





export const WrenchScrewdriverIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.664 1.193-.852A3.003 3.003 0 0019.5 7.5c0-1.063-.393-2.04-.964-2.805C17.695 3.422 16.572 3 15.375 3A3.003 3.003 0 0012.5 4.147c-.188.462-.468.875-.852 1.192L8.83 7.713m2.589 7.457l-3.031 2.496a2.652 2.652 0 01-3.75 0L3 17.25a2.652 2.652 0 010-3.75l2.496-3.031m6.335 6.334L13.5 15.25" />
  </svg>
);

export const ArchiveBoxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

export const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25H21m-3 2.25H21m0 0H12.75m9 0H12.75M2.25 12l1.06 1.06c.27.27.27.71 0 .98L2.25 15V12zm19.5 0l-1.06 1.06c-.27.27-.27.71 0 .98l1.06 1.06V12zM2.25 18.75h19.5c.83 0 1.5-.67 1.5-1.5V6.75c0-.83-.67-1.5-1.5-1.5H2.25c-.83 0-1.5.67-1.5 1.5v10.5c0 .83.67 1.5 1.5 1.5z" />
  </svg>
);

export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 1.255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.646.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.646-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.758 6.758 0 010-1.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.646-.869l.213-1.28z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


export const NAVIGATION_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" />, roles: [UserRole.CUSTOMER, UserRole.TECHNICIAN, UserRole.MANAGER] },
  // Customer
  { path: '/my-repairs', label: 'My Repairs', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, roles: [UserRole.CUSTOMER] },
  { path: '/request-repair', label: 'New Repair', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, roles: [UserRole.CUSTOMER] },
  // Technician
  { path: '/assigned-tasks', label: 'Assigned Tasks', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, roles: [UserRole.TECHNICIAN] },
   { path: '/inventory', label: 'view Parts Stock', icon: <ChartBarIcon className="w-5 h-5" />, roles: [UserRole.TECHNICIAN] },
   { path: '/usedRep', label: 'used parts', icon: <ChartBarIcon className="w-5 h-5" />, roles: [UserRole.TECHNICIAN] },

  // Manager
  { path: '/manage-repairs', label: 'All Repairs', icon: <WrenchScrewdriverIcon className="w-5 h-5" />, roles: [UserRole.MANAGER] },
  { path: '/inventory', label: 'Inventory', icon: <ArchiveBoxIcon className="w-5 h-5" />, roles: [UserRole.MANAGER] },
  { path: '/technicians', label: 'Technicians', icon: <UserGroupIcon className="w-5 h-5" />, roles: [UserRole.MANAGER] },
  { path: "/Manage-admins", label: 'Manage admin', icon: <ManagerIcon className="w-5 h-5" />, roles: [UserRole.MANAGER] },
  { path: "/views-Logs", label: 'View Logs', icon: <SystemLogsIcon className="w-5 h-5" />, roles: [UserRole.MANAGER] },
  {path:"/suppliers" , label:"Manage suppliers" , icon:<SuppliersIcon className='w-5 h-5'/>,roles:[UserRole.MANAGER]},
  { path: '/financials', label: 'Finance', icon: <CreditCardIcon className="w-5 h-5" />, roles: [UserRole.MANAGER] },
  
  { path: '/reports', label: 'Reports', icon: <ChartBarIcon className="w-5 h-5" />, roles: [UserRole.MANAGER] },
  { path: '/settings', label: 'My profile', icon: <CogIcon className="w-5 h-5" />, roles: [UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.CUSTOMER] }, // Example
];
