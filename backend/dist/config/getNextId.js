"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getworkOrderId = exports.expId = exports.getNextPartId = exports.getNextInvId = exports.getNextuserId = exports.getNextTechnicianId = void 0;
// backend/utils/getNextTechnicianId.ts
const counter_model_1 = __importDefault(require("../models/counter.model"));
const getNextTechnicianId = async () => {
    const counter = await counter_model_1.default.findOneAndUpdate({ name: 'technicianId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `tech ${counter.value}`;
};
exports.getNextTechnicianId = getNextTechnicianId;
const getNextuserId = async () => {
    const counter = await counter_model_1.default.findOneAndUpdate({ name: 'technicianId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `tech ${counter.value}`;
};
exports.getNextuserId = getNextuserId;
const getNextInvId = async () => {
    const counter = await counter_model_1.default.findOneAndUpdate({ name: 'inventoryId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `inv25${counter.value}`;
};
exports.getNextInvId = getNextInvId;
const getNextPartId = async () => {
    const counter = await counter_model_1.default.findOneAndUpdate({ name: 'partId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `Prt25${counter.value}`;
};
exports.getNextPartId = getNextPartId;
// export const generateCustomId = async (): Promise<string> => {
//   const counter = await Counter.findOneAndUpdate(
//     { name: 'customerId' },
//     { $inc: { value: 1 } },
//     { new: true, upsert: true }
//   );
//     return `cust ${counter.value}`;
// };
const expId = async () => {
    const counter = await counter_model_1.default.findOneAndUpdate({ name: 'expId' }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `exp ${counter.value}`;
};
exports.expId = expId;
const getworkOrderId = async () => {
    const counter = await counter_model_1.default.findOneAndUpdate({ name: "workOrderId" }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return `WO25${counter.value}`;
};
exports.getworkOrderId = getworkOrderId;
