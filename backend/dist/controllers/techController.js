"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTechnician = exports.updateTechnician = exports.getTechnicianById = exports.getAllTechnicians = exports.createTechnician = void 0;
const Technicain_1 = __importDefault(require("../models/Technicain"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_2 = require("../models/user.model");
const getNextId_1 = require("../config/getNextId");
const logEvent_1 = require("../config/logEvent");
const createTechnician = async (req, res) => {
    var _a, _b;
    try {
        const { name, email, password, contactNumber, specialization, walletAddress, availability, } = req.body;
        const technicianID = await (0, getNextId_1.getNextTechnicianId)();
        console.log(technicianID);
        // Validation
        if (!name || !email || !password || !contactNumber || !specialization || !walletAddress) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }
        // Check for existing technician or user
        const existingTech = await Technicain_1.default.findOne({ email });
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingTech || existingUser) {
            return res.status(400).json({ message: 'Technician or user already exists with this email.' });
        }
        // Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Generate unique ID for technician
        // Create technician in technician collection
        const newTechnician = new Technicain_1.default({
            id: technicianID,
            name,
            email,
            password: hashedPassword,
            contactNumber,
            specialization: specialization,
            walletAddress,
            availability,
            role: user_model_2.UserRole.TECHNICIAN,
        });
        console.log(newTechnician._id);
        const newTech = await newTechnician.save();
        if (newTech) {
            await (0, logEvent_1.logEvent)('Technician registered', (_a = req.user) === null || _a === void 0 ? void 0 : _a.email, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role, { technicianId: newTech.id, name: newTech.name });
        }
        // Also create a record in the user table
        // const newUser = new User({
        //   name,
        //   email,
        //   password: hashedPassword,
        //   contactNumber,
        //   specialization,
        //   walletAddress,
        //   role: UserRole.TECHNICIAN,
        // });
        // await newUser.save();
        // Respond without password
        const technicianResponse = {
            id: newTechnician.id,
            name: newTechnician.name,
            email: newTechnician.email,
            contactNumber: newTechnician.contactNumber,
            specialization: newTechnician.specialization,
            availability: newTechnician.availability,
            walletAddress: newTechnician.walletAddress,
            role: newTechnician.role,
        };
        console.log(technicianResponse);
        res.status(201).json(technicianResponse);
    }
    catch (err) {
        console.error('Error creating technician:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createTechnician = createTechnician;
// Get all technicians
const getAllTechnicians = async (req, res) => {
    try {
        const technicians = await Technicain_1.default.find();
        res.json(technicians);
        console.log(technicians);
    }
    catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllTechnicians = getAllTechnicians;
// Get technician by ID
const getTechnicianById = async (req, res) => {
    try {
        const technician = await Technicain_1.default.findById(req.params.id);
        if (!technician) {
            return res.status(404).json({ message: 'Technician not found' });
        }
        res.status(200).json(technician);
    }
    catch (error) {
        console.error('Error fetching technician:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTechnicianById = getTechnicianById;
// Update technician
const updateTechnician = async (req, res) => {
    try {
        const updated = await Technicain_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Technician not found' });
        }
        res.status(200).json(updated);
    }
    catch (error) {
        console.error('Error updating technician:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateTechnician = updateTechnician;
// Delete technician
const deleteTechnician = async (req, res) => {
    console.log(req.params.id);
    try {
        const deleted = await Technicain_1.default.findByIdAndDelete(req.params._id);
        if (!deleted) {
            return res.status(404).json({ message: 'Technician not found' });
        }
        // Optionally delete from users too
        await user_model_1.default.findOneAndDelete({ email: deleted.email });
        res.status(200).json({ message: 'Technician deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting technician:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteTechnician = deleteTechnician;
