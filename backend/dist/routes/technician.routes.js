"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const techController_1 = require("../controllers/techController");
const router = express_1.default.Router();
router.post('/', techController_1.createTechnician);
router.get('/', techController_1.getAllTechnicians);
router.get('/:id', techController_1.getTechnicianById);
router.put('/:id', techController_1.updateTechnician);
router.delete('/:id', techController_1.deleteTechnician);
exports.default = router;
