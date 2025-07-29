import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Repair from '../models/repair.model';
import User from '../models/user.model';
import { startOfMonth, endOfMonth } from 'date-fns';

import { getDashboardStats } from '../controllers/dashboard.controller';

const router = express.Router();



router.get('/', authenticateToken, async (req, res) => {
  try {
    // Basic repair counts
    const totalRepairs = await Repair.countDocuments();
    const activeRepairs = await Repair.countDocuments({ status: { $nin: ['Completed', 'Cancelled'] } });
    const completedRepairs = await Repair.countDocuments({ status: 'Completed' });

    // Count users by role
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });

    // Recent repairs (e.g., last 5)
    const recentRepairs = await Repair.find()
      .sort({ requestDate: -1 })
      .limit(5)
      .select('customerName deviceInfo status requestDate');

    // Monthly stats (repairs + revenue)
    const now = new Date();
    const currentYear = now.getFullYear();

    const monthlyStats = await Repair.aggregate([
      {
        $match: {
          requestDate: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$requestDate' },
            year: { $year: '$requestDate' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$price' }, // Make sure `price` field exists in Repair model
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);
    res.json({
      stats: {
        totalRepairs,
        activeRepairs,
        completedRepairs,
        totalCustomers,
        totalTechnicians,
      },
      recentRepairs,
      monthlyStats,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Server error fetching dashboard stats' });
  }
});

export default router;
