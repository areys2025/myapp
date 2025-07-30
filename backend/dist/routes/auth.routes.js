"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const user_model_1 = __importDefault(require("../models/user.model"));
const adminControl_1 = require("../controllers/adminControl");
const express_1 = __importDefault(require("express"));
const forgot_password_1 = require("../controllers/forgot-password"); // adjust path
const router = express_1.default.Router();
const forgot_password_2 = require("../controllers/forgot-password");
// General Auth Routes
router.post('/login', auth_controller_1.login);
router.post('/register', auth_controller_1.register); // Handles registration for all roles
router.post('/metamask-login', auth_controller_1.metamaskLogin);
router.post("/api/regisadmin", adminControl_1.registerAdmin);
// Technician-specific routes
router.get('/technicians', auth_controller_1.getTechnicians);
router.get('/technicians/:id', auth_controller_1.getTechnicianById);
router.put('/technicians/:id', auth_controller_1.updateTechnician);
router.delete('/technicians/:id', auth_controller_1.deleteTechnician);
router.post('/forgot-password', forgot_password_1.forgotPassword);
router.post('/reset-password/:token', forgot_password_2.resetPassword);
// WARNING: This route includes passworhds - FOR DEVELOPMENT ONLY
router.get('/users', async (req, res) => {
    try {
        const users = await user_model_1.default.find({}); // Include all fields including password
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});
exports.default = router;
