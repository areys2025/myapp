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
exports.updateAdminAvailability = exports.deleteAdmin = exports.updateAdmin = exports.getAllAdmins = exports.registerAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importStar(require("../models/user.model"));
const Admin_1 = __importDefault(require("../models/Admin"));
const logEvent_1 = require("../config/logEvent");
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, contactNumber, walletAddress, availability, } = req.body;
        // Validation
        if (!name || !email || !password || !confirmPassword || !contactNumber || !walletAddress || availability) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'Email already registered' });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Save to users collection
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            contactNumber,
            walletAddress,
            role: user_model_1.UserRole.MANAGER, // you may want to update this if it's wrong
        });
        await newUser.save();
        // Save to admins collection
        const admin = await Admin_1.default.create({
            name,
            email,
            password: hashedPassword,
            contactNumber,
            walletAddress,
            role: user_model_1.UserRole.MANAGER,
            availability,
        });
        if (admin) {
            await (0, logEvent_1.logEvent)('Admin deleted', req.body.LoginfoEml, req.body.LoginfoRle, { deletedAdminId: admin.id });
        }
        res.status(201).json({
            message: 'Admin registered successfully',
            adminId: admin._id,
        });
    }
    catch (err) {
        console.error('Admin Registration Error:', err);
        res.status(500).json({ message: 'Server error while registering admin' });
    }
};
exports.registerAdmin = registerAdmin;
const getAllAdmins = async (_req, res) => {
    try {
        const AllAdmins = await Admin_1.default.find();
        res.json(AllAdmins);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch admins', error });
    }
};
exports.getAllAdmins = getAllAdmins;
const updateAdmin = async (_req, res) => {
    try {
        const updated = await Admin_1.default.findByIdAndUpdate(_req.params.id, _req.body, { new: true });
        if (updated) {
            await (0, logEvent_1.logEvent)('Admin updated', _req.body.LoginfoEml, _req.body.LoginfoRle, { deletedAdminId: updated.id });
        }
        if (!updated) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(updated);
    }
    catch (error) {
        console.error('Error updating Admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateAdmin = updateAdmin;
const deleteAdmin = async (req, res) => {
    console.log("three controls");
    try {
        const deleted = await Admin_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Technician not found' });
        }
        await user_model_1.default.findOneAndDelete({ email: deleted.email });
        res.status(200).json({ message: 'Technician deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting Admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteAdmin = deleteAdmin;
const updateAdminAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        const technician = await user_model_1.default.findOneAndUpdate({ _id: req.params.id, role: user_model_1.UserRole.TECHNICIAN }, { availability }, { new: true }).select('-password');
        if (!technician) {
            return res.status(404).json({ message: 'Technician not found' });
        }
        res.json(technician);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating technician availability' });
    }
};
exports.updateAdminAvailability = updateAdminAvailability;
