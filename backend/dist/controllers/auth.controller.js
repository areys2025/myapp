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
exports.metamaskLogin = exports.deleteTechnician = exports.updateTechnician = exports.getTechnicianById = exports.getTechnicians = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importStar(require("../models/user.model"));
const ethers_1 = require("ethers");
const Technicain_1 = __importDefault(require("../models/Technicain"));
const logEvent_1 = require("../config/logEvent");
// Helper function to format user response based on role
const formatUserResponse = (user, token) => {
    // Base user data that all roles share
    const baseUser = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
    };
    // Add role-specific fields
    switch (user.role) {
        case user_model_1.UserRole.CUSTOMER:
            return {
                token,
                user: Object.assign(Object.assign({}, baseUser), { contactNumber: user.contactNumber || '', role: user_model_1.UserRole.CUSTOMER // Using enum value directly
                 })
            };
        case user_model_1.UserRole.TECHNICIAN:
            return {
                token,
                user: Object.assign(Object.assign({}, baseUser), { specialization: user.specialization, availability: user.availability, role: user_model_1.UserRole.TECHNICIAN // Using enum value directly
                 })
            };
        case user_model_1.UserRole.MANAGER:
            return {
                token,
                user: Object.assign(Object.assign({}, baseUser), { role: user_model_1.UserRole.MANAGER // Using enum value directly
                 })
            };
        default:
            return {
                token,
                user: baseUser
            };
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await user_model_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Verify password
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '24h' });
        if (token) {
            await (0, logEvent_1.logEvent)('User login', user === null || user === void 0 ? void 0 : user.email, user === null || user === void 0 ? void 0 : user.role, { userInfo: user._id, name: user.name });
        }
        // Send formatted response with role-specific data
        res.json(formatUserResponse(user, token));
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { email, password, name, role, walletAddress, contactNumber, specialization, availability } = req.body;
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({
            $or: [
                { email: email.toLowerCase() },
                { walletAddress }
            ]
        });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email or wallet address' });
            return;
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user with role-specific fields
        const userData = Object.assign(Object.assign({ email: email.toLowerCase(), password: hashedPassword, name,
            role,
            walletAddress }, (role === user_model_1.UserRole.CUSTOMER ? {
            contactNumber: contactNumber || '',
        } : {})), (role === user_model_1.UserRole.TECHNICIAN ? {
            specialization,
            availability: availability !== undefined ? availability : true
        } : {}));
        const user = new user_model_1.default(userData);
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '24h' });
        // Send formatted response with role-specific data
        res.status(201).json(formatUserResponse(user, token));
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Registration failed'
        });
    }
};
exports.register = register;
const getTechnicians = async (req, res) => {
    try {
        // Fetch users with the 'Technician' role, excluding their passwords
        const technicians = await user_model_1.default.find({ role: user_model_1.UserRole.TECHNICIAN }).select('-password');
        res.status(200).json(technicians);
    }
    catch (error) {
        console.error('Get technicians error:', error);
        res.status(500).json({ message: 'Failed to retrieve technicians' });
    }
};
exports.getTechnicians = getTechnicians;
const getTechnicianById = async (req, res) => {
    try {
        const { id } = req.params;
        const technician = await user_model_1.default.findOne({ _id: id, role: user_model_1.UserRole.TECHNICIAN }).select('-password');
        if (!technician) {
            res.status(404).json({ message: 'Technician not found' });
            return;
        }
        res.status(200).json(technician);
    }
    catch (error) {
        console.error(`Get technician by ID error:`, error);
        res.status(500).json({ message: 'Failed to retrieve technician' });
    }
};
exports.getTechnicianById = getTechnicianById;
const updateTechnician = async (req, res) => {
    var _a;
    try {
        const { id } = req.params;
        const { name, email, contactNumber, specialization, availability, password } = req.body;
        // Find the technician to ensure they exist
        const technician = await user_model_1.default.findOne({ _id: id, role: user_model_1.UserRole.TECHNICIAN });
        if (!technician) {
            res.status(404).json({ message: 'Technician not found' });
            return;
        }
        // Prepare data for update
        const updateData = {
            name,
            email: email.toLowerCase(),
            contactNumber,
            specialization,
            availability,
        };
        // If a new password is provided, validate and hash it
        if (password) {
            if (password.length < 6) {
                res.status(400).json({ message: 'Password must be at least 6 characters long.' });
                return;
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            updateData.password = await bcryptjs_1.default.hash(password, salt);
        }
        // Perform the update
        const updatedTechnician = await user_model_1.default.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (!updatedTechnician) {
            res.status(404).json({ message: 'Failed to update technician' });
            return;
        }
        res.status(200).json(updatedTechnician);
    }
    catch (error) {
        console.error('Update technician error:', error);
        // Handle potential duplicate email errors
        if (error.code === 11000 && ((_a = error.keyPattern) === null || _a === void 0 ? void 0 : _a.email)) {
            res.status(400).json({ message: 'This email address is already in use.' });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateTechnician = updateTechnician;
// Delete technician
const deleteTechnician = async (req, res) => {
    console.log("three controls");
    try {
        const deleted = await Technicain_1.default.findByIdAndDelete(req.params.id);
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
const metamaskLogin = async (req, res) => {
    try {
        const { address, signature, message } = req.body;
        if (!address || !signature || !message) {
            return res.status(400).json({ message: 'Missing MetaMask login data' });
        }
        const recovered = ethers_1.ethers.verifyMessage(message, signature);
        console.log('Recovered address:', recovered);
        console.log('Provided address:', address);
        if (recovered.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ message: 'Invalid signature' });
        }
        let user = await user_model_1.default.findOne({ walletAddress: address });
        if (!user) {
            return res.status(404).json({ message: 'User not found for this wallet. Please register first.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
        if (token) {
            await (0, logEvent_1.logEvent)('User login', user === null || user === void 0 ? void 0 : user.email, user === null || user === void 0 ? void 0 : user.role, { userInfo: user._id, name: user.name });
        }
        res.status(200).json({
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                walletAddress: user.walletAddress
            }
        });
    }
    catch (error) {
        console.error('MetaMask login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.metamaskLogin = metamaskLogin;
