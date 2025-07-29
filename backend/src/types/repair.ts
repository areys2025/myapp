

  export interface RepairTicket {
    id: string;
      tiketid: number;
    customerId?: string;
    customerName: string;
    deviceInfo: string;
    issueDescription: string;
    status: string;
    requestDate: string;
    completionDate?: string;
    technicianName?: string;
    cost?: number;
    feedback?: string;
    notes?: string;
  }
  