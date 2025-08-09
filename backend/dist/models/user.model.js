"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
// Define UserRole enum to match frontend
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "Customer";
    UserRole["TECHNICIAN"] = "Technician";
    UserRole["MANAGER"] = "Manager";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Customer', 'Technician', 'Manager']
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    // Additional fields based on role
    contactNumber: {
        type: String,
        required: false // Make optional and handle in business logic
    },
    specialization: {
        type: Array,
        required: false // Make optional and handle in business logic
    },
    availability: {
        type: Boolean,
        default: true,
        required: false // Make optional and handle in business logic
    }
}, {
    timestamps: true
});
// Add middleware to validate role-specific fields
userSchema.pre('save', function (next) {
    if (this.role === UserRole.CUSTOMER) {
        if (!this.contactNumber) {
            next(new Error('Customer requires contactNumber'));
            return;
        }
    }
    if (this.role === UserRole.TECHNICIAN) {
        if (!this.specialization) {
            next(new Error('Technician requires specialization'));
            return;
        }
    }
    next();
});
exports.default = (0, mongoose_1.model)('User', userSchema);
