
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { UserRole, Customer, Technician, RepairTicket, RepairStatus, InventoryItem, PurchaseOrder, Expense } from '../types';

// // Mock Data Store
// let mockCustomers: Customer[] = [
//   { id: 'cust1', name: 'Alice Wonderland', email: 'alice@example.com', role: UserRole.CUSTOMER, contactNumber: '555-1234', deviceType: 'iPhone 13', walletAddress: '0xAliceWalletAddress' },
//   { id: 'cust2', name: 'Bob The Builder', email: 'bob@example.com', role: UserRole.CUSTOMER, contactNumber: '555-5678', deviceType: 'Samsung Galaxy S21', walletAddress: '0xBobWalletAddress' },
// ];

// let mockTechnicians: Technician[] = [
//   { id: 'tech1', name: 'Charlie Fixit', email: 'charlie@repair.com', role: UserRole.TECHNICIAN, specialization: 'Screen Replacement', availability: true, walletAddress: '0xCharlieWalletAddress' },
//   { id: 'tech2', name: 'Diana Circuits', email: 'diana@repair.com', role: UserRole.TECHNICIAN, specialization: 'Battery Issues', availability: false, walletAddress: '0xDianaWalletAddress' },
// ];

// let mockRepairTickets: RepairTicket[] = [
//   { id: 'repair1', customerId: 'cust1', customerName: 'Alice Wonderland', deviceInfo: 'iPhone 13 - Cracked Screen', issueDescription: 'Screen is cracked after a drop.', status: RepairStatus.REQUESTED, requestDate: '2024-07-20T10:00:00Z', assignedTechnicianId: 'tech1', technicianName: 'Charlie Fixit' },
//   // { id: 'repair2', customerId: 'cust2', customerName: 'Bob The Builder', deviceInfo: 'Samsung Galaxy S21 - Battery Drain', issueDescription: 'Battery drains very quickly.', status: RepairStatus.IN_PROGRESS, requestDate: '2024-07-21T14:30:00Z', assignedTechnicianId: 'tech2', technicianName: 'Diana Circuits', cost: 75 },
//   { id: 'repair3', customerId: 'cust1', customerName: 'Alice Wonderland', deviceInfo: 'iPhone 13 - Water Damage', issueDescription: 'Phone fell in water, not turning on.', status: RepairStatus.COMPLETED, requestDate: '2024-07-15T09:00:00Z', completionDate: '2024-07-18T17:00:00Z', cost: 250, feedback: { rating: 5, comment: 'Great service!', date: '2024-07-19' } },
// ];

// let mockInventory: InventoryItem[] = [
//   { id: 'item1', name: 'iPhone 13 Screen', quantity: 10, minStockLevel: 5, price: 120, supplier: 'ScreenMasters' },
//   { id: 'item2', name: 'Galaxy S21 Battery', quantity: 3, minStockLevel: 5, price: 50, supplier: 'PowerUp Inc.' },
//   { id: 'item3', name: 'Repair Toolkit', quantity: 5, minStockLevel: 2, price: 75, supplier: 'FixItAll Tools' },
// ];
// let mockPurchaseOrders: PurchaseOrder[] = [
//     { id: 'po1', itemId: 'item2', quantity: 10, orderDate: '2024-07-18', expectedDeliveryDate: '2024-07-25', status: 'Pending', supplier: 'PowerUp Inc.', totalCost: 500},
// ];

// let mockExpenses: Expense[] = [
//     {id: 'exp1', category: 'Parts', description: 'Bulk screen order', amount: 1200, date: '2024-07-10'},
//     {id: 'exp2', category: 'Utilities', description: 'Electricity Bill', amount: 150, date: '2024-07-05'},
// ];


// const simulateDelay = <T,>(data: T, delay: number = 500): Promise<T> =>
//   new Promise(resolve => setTimeout(() => resolve(data), delay));

