// hooks/useApi.ts
import axios from 'axios';
import { PurchaseOrder, Customer, InventoryItem, Technician, PaymentResponse, RepairTicket, DashboardStats, TechnicianPayload, Expense, invoice, Feedback ,Admin, Supplier } from '../types';


export const useApi = () => {

  const token = localStorage.getItem('token');

  const Pinstance = axios.create({
    baseURL: 'https://myapp-ph0r.onrender.com/api/auth',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  const instance = axios.create({
    baseURL: 'https://myapp-ph0r.onrender.com/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return {
    getDashboardData: async (): Promise<DashboardStats> => {
      const res = await instance.get<DashboardStats>('/dashboard');
      return res.data;
    },

    createPurchaseOrder: (data: Omit<any, 'id' | 'itemName'>) => instance.post('/purchase-orders', data).then(res => res.data),

    getInventoryItems: async (): Promise<InventoryItem[]> => {
      const res:any = await instance.get('/inventory');
      if (!Array.isArray(res.data)) {
        throw new Error('Invalid response format: expected an array');
      }
      return res.data.map((item: any) => ({
        _id: item._id || item._id,
        name: item.name,
        quantity: item.quantity,
        minStockLevel: item.minStockLevel,
        price: item.price,
        supplier: item.supplier,
      }));
    },
    updatePurchaseOrder: async (id: string, updates: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
      console.log(id)
      const response = await instance.put<PurchaseOrder>(`/purchase-orders/${id}`, updates);
      return response.data;
    },

  getPurchById: async (id: string): Promise<PurchaseOrder> => {
    const order:any= await instance.get(`/purchase-orders/${id}`);
      return order.data
    },

    getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
      const res = await instance.get('/purchase-orders');
      
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of purchase orders');
      }
      return res.data.map((order: any) => ({
        id: order._id,
        itemName: order.itemName,
        quantity: order.quantity,
        supplier: order.supplier,
        purchInvId:order.purchInvId,
        orderDate: order.orderDate,
        expectedDeliveryDate: order.expectedDeliveryDate,
        totalCost: order.totalCost,
        status: order.status,
        itemId: order.itemId
      }));
    },
// Inside useApi.ts or corresponding API service
updatePurchaseOrderStatus:async (itemId: string, status: 'Received' | 'Cancelled') => {
  return await instance.patch(`/api/purchase-orders/${itemId}/status`, { status });
},


    getRepairs: async (): Promise<RepairTicket[]> => {
      const res = await instance.get('/repairs');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of Repairs');
      }
      return res.data
    },
    getAllFeedBacks: async (): Promise<Feedback[]> => {
      const res = await instance.get('/feedback');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of feedbacks');
      }
      return res.data
    },
    getTechnicians: async (): Promise<Technician[]> => {
      const res = await Pinstance.get('/technicians');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of technicians');
      }
      console.log(res.data[2].contactNumber)
      return res.data.map((tech: any) => ({
        id: tech._id,
        name: tech.name,
        email: tech.email,
        role: tech.role,
        specialization: tech.specialization,
        availability: tech.availability,
        contactNumber: tech.contactNumber,
        walletAddress: tech.walletAddress,
        _id: tech._id, status: tech.status,
        assignedTechnicianId: tech.assignedTechnicianId
      }));
    },

    getTAdmins: async (): Promise<Admin[]> => {
      
      const res = await instance.get('/getAdmins');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of admins');
      }
      console.log(res.data[0])
      return res.data.map((adm: any) => ({
        id: adm._id,
        name: adm.name,
        email: adm.email,
        role: adm.role,
        deviceType:adm.deviceType,
        availability: adm.availability,
        contactNumber: adm.contactNumber,
        walletAddress: adm.walletAddress,
        _id: adm._id, status: adm.status,
        assignedTechnicianId: adm.assignedTechnicianId
      }));
    },

    getTcustomers: async (): Promise<Customer[]> => {
      const res = await instance.get('/api/users');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of technicians');
      }
      return res.data;
    },
    createExpense: (data: Omit<Expense, 'id' | 'category'>) => instance.post('/expenses', data).then(res => res.data),

    getAllExpenses: async (): Promise<Expense[]> => {
      const res = await instance.get('/expenses');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of expenses');
      }
      console.log(res.status)
      return res.data.map((exp: any) => ({
        id: exp.id,
        category: exp.category,
        description: exp.description,
        amount: exp.amount,
        date: exp.date,

      }));
    },    


   
    createdAdmin: async (technicianData: any): Promise<Admin> => {
      const response = await instance.post<Admin>('/regisadmin', technicianData);
      return response.data;
    },
 
