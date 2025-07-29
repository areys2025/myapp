import { Request, Response } from 'express';
import Repair, { RepairStatus } from '../models/repair.model';
import User from '../models/user.model';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalRepairs,
      activeRepairs,
      completedRepairs,
      totalCustomers,
      totalTechnicians,
      recentRepairs
    ] = await Promise.all([
      Repair.countDocuments(),
      Repair.countDocuments({ status: { $in: [RepairStatus.REQUESTED, RepairStatus.IN_PROGRESS, RepairStatus.WAITING_FOR_PARTS] } }),
      Repair.countDocuments({ status: RepairStatus.COMPLETED }),
      User.countDocuments({ role: 'Customer' }),
      User.countDocuments({ role: 'Technician' }),
      Repair.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id customerName deviceInfo status requestDate')
    ]);
    const monthlyStats = await Repair.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$requestDate' },
            year: { $year: '$requestDate' }
          },
          count: { $sum: 1 },
          revenue: { $sum: { $ifNull: ['$cost', 0] } }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      stats: {
        totalRepairs,
        activeRepairs,
        completedRepairs,
        totalCustomers,
        totalTechnicians
      },
      recentRepairs,
      monthlyStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }


  
};
