import { Request, Response } from 'express';
import User, { UserRole } from '../models/user.model';
import bcrypt from 'bcryptjs';




// Update profile info
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    
    const { id } = req.params;
    const updates = req.body;

    const updated = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json(updated);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Change password
export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error while changing password' });
  }
};


// Get all users (with optional filters)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const users = await User.find(filters).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Get all technicians
export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const technicians = await User.find({ 
      role: UserRole.TECHNICIAN 
    }).select('-password');
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching technicians' });
  }
};

// Update technician availability
export const updateTechnicianAvailability = async (req: Request, res: Response) => {
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