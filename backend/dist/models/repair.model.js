"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairStatus = void 0;
const mongoose_1 = require("mongoose");
var RepairStatus;
(function (RepairStatus) {
    RepairStatus["REQUESTED"] = "Requested";
    RepairStatus["IN_PROGRESS"] = "In Progress";
    RepairStatus["WAITING_FOR_PARTS"] = "Waiting for Parts";
    RepairStatus["COMPLETED"] = "Completed";
    RepairStatus["CANCELLED"] = "Cancelled";
    RepairStatus["PAID"] = "Paid";
})(RepairStatus || (exports.RepairStatus = RepairStatus = {}));
const repairSchema = new mongoose_1.Schema({
    TicketId: {
        type: String,
        required: true
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    deviceInfo: {
        type: String,
        required: true
    },
    issueDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(RepairStatus),
        default: RepairStatus.REQUESTED
    },
    assignedTechnicianId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    technicianName: String,
    requestDate: {
        type: Date,
        default: Date.now
    },
    completionDate: Date,
    cost: Number,
    notes: String
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Repair', repairSchema);
