"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextItemId = void 0;
const counter_model_1 = __importDefault(require("../models/counter.model"));
const getNextItemId = async () => {
    const counter = await counter_model_1.default.findOneAndUpdate({ name: 'purchaseItemId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `Item ${counter.value}`;
};
exports.getNextItemId = getNextItemId;
