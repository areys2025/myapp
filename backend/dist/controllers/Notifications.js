"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerNotifications = void 0;
const Notifications_model_1 = __importDefault(require("../models/Notifications.model")); // adjust path to your model
// GET notifications for a specific customer
const getCustomerNotifications = async (req, res) => {
    try {
        const { id } = req.params; // customerId
        const notifications = await Notifications_model_1.default.find({ customerId: id })
            .sort({ date: -1 }); // latest first
        return res.json(notifications); // ✅ send array directly
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Error fetching notifications" });
    }
};
exports.getCustomerNotifications = getCustomerNotifications;
// Mark as read
// router.put('/:id/read', authenticateToken, async (req, res) => {
//   try {
//     const notification = await Notification.findByIdAndUpdate(
//       req.params.id,
//       { isRead: true },
//       { new: true }
//     );
//     res.json(notification);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to mark notification as read' });
//   }
// });