// export function useMockApi() {
//   // --- Repair Tickets ---
//   const getRepairTickets = useCallback(async (filters?: Partial<RepairTicket>): Promise<RepairTicket[]> => {
//     let tickets = mockRepairTickets;
//     if (filters) {
//         if (filters.customerId) tickets = tickets.filter(t => t.customerId === filters.customerId);
//         if (filters.assignedTechnicianId) tickets = tickets.filter(t => t.assignedTechnicianId === filters.assignedTechnicianId);
//         if (filters.status) tickets = tickets.filter(t => t.status === filters.status);
//       }
//     return simulateDelay(tickets.map(t => ({...t, customerName: mockCustomers.find(c => c.id === t.customerId)?.name, technicianName: mockTechnicians.find(tech => tech.id === t.assignedTechnicianId)?.name })));
//   }, []);

//   const getRepairTicketById = useCallback(async (id: string): Promise<RepairTicket | undefined> => {
//     const ticket = mockRepairTickets.find(t => t.id === id);
//     if (ticket) {
//         return simulateDelay({...ticket, customerName: mockCustomers.find(c => c.id === ticket.customerId)?.name, technicianName: mockTechnicians.find(tech => tech.id === ticket.assignedTechnicianId)?.name});
//     }
//     return simulateDelay(undefined);
//   }, []);

//   const createRepairTicket = useCallback(async (ticketData: Omit<RepairTicket, 'id' | 'requestDate' | 'status' | 'customerName' | 'technicianName'>): Promise<RepairTicket> => {
//     const newTicket: RepairTicket = {
//       ...ticketData,
//       id: `repair${Date.now()}`,
//       requestDate: new Date().toISOString(),
//       status: RepairStatus.REQUESTED,
//       customerName: mockCustomers.find(c => c.id === ticketData.customerId)?.name,
//     };
//     mockRepairTickets.push(newTicket);
//     return simulateDelay(newTicket);
//   }, []);

//   const updateRepairTicket = useCallback(async (id: string, updates: Partial<RepairTicket>): Promise<RepairTicket | undefined> => {
//     const index = mockRepairTickets.findIndex(t => t.id === id);
//     if (index > -1) {
//       mockRepairTickets[index] = { ...mockRepairTickets[index], ...updates };
//       if (updates.assignedTechnicianId) {
//         mockRepairTickets[index].technicianName = mockTechnicians.find(tech => tech.id === updates.assignedTechnicianId)?.name;
//       }
//       return simulateDelay(mockRepairTickets[index]);
//     }
//     return simulateDelay(undefined);
//   }, []);

//   const addRepairFeedback = useCallback(async (ticketId: string, feedback: RepairTicket['feedback']): Promise<RepairTicket | undefined> => {
//     const index = mockRepairTickets.findIndex(t => t.id === ticketId);
//     if (index > -1) {
//       mockRepairTickets[index].feedback = feedback;
//       return simulateDelay(mockRepairTickets[index]);
//     }
//     return simulateDelay(undefined);
//   }, []);

//   // --- Inventory ---
//   const getInventoryItems = useCallback(async (): Promise<InventoryItem[]> => {
//     return simulateDelay([...mockInventory]);
//   }, []);

//   const addInventoryItem = useCallback(async (itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
//     const newItem: InventoryItem = { ...itemData, id: `item${Date.now()}` };
//     mockInventory.push(newItem);
//     return simulateDelay(newItem);
//   }, []);
  
//   const updateInventoryItem = useCallback(async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined> => {
//     const index = mockInventory.findIndex(item => item.id === id);
//     if (index > -1) {
//       mockInventory[index] = { ...mockInventory[index], ...updates };
//       return simulateDelay(mockInventory[index]);
//     }
//     return simulateDelay(undefined);
//   }, []);


//   // --- Technicians ---
//   const getTechnicians = useCallback(async (): Promise<Technician[]> => {
//     return simulateDelay([...mockTechnicians]);
//   }, []);

//   // --- Customers (basic) ---
//    const getCustomerById = useCallback(async (id: string): Promise<Customer | undefined> => {
//     return simulateDelay(mockCustomers.find(c => c.id === id));
//   }, []);

