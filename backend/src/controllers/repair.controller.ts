import { Request, Response } from 'express';
import Repair, { RepairStatus } from '../models/repair.model';
import User from '../models/user.model';
import RepairTicket from '../models/repair.model';
import mongoose from 'mongoose';
import { logEvent } from '../config/logEvent';




export const getRepairById = async (req: Request, res: Response) => {
  try {
    const { customerId, status } = req.query;

    const query: any = {};

    if (customerId && mongoose.Types.ObjectId.isValid(customerId as string)) {
      query.customerId = new mongoose.Types.ObjectId(customerId as string);
    }

    if (status) {
      query.status = status;
    }

    console.log('Query used:', query); // ✅ Confirm what Mongo sees

    const repairs = await Repair.find(query);
    res.status(200).json(repairs);
  } catch (error) {
    console.error('Error fetching repair tickets:', error);
    res.status(500).json({ message: 'Failed to fetch repair tickets' });
  }
};



export const getRepairTicketsForTech = async (req: Request, res: Response) => {
  try {
    const filter: any = {};

    if (req.query.assignedTechnicianId) {
      filter.assignedTechnicianId = req.query.assignedTechnicianId;
    }

    // You can filter out completed, cancelled, paid here too
    filter.status = { $nin: ['COMPLETED', 'CANCELLED', 'PAID'] };

    const tickets = await Repair.find(filter).lean();
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch repair tickets.' });
  }
};


// Update repair status
export const updateRepairStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const repair = await Repair.findById(req.params.customerId);
    
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    repair.status = status;
    if (status === RepairStatus.COMPLETED) {
      repair.completionDate = new Date();
    }
    
    await repair.save();
    res.json(repair);
  } catch (error) {
    res.status(400).json({ message: 'Error updating repair status' });
  }
};

// Assign technician to repair
export const assignTechnician = async (req: Request, res: Response) => {
  try {
    const { technicianId } = req.body;
        console.log(technicianId);
const repair = await Repair.findById(req.params.id);
    const technician = await User.findById(technicianId);
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    repair.assignedTechnicianId = technicianId;
    repair.technicianName = technician.name;
    repair.status = RepairStatus.IN_PROGRESS;
    
    await repair.save();
    res.json(repair);
  } catch (error) {
    res.status(400).json({ message: 'Error assigning technician' });
  }
};

// Add repair notes
export const addRepairNotes = async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    const repair = await Repair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }
    repair.notes = notes;
    await repair.save();
    res.json(repair);
  } catch (error) {
    res.status(400).json({ message: 'Error updating repair notes' });
  }
};


// Create a new repair request
export const createRepair = async (req: Request, res: Response) => {
  const { customerId, customerName, deviceInfo, issueDescription } = req.body;

  if (!customerId || !customerName || !deviceInfo || !issueDescription) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
console.log("Incoming repair request body:", req.body);

  try {
    const count = await Repair.countDocuments();
    const TicketId = `rep${count + 1}`;

    const repair = await Repair.create({
      customerId,
      customerName,
      deviceInfo,
      issueDescription,
      status: RepairStatus.REQUESTED,
      TicketId,
      requestDate: new Date(),
    });

const eml=req.body.LoginfoEml;
const rle=req.body.LoginfoRle;
console.log(eml)
if(repair){
  await logEvent(
  'Repair ticket created',
  req.body.LoginfoEml,
  req.body.LoginfoRle,
  { ticketId: repair.TicketId }
);
}

    res.status(201).json(repair);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating repair request' });
  }
};

export const getRepairTickets = async (_req: Request, res: Response) => {
  try {
    const repairs = await Repair.find().sort({ requestDate: -1 });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch repairs', error });
  }
};



export const updateRepair = async (req: Request, res: Response) => {
  const { _id } = req.params;
if (!mongoose.Types.ObjectId.isValid(_id)) {
  return res.status(400).json({ message: 'Invalid ID format' });
}console.log('Update attempt for ID:', _id);
  try {
    const updatedTicket = await RepairTicket.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    // Optionally add a check to confirm it's a valid ObjectId

if(updatedTicket){
  await logEvent(
  'Repair assigned for technician',
  req.body.LoginfoEml,
  req.body.LoginfoRle,
  { ticketId: updatedTicket.TicketId }
);
}
    if (!updatedTicket) {
      return res.status(404).json({ message: 'Repair ticket not found' });
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error('Update Repair Error:', error);
    res.status(500).json({ message: 'Failed to update repair ticket' });
  }
};

export const updateRepairByTicketId = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const updates = req.body;
  console.log(_id)
  try {
    const repair = await Repair.findOneAndUpdate(
      { TicketId: _id },
      updates,
      { new: true }
    );
console.log(repair?.issueDescription);

console.log(_id)
    if (!repair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    res.json(repair);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update repair.' });
  }
};


// Update repair cost
// export const updateRepairCost = async (req: Request, res: Response) => {
//   try {
//     const { cost } = req.body;
//     const repair = await Repair.findById(req.params.id);
    
//     if (!repair) {
//       return res.status(404).json({ message: 'Repair not found' });
//     }

//     repair.cost = cost;
//     await repair.save();
//     res.json(repair);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating repair cost' });
//   }


  
// }; 

