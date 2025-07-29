"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.getSupplierById = exports.getSuppliers = exports.createSupplier = void 0;
const Supplier_1 = __importDefault(require("../models/Supplier"));
// Create
const createSupplier = async (req, res) => {
    try {
        const { name, email, company, address, products, phone } = req.body;
        if (!name || !email || !company || !address || !products || !phone) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }
        const newsupplier = new Supplier_1.default({
            name, email, company, address, products, phone
        });
        await Supplier_1.default.create(req.body);
        res.status(201).json(newsupplier);
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to create supplier', error: err });
    }
};
exports.createSupplier = createSupplier;
// Get all
const getSuppliers = async (_req, res) => {
    try {
        const suppliers = await Supplier_1.default.find();
        res.json(suppliers);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch suppliers' });
    }
};
exports.getSuppliers = getSuppliers;
// Get single
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier_1.default.findById(req.params.id);
        if (!supplier)
            return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch supplier' });
    }
};
exports.getSupplierById = getSupplierById;
// Update
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(supplier);
    }
    catch (err) {
        res.status(400).json({ message: 'Failed to update supplier' });
    }
};
exports.updateSupplier = updateSupplier;
// Delete
const deleteSupplier = async (req, res) => {
    try {
        await Supplier_1.default.findByIdAndDelete(req.params.id);
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete supplier' });
    }
};
exports.deleteSupplier = deleteSupplier;
