import express from 'express';
import { authenticateToken } from '../middleware/auth';
import SystemLog from '../models/SystemLog';

const router = express.Router();

/**
 * GET /api/system-logs
 * Returns a list of system logs sorted by latest timestamp
 * Optional: only for Managers
 */

router.get('/', authenticateToken, async (req, res) => {
  try {
    // Optional: allow only managers to see logs
    if (req.user?.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const logs = await SystemLog.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const logs = await SystemLog.create(req.body);
//     res.status(200).json(logs);
//   } catch (err) {
//     console.error('Error creating logs:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


export default router;
