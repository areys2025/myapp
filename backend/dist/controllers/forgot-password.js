"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mailer_1 = require("../config/mailer");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const token = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await mailer_1.transporter.sendMail({
            to: user.email,
            subject: 'Reset your password',
            html: `
        <p>Hello ${user.name || 'user'},</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
        });
        return res.status(200).json({ message: 'Reset email sent successfully' });
    }
    catch (err) {
        console.error('Email sending error:', err);
        return res.status(500).json({ message: 'Failed to send reset email' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    try {
        if (!password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const user = await user_model_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }, // token still valid
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        // Invalidate token after use
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(200).json({ message: 'Password has been reset successfully' });
    }
    catch (err) {
        console.error('Password reset error:', err);
        return res.status(500).json({ message: 'Server error during password reset' });
    }
};
exports.resetPassword = resetPassword;
