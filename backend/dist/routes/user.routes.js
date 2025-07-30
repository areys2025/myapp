"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const forgot_password_1 = require("../controllers/forgot-password");
const user_controller_1 = require("../controllers/user.controller");
const user_controller_2 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// User management routes
router.get('/users', auth_1.authenticateToken, user_controller_1.getUsers);
router.get('/technicians', user_controller_1.getTechnicians);
router.get('/:id', user_controller_1.getUserById);
router.patch('/:id', user_controller_1.updateUser);
router.delete('/:id', user_controller_1.deleteUser);
router.put('/:id', auth_1.authenticateToken, user_controller_2.updateUserProfile);
router.patch('/technicians/:id/availability', user_controller_1.updateTechnicianAvailability);
router.patch('/registAdmin/:id/availability', user_controller_1.updateTechnicianAvailability);
router.put('/:id', user_controller_2.updateUserProfile); // Profile update
router.put('/:id/password', user_controller_2.changeUserPassword); // Password update
router.post('/forgot-password', forgot_password_1.forgotPassword);
exports.default = router;
