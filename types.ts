
// Fix: Import ReactNode for use in NavItem
import type { ReactNode } from 'react';
export enum UserRole {
  CUSTOMER = 'Customer',
  TECHNICIAN = 'Technician',
  MANAGER = 'Manager',
}
export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  createdAt?: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string; // For simulated blockchain login
  message?: string;
  contactNumber: string;
}
export interface allData extends User , Customer{

}
export interface Customer extends User {
  deviceType: string;
}
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  products: string[];
  isActive: boolean;
}

export enum RepairStatus {
  REQUESTED = 'Requested',
  IN_PROGRESS = 'In Progress',
  WAITING_FOR_PARTS = 'Waiting for Parts',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PAID = 'Paid',
}

export interface RepairTicket {
  _id: string;
  notes: any;
  id:string,
 TicketId: string;
  requestDate: string | number | Date;
  completionDate: string | number | Date;
  deviceInfo: string;
  issueDescription: string;
  assignedTechnicianId?: string;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  customerId:string;
  customerName?: string; // Denormalized for display
  technicianName?: string; // Denormalized
  feedback:Feedback;
  cost?: number;
}

export interface Feedback {
  assignedTechnicianId: string | undefined;
  ticketId: string;
  rating: number;
  comment?: string;
  date: string;
  userEmail: string;
  walletAddress: string;
}

export interface invoice {
   id: String,
    ticketId:String,
    deviceInfo: String,
    issueDescription: String,
    assignedTechnicianId: String,
    status: RepairStatus,
    createdAt: string | number | Date,
    updatedAt: string | number | Date,
    customerName: String,
    technicianName: String,
    cost?: number,
    completionDate: string | number | Date, 

}


export interface InventoryItem {
  id: string;
  _id:string,
  name: string;
  quantity: number;
  minStockLevel: number;
  price: number;
  supplier?: string;
}
export type PurchaseOrderStatus = 'Pending' | 'Delivered' | 'Cancelled' | 'Received';

export interface PurchaseOrder {
  id: string; // frontend ID
  itemId: string; // this is required!
  itemName: string;
  quantity: number;
  purchInvId:string,
  orderDate: string;
  expectedDeliveryDate: string;  
  status: 'Pending' | 'Delivered' | 'Cancelled';
  supplier: string;
  totalCost: number;
}


export interface Technician {
  _id: string | undefined;
  status: RepairStatus;
  assignedTechnicianId: any;
  id:  string;
  name: string;
  email: string;
  role: UserRole.TECHNICIAN;
  specialization?: string;
  availability?: boolean;
  contactNumber?: string;
  walletAddress?: string;
}

export interface Admin {
  id:  string;
  name: string;
  email: string;
  role: UserRole.MANAGER;
  specialization?: string;
  availability?: boolean;
  contactNumber?: string;
  walletAddress?: string;
  deviceType:string;
}
export interface LogEntry {
  id: string;               
  date: string;             
  timestamp: string;       
  action: string;           
  actor?: string;           
  role?: 'Customer' | 'Technician' | 'Manager';
  details?: Record<string, any>; 
}

export type TechnicianPayload = Omit<Technician, 'id' | 'role'> & {
  password?: string;
  name: string;
  email: string;
  role: UserRole.TECHNICIAN;
  availability?: boolean;
  contactNumber?: string;
  walletAddress?: string;
};



export interface Expense {
  id:string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

// For communication modulsupe (simplified)
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  filter(arg0: (t: any) => boolean): unknown;
  stats: {
    totalRepairs: number;
    activeRepairs: number;
    completedRepairs: number;
    totalCustomers: number;
    totalTechnicians: number;
  };
  recentRepairs: Array<{
    _id: string;
    customerName: string;
    deviceInfo: string;
    status: string;
    requestDate: string;
  }>;
  monthlyStats: Array<{
    _id: {
      month: number;
      year: number;
    };
    count: number;
    revenue: number;
  }>;
}

// For navigation
export interface NavItem {
  path: string;
  label: string;
// Fix: Use imported ReactNode type
  icon?: ReactNode;
  roles: UserRole[];
}