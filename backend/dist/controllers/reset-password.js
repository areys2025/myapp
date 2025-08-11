"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model")); // Adjust path if needed
const logEvent_1 = require("../config/logEvent");
const resetPassword = async (req, res) => {
    var _a, _b;
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    try {
        // Validation
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        // Find user by token and check expiration
        const user = await user_model_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }, // still valid
        });
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or expired' });
        }
        console.log(token);
        // Hash new password
        user.password = await bcryptjs_1.default.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        const passChange = await user.save();
        if (passChange) {
            await (0, logEvent_1.logEvent)('user changed password', (_a = req.user) === null || _a === void 0 ? void 0 : _a.email, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role, { technicianId: user._id, name: user.name });
        }
        return res.status(200).json({ message: 'Password has been reset successfully' });
    }
    catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ message: 'Server error during password reset' });
    }
};
exports.resetPassword = resetPassword;
