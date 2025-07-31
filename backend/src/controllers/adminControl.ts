import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/user.model';
import { ethers } from 'ethers';
import Admin from '../models/Admin';
import { logEvent } from '../config/logEvent';
export const registerAdmin = async (req: Request, res: Response) => {
  
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      contactNumber,
      walletAddress,
      availability,
    } = req.body;
console.log (name+" , "+email +" , "+ password +" , " +contactNumber+" , " +walletAddress +" , "+availability)
    // Validation
    if (!name || !email || !password || !confirmPassword || !contactNumber || !walletAddress  || availability) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to users collection
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      walletAddress,
      deviceType:'android',
      role: UserRole.MANAGER, // you may want to update this if it's wrong
    });

 await newUser.save();


    // Save to admins collection
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      walletAddress,
      role: UserRole.MANAGER,
      availability,
    });
    
if(admin){
await logEvent(
  'Admin deleted',
  req.body.LoginfoEml,
  req.body.LoginfoRle,
  { deletedAdminId: admin.id }
);
}
    res.status(201).json({
      message: 'Admin registered successfully',
      adminId: admin._id,
    });
  } catch (err) {
    console.error('Admin Registration Error:', err);
    res.status(500).json({ message: 'Server error while registering admin' });
  }
};

export const getAllAdmins = async (_req: Request, res: Response) => {
  try {
    const AllAdmins = await Admin.find();
    res.json(AllAdmins);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admins', error });
  }
};

export const updateAdmin=async(_req:Request ,res:Response)=>{
try{
      const updated = await Admin.findByIdAndUpdate(
      _req.params.id,
      _req.body,
      { new: true }
    );

if(updated){
await logEvent(
  'Admin updated',
  _req.body.LoginfoEml,
  _req.body.LoginfoRle,
  { deletedAdminId: updated.id }
);
}
   if (!updated) {
      return res.status(404).json({ message: 'Admin not found' });
    }
        res.status(200).json(updated);
      }
catch (error) {
    console.error('Error updating Admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
}



export const deleteAdmin = async (req: Request, res: Response) => {
  console.log("three controls")
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    await User.findOneAndDelete({ email: deleted.email });

    res.status(200).json({ message: 'Technician deleted successfully' });
  } catch (error) {
    console.error('Error deleting Admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateAdminAvailability = async (req: Request, res: Response) => {
  try {
    const { availability } = req.body;
    const technician = await User.findOneAndUpdate(
      { _id: req.params.id, role: UserRole.TECHNICIAN },
      { availability },
      { new: true }
    ).select('-password');
    
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    res.json(technician);
  } catch (error) {
    res.status(400).json({ message: 'Error updating technician availability' });
  }
}; 