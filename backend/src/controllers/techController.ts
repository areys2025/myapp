// backend/controllers/technicianController.ts
import { Request, Response } from 'express';
import Technician from '../models/Technicain';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import { UserRole } from '../models/user.model';
import { getNextTechnicianId } from '../config/getNextId';
import { logEvent } from '../config/logEvent';
export const createTechnician = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      contactNumber,
      specialization,
      walletAddress,
      availability,
    } = req.body;

const technicianID = await  getNextTechnicianId();
console.log(technicianID);
    // Validation
    if (!name || !email || !password || !contactNumber || !specialization || !walletAddress ) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Check for existing technician or user
    const existingTech = await Technician.findOne({ email });
    const existingUser = await User.findOne({ email });
    if (existingTech || existingUser) {
      return res.status(400).json({ message: 'Technician or user already exists with this email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID for technician

    // Create technician in technician collection
    const newTechnician = new Technician({
      id: technicianID,
      name,
      email,
      password: hashedPassword,
      contactNumber,
      specialization:specialization,
      walletAddress,
      availability,
      role: UserRole.TECHNICIAN,
    });


  console.log(newTechnician._id);
 const newTech  =  await newTechnician.save();
 if(newTech){
    await logEvent(
  'Technician registered',
  req.user?.email,
  req.user?.role,
  { technicianId: newTech.id, name: newTech.name }
);
 }

    // Also create a record in the user table
    // const newUser = new User({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   contactNumber,
    //   specialization,
    //   walletAddress,
    //   role: UserRole.TECHNICIAN,
    // });

    // await newUser.save();

    // Respond without password
    const technicianResponse = {
      id: newTechnician.id,
      name: newTechnician.name,
      email: newTechnician.email,
      contactNumber: newTechnician.contactNumber,
      specialization: newTechnician.specialization,
      availability: newTechnician.availability,
      walletAddress: newTechnician.walletAddress,
      role: newTechnician.role,
    };
    console.log(technicianResponse)
    res.status(201).json(technicianResponse);
  } catch (err) {
    console.error('Error creating technician:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get all technicians
export const getAllTechnicians = async (req: Request, res: Response) => {
  try {
        const technicians = await Technician.find();
        res.json(technicians);
        console.log(technicians)
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get technician by ID
export const getTechnicianById = async (req: Request, res: Response) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    res.status(200).json(technician);
  } catch (error) {
    console.error('Error fetching technician:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update technician
export const updateTechnician = async (req: Request, res: Response) => {
  try {
    const updated = await Technician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating technician:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete technician
export const deleteTechnician = async (req: Request, res: Response) => {
  console.log(req.params.id)
  try {
    const deleted = await Technician.findByIdAndDelete(req.params._id);
    if (!deleted) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    // Optionally delete from users too
    await User.findOneAndDelete({ email: deleted.email });

    res.status(200).json({ message: 'Technician deleted successfully' });
  } catch (error) {
    console.error('Error deleting technician:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
