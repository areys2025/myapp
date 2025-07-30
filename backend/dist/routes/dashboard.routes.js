"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const repair_model_1 = __importDefault(require("../models/repair.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const router = express_1.default.Router();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        // Basic repair counts
        const totalRepairs = await repair_model_1.default.countDocuments();
        const activeRepairs = await repair_model_1.default.countDocuments({ status: { $nin: ['Completed', 'Cancelled'] } });
        const completedRepairs = await repair_model_1.default.countDocuments({ status: 'Completed' });
        // Count users by role
        const totalCustomers = await user_model_1.default.countDocuments({ role: 'customer' });
        const totalTechnicians = await user_model_1.default.countDocuments({ role: 'technician' });
        // Recent repairs (e.g., last 5)
        const recentRepairs = await repair_model_1.default.find()
            .sort({ requestDate: -1 })
            .limit(5)
            .select('customerName deviceInfo status requestDate');
        // Monthly stats (repairs + revenue)
        const now = new Date();
        const currentYear = now.getFullYear();
        const monthlyStats = await repair_model_1.default.aggregate([
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
    }
    catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ error: 'Server error fetching dashboard stats' });
    }
});
exports.default = router;
