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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTechnicianAvailability = exports.getTechnicians = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.changeUserPassword = exports.updateUserProfile = void 0;
const user_model_1 = __importStar(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Update profile info
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updated = await user_model_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'User not found' });
        res.json(updated);
    }
    catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};
exports.updateUserProfile = updateUserProfile;
// Change password
const changeUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        const user = await user_model_1.default.findById(id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Incorrect current password' });
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password changed successfully' });
    }
    catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Server error while changing password' });
    }
};
exports.changeUserPassword = changeUserPassword;
// Get all users (with optional filters)
const getUsers = async (req, res) => {
    try {
        const filters = req.query;
        const users = await user_model_1.default.find(filters).select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};
exports.getUsers = getUsers;
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};
exports.getUserById = getUserById;
// Update user
const updateUser = async (req, res) => {
    try {
        const _a = req.body, { password } = _a, updateData = __rest(_a, ["password"]);
        const user = await user_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating user' });
    }
};
exports.updateUser = updateUser;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await user_model_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
// Get all technicians
const getTechnicians = async (req, res) => {
    try {
        const technicians = await user_model_1.default.find({
            role: user_model_1.UserRole.TECHNICIAN
        }).select('-password');
        res.json(technicians);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching technicians' });
    }
};
exports.getTechnicians = getTechnicians;
// Update technician availability
const updateTechnicianAvailability = async (req, res) => {
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
exports.updateTechnicianAvailability = updateTechnicianAvailability;
