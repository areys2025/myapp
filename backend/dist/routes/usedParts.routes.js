"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usedParts_controller_1 = require("../controllers/usedParts.controller");
const router = express_1.default.Router();
router.post('/', usedParts_controller_1.createUsedPart);
exports.default = router;