//   const registerCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'role' | 'walletAddress'>) : Promise<Customer> => {
//     const newCustomer: Customer = {
//         ...customerData,
//         id: `cust${Date.now()}`,
//         role: UserRole.CUSTOMER,
//         walletAddress: `0xSimulated${Date.now()}` // Simulate wallet generation
//     };
//     mockCustomers.push(newCustomer);
//     return simulateDelay(newCustomer);
//   }, []);


//   // --- Purchase Orders ---
//   const getPurchaseOrders = useCallback(async (): Promise<PurchaseOrder[]> => {
//     return simulateDelay(mockPurchaseOrders.map(po => ({...po, itemName: mockInventory.find(item => item.id === po.itemId)?.name})));
//   }, []);

//   const createPurchaseOrder = useCallback(async (orderData: Omit<PurchaseOrder, 'id' | 'itemName'>): Promise<PurchaseOrder> => {
//     const newOrder: PurchaseOrder = { 
//         ...orderData, 
//         id: `po${Date.now()}`,
//         itemName: mockInventory.find(item => item.id === orderData.itemId)?.name
//     };
//     mockPurchaseOrders.push(newOrder);
//     return simulateDelay(newOrder);
//   }, []);

//   // --- Expenses ---
//   const getExpenses = useCallback(async (): Promise<Expense[]> => {
//     return simulateDelay([...mockExpenses]);
//   }, []);

//   const addExpense = useCallback(async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
//     const newExpense: Expense = { ...expenseData, id: `exp${Date.now()}` };
//     mockExpenses.push(newExpense);
//     return simulateDelay(newExpense);
//   }, []);

//   // --- Financials (Simulated Payment) ---
//   const processBlockchainPayment = useCallback(async (ticketId: string, amount: number): Promise<{success: boolean, transactionId?: string}> => {
//     console.log(`Simulating blockchain payment for ticket ${ticketId}, amount ${amount}`);
//     // Simulate network delay and success/failure
//     await simulateDelay(null, 1500); 
//     const success = Math.random() > 0.1; // 90% success rate
//     if (success) {
//       // Update ticket status to PAID
//       const ticketIndex = mockRepairTickets.findIndex(t => t.id === ticketId);
//       if (ticketIndex > -1) {
//         mockRepairTickets[ticketIndex].status = RepairStatus.PAID;
//       }
//       return { success: true, transactionId: `0xSimTx${Date.now()}`};
//     } else {
//       return { success: false };
//     }
//   }, []);

//   // Raw data for reports (simplified) - Wrap in useCallback for stability
//   const getAllRepairTicketsSync = useCallback(() => mockRepairTickets, []);
//   const getAllInventoryItemsSync = useCallback(() => mockInventory, []);
//   const getAllTechniciansSync = useCallback(() => mockTechnicians, []);

//   const apiObject = useMemo(() => ({
//     getRepairTickets,
//     getRepairTicketById,
//     createRepairTicket,
//     updateRepairTicket,
//     addRepairFeedback,
//     getInventoryItems,
//     addInventoryItem,
//     updateInventoryItem,
//     getTechnicians,
//     getCustomerById,
//     registerCustomer,
//     getPurchaseOrders,
//     createPurchaseOrder,
//     getExpenses,
//     addExpense,
//     processBlockchainPayment,
//     getAllRepairTickets: getAllRepairTicketsSync,
//     getAllInventoryItems: getAllInventoryItemsSync,
//     getAllTechnicians: getAllTechniciansSync,
//   }), [
//     getRepairTickets,
//     getRepairTicketById,
//     createRepairTicket,
//     updateRepairTicket,
//     addRepairFeedback,
//     getInventoryItems,
//     addInventoryItem,
//     updateInventoryItem,
//     getTechnicians,
//     getCustomerById,
//     registerCustomer,
//     getPurchaseOrders,
//     createPurchaseOrder,
//     getExpenses,
//     addExpense,
//     processBlockchainPayment,
//     getAllRepairTicketsSync,
//     getAllInventoryItemsSync,
//     getAllTechniciansSync,
//   ]);

//   return apiObject;
// }
