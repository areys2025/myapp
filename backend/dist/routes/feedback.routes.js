"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/feedback.routes.ts (or similar)
const express_1 = __importDefault(require("express"));
const feedback_controller_1 = require("../controllers/feedback.controller"); // adjust path
const router = express_1.default.Router();
router.get('/', feedback_controller_1.getAllFeedbacks);
router.post('/', feedback_controller_1.submitFeedback);
exports.default = router;
