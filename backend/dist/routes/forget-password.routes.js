"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const forgot_password_1 = require("../controllers/forgot-password");
router.post('/', forgot_password_1.forgotPassword);
exports.default = router;
