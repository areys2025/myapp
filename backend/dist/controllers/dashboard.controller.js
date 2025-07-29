"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const repair_model_1 = __importStar(require("../models/repair.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getDashboardStats = async (req, res) => {
    try {
        const [totalRepairs, activeRepairs, completedRepairs, totalCustomers, totalTechnicians, recentRepairs] = await Promise.all([
            repair_model_1.default.countDocuments(),
            repair_model_1.default.countDocuments({ status: { $in: [repair_model_1.RepairStatus.REQUESTED, repair_model_1.RepairStatus.IN_PROGRESS, repair_model_1.RepairStatus.WAITING_FOR_PARTS] } }),
            repair_model_1.default.countDocuments({ status: repair_model_1.RepairStatus.COMPLETED }),
            user_model_1.default.countDocuments({ role: 'Customer' }),
            user_model_1.default.countDocuments({ role: 'Technician' }),
            repair_model_1.default.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('_id customerName deviceInfo status requestDate')
        ]);
        const monthlyStats = await repair_model_1.default.aggregate([
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
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
};
exports.getDashboardStats = getDashboardStats;
