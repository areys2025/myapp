import { Request, Response } from 'express';
import Supplier from '../models/Supplier';

// Create
export const createSupplier = async (req: Request, res: Response) => {
    try {
        const {name, email,company,address,products,phone}=req.body; 
            if (!name || !email || !company || !address || !products || !phone  ) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }
        const newsupplier=new Supplier({
         name, email,company,address,products,phone
        })        
        await Supplier.create(req.body);

        res.status(201).json(newsupplier);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create supplier', error: err });
    }
};

// Get all
export const getSuppliers = async (_req: Request, res: Response) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch suppliers' });
    }
};

// Get single
export const getSupplierById = async (req: Request, res: Response) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch supplier' });
    }
};

// Update
export const updateSupplier = async (req: Request, res: Response) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(supplier);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update supplier' });
    }
};

// Delete
export const deleteSupplier = async (req: Request, res: Response) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete supplier' });
    }
};
