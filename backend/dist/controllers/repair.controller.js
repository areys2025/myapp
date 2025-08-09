"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRepairByTicketId = exports.updateRepair = exports.getRepairTickets = exports.createRepair = exports.addRepairNotes = exports.assignTechnician = exports.updateRepairStatus = exports.getRepairTicketsForTech = exports.getRepairById = void 0;
const repair_model_1 = __importStar(require("../models/repair.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const repair_model_2 = __importDefault(require("../models/repair.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const logEvent_1 = require("../config/logEvent");
const getRepairById = async (req, res) => {
    try {
        const { customerId, status } = req.query;
        const query = {};
        if (customerId && mongoose_1.default.Types.ObjectId.isValid(customerId)) {
            query.customerId = new mongoose_1.default.Types.ObjectId(customerId);
        }
        if (status) {
            query.status = status;
        }
        console.log('Query used:', query); // ✅ Confirm what Mongo sees
        const repairs = await repair_model_1.default.find(query);
        res.status(200).json(repairs);
    }
    catch (error) {
        console.error('Error fetching repair tickets:', error);
        res.status(500).json({ message: 'Failed to fetch repair tickets' });
    }
};
exports.getRepairById = getRepairById;
// export const getRepairTicketsForTech = async (req: Request, res: Response) => {
//   try {
//     const filter: any = {};
//     if (req.query.assignedTechnicianId) {
//       filter.assignedTechnicianId = req.query.assignedTechnicianId;
//     }
//     // You can filter out completed, cancelled, paid here too
//     filter.status = { $nin: ['COMPLETED', 'CANCELLED', 'PAID'] };
//     const tickets = await Repair.find(filter).lean();
//     res.status(200).json(tickets);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch repair tickets.' });
//   }
// };
const getRepairTicketsForTech = async (req, res) => {
    try {
        const filter = {};
        if (req.query.assignedTechnicianId) {
            filter.assignedTechnicianId = req.query.assignedTechnicianId;
        }
        // You can filter out completed, cancelled, paid here too
        filter.status = { $nin: ['COMPLETED', 'CANCELLED', 'PAID'] };
        const tickets = await repair_model_1.default.find(filter).lean();
        res.status(200).json(tickets);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch repair tickets.' });
    }
};
exports.getRepairTicketsForTech = getRepairTicketsForTech;
// Update repair status
const updateRepairStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const repair = await repair_model_1.default.findById(req.params.customerId);
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        repair.status = status;
        if (status === repair_model_1.RepairStatus.COMPLETED) {
            repair.completionDate = new Date();
        }
        await repair.save();
        res.json(repair);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating repair status' });
    }
};
exports.updateRepairStatus = updateRepairStatus;
// Assign technician to repair
const assignTechnician = async (req, res) => {
    try {
        const { technicianId } = req.body;
        console.log(technicianId);
        const repair = await repair_model_1.default.findById(req.params.id);
        const technician = await user_model_1.default.findById(technicianId);
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        if (!technician) {
            return res.status(404).json({ message: 'Technician not found' });
        }
        repair.assignedTechnicianId = technicianId;
        repair.technicianName = technician.name;
        repair.status = repair_model_1.RepairStatus.IN_PROGRESS;
        await repair.save();
        res.json(repair);
    }
    catch (error) {
        res.status(400).json({ message: 'Error assigning technician' });
    }
};
exports.assignTechnician = assignTechnician;
// Add repair notes
const addRepairNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const repair = await repair_model_1.default.findById(req.params.id);
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        repair.notes = notes;
        await repair.save();
        res.json(repair);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating repair notes' });
    }
};
exports.addRepairNotes = addRepairNotes;
// Create a new repair request
const createRepair = async (req, res) => {
    const { customerId, customerName, deviceInfo, issueDescription } = req.body;
    if (!customerId || !customerName || !deviceInfo || !issueDescription) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    console.log("Incoming repair request body:", req.body);
    try {
        const count = await repair_model_1.default.countDocuments();
        const TicketId = `rep${count + 1}`;
        const repair = await repair_model_1.default.create({
            customerId,
            customerName,
            deviceInfo,
            issueDescription,
            status: repair_model_1.RepairStatus.REQUESTED,
            TicketId,
            requestDate: new Date(),
        });
        const eml = req.body.LoginfoEml;
        const rle = req.body.LoginfoRle;
        console.log(eml);
        if (repair) {
            await (0, logEvent_1.logEvent)('Repair ticket created', req.body.LoginfoEml, req.body.LoginfoRle, { ticketId: repair.TicketId });
        }
        res.status(201).json(repair);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error creating repair request' });
    }
};
exports.createRepair = createRepair;
const getRepairTickets = async (_req, res) => {
    try {
        const repairs = await repair_model_1.default.find().sort({ requestDate: -1 });
        res.json(repairs);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch repairs', error });
    }
};
exports.getRepairTickets = getRepairTickets;
const updateRepair = async (req, res) => {
    const { _id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    console.log('Update attempt for ID:', _id);
    try {
        const updatedTicket = await repair_model_2.default.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true,
        });
        // Optionally add a check to confirm it's a valid ObjectId
        if (updatedTicket) {
            await (0, logEvent_1.logEvent)('Repair assigned for technician', req.body.LoginfoEml, req.body.LoginfoRle, { ticketId: updatedTicket.TicketId });
        }
        if (!updatedTicket) {
            return res.status(404).json({ message: 'Repair ticket not found' });
        }
        res.json(updatedTicket);
    }
    catch (error) {
        console.error('Update Repair Error:', error);
        res.status(500).json({ message: 'Failed to update repair ticket' });
    }
};
exports.updateRepair = updateRepair;
const updateRepairByTicketId = async (req, res) => {
    const { _id } = req.params;
    const updates = req.body;
    console.log(_id);
    try {
        const repair = await repair_model_1.default.findOneAndUpdate({ TicketId: _id }, updates, { new: true });
        console.log(repair === null || repair === void 0 ? void 0 : repair.issueDescription);
        console.log(_id);
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json(repair);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update repair.' });
    }
};
exports.updateRepairByTicketId = updateRepairByTicketId;
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
