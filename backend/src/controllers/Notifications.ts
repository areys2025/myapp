import { Request, Response } from "express";
import Notification from "../models/Notifications.model"; // adjust path to your model

// GET notifications for a specific customer
export const getCustomerNotifications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // customerId
    const notifications = await Notification.find({ customerId: id })
      .sort({ date: -1 }); // latest first

    return res.json(notifications); // ✅ send array directly
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Error fetching notifications" });
  }
};

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
