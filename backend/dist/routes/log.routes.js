"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const SystemLog_1 = __importDefault(require("../models/SystemLog"));
const router = express_1.default.Router();
/**
 * GET /api/system-logs
 * Returns a list of system logs sorted by latest timestamp
 * Optional: only for Managers
 */
router.get('/', auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        // Optional: allow only managers to see logs
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Manager') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const logs = await SystemLog_1.default.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    }
    catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const logs = await SystemLog_1.default.create(req.body);
        res.status(200).json(logs);
    }
    catch (err) {
        console.error('Error creating logs:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