deleteAdmin: (id: string) => instance.delete(`/regisadmin/${id}`),

    updateAdmin: async (id: string, adminData: Partial<any>): Promise<Admin> => {
      const response = await instance.put<Admin>(`/regisadmin/${id}`, adminData);
      return response.data;
    },
    updateInventory: async (_id: string, InvData: Partial<any>): Promise<InventoryItem> => {
      const response = await instance.put<InventoryItem>(`/inventory/${_id}`, InvData);
      return response.data;
    },
   storeInv: async (InvData: any): Promise<InventoryItem> => {
      const response = await instance.post<InventoryItem>('/inventory', InvData);
      return response.data;
    },
    getRepairTickets: async (): Promise<RepairTicket[]> => {
      const res = await instance.get('/repairs');
      if (!Array.isArray(res.data)) {
        console.error('Expected an array but got:', res.data);
        return []; // fallback to empty array
      }
      return res.data.map((ticket: any) => ({
        _id: ticket._id,
        TicketId: ticket.ticketId,
        customerId: ticket.customerId,
        deviceInfo: ticket.deviceInfo,
        issueDescription: ticket.issueDescription,
        assignedTechnicianId: ticket.assignedTechnicianId,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        customerName: ticket.customerName,
        technicianName: ticket.technicianName,
        cost: ticket.cost,
        requestDate: ticket.requestDate,
        completionDate: ticket.completionDate,
        notes: ticket.notes,
        id: ticket.id,
        feedback: ticket.feedback
      }

      )
      )
    },

    registerUser: async (userData: any) => {
      const res = await instance.post(`/auth/register`, userData);
      return res.data;
    },

    getTechById: async (technicianID: string): Promise<Technician> => {
      const tech:any= await instance.get(`/technicians/${technicianID}`);
      if (!Array.isArray(tech.data)) {
        throw new Error("expected  Array of technician data");
      }
      return tech.data.map((tech: any) => ({
        id: tech._id,
        name: tech.name,
        email: tech.email,
        role: tech.role,
        specialization: tech.specialization,
        availability: tech.availability,
        contactNumber: tech.contactNumber,
        walletAddress: tech.walletAddress,
        assignedTechnicianId: tech.assignedTechnicianId,
        _id:tech._id, 
      }));
    },

    getRepairTicketById: async (customerId: string): Promise<RepairTicket> => {
      const res:any = await instance.get(`/repairs/${customerId}`);
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of invoice repair tickets');
      }
      return res.data.map((ticket: any) => ({
        id: ticket.TicketId,
        deviceInfo: ticket.deviceInfo,
        issueDescription: ticket.issueDescription,
        assignedTechnicianId: ticket.assignedTechnicianId,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        customerId: ticket.customerId,
        customerName: ticket.customerName,
        technicianName: ticket.technicianName,
        cost: ticket.cost,
        feedback: ticket.feedback,
        requestDate: ticket.requestDate,
    
      }))
      
    },

    getInvoices: async (): Promise<RepairTicket[]> => {
      const res = await instance.get<invoice>('/repairs');
      if (!Array.isArray(res.data)) {
        throw new Error('Expected an array of invoice repair tickets');
      }
      return res.data
    },


    updateRepairTicket: async (id: string, updates: Partial<RepairTicket>): Promise<RepairTicket> => {
      console.log("id waa kan " + id)
      const response = await instance.put<RepairTicket>(`/repairs/${id}`, updates);
      return response.data;
    },
    processBlockchainPayment: async (ticketId: string, amount: number, transactionId?: string) => {
      try {
        const response = await instance.post<PaymentResponse>('/payments', {
          ticketId,
          amount,
          transactionId,
        });
        if (response.data.success && response.data.transactionId) {
          return {
            success: true,
            transactionId: response.data.transactionId,
          };
        } else {
          return { success: false };
        }
      } catch (error) {
        console.error('Blockchain payment error:', error);
        return { success: false };
      }
    },

    getRepairTicketsForTech: async (filter?: { assignedTechnicianId?: string }) => {
      const params = filter?.assignedTechnicianId ? { assignedTechnicianId: filter.assignedTechnicianId } : {};
      const response = await instance.get('/repairs', { params });
      if (!Array.isArray(response.data)) {
        throw new Error('Expected an array of invoice repair tickets');
      }

      return response.data.map((ticket: any) => ({

        id: ticket._id,
        TicketId: ticket.TicketId,
        deviceInfo: ticket.deviceInfo,
        customerName: ticket.customerName,
        issueDescription: ticket.issueDescription,
        requestDate: ticket.requestDate,
        assignedTechnicianId: ticket.assignedTechnicianId,
        status: ticket.status,
        notes: ticket.notes ?? '',
        completionDate: ticket.completionDate ?? '',
        createdAt: ticket.createdAt ?? '',
        updatedAt: ticket.updatedAt ?? '',
        cost: ticket.cost ?? 0,
        technicianName: ticket.technicianName ?? '',
      }))
    },
  
getSuppliers: async (): Promise<Supplier[]> => {
    const  data:any = await instance.get<Supplier>('/suppliers');
    return data.data.map((data: any) => ({
        id: data._id,
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
        company: data.company,
        products: data.products,
        isActive: data.isActive
      }));
  }, 

  createSupplier: async (supplierData: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await instance.post<Supplier>('/suppliers', supplierData);
    return data;
  },

  updateSupplier: async (id: string, supplierData: Partial<Supplier>): Promise<Supplier> => {
    const { data } = await instance.put<Supplier>(`/suppliers/${id}`, supplierData);
    return data;
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await instance.delete(`/suppliers/${id}`);
  },



updateTechnician: async (id: string, technicianData: Partial<TechnicianPayload>): Promise<Technician> => {
      const response = await Pinstance.put<Technician>(`/technicians/${id}`, technicianData);
      return response.data;
    },
    createTechnician: async (technicianData: TechnicianPayload): Promise<Technician> => {
      const response = await instance.post<Technician>('/technicians', technicianData);
      return response.data;
    },
deleteTech: async (id: string): Promise<void> => {
  console.log(id)
    await Pinstance.delete(`/technicians/${id}`);
  },
  }
};


