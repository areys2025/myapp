import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/user.model';
import { ethers } from 'ethers';
import Technicain from '../models/Technicain';
import { logEvent } from '../config/logEvent';
// Helper function to format user response based on role
const formatUserResponse = (user: any, token: string) => {
  // Base user data that all roles share
  const baseUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress
  };

  // Add role-specific fields
  switch (user.role) {
    case UserRole.CUSTOMER:
      return {
        token,
        user: {
          ...baseUser,
          contactNumber: user.contactNumber || '',
          role: UserRole.CUSTOMER // Using enum value directly
        }
      };
    case UserRole.TECHNICIAN:
      return {
        token,
        user: {
          ...baseUser,
          specialization: user.specialization,
          availability: user.availability,
          role: UserRole.TECHNICIAN // Using enum value directly
        }
      };
      
    case UserRole.MANAGER:
      return {
        token,
        user: {
          ...baseUser,
          role: UserRole.MANAGER // Using enum value directly
        }
      };
    default:
      return {
        token,
        user: baseUser
      };
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );
if(token){
  await logEvent(
  'User login',
  user?.email,
  user?.role,
  { userInfo: user._id, name: user.name }
);
}
    // Send formatted response with role-specific data
    res.json(formatUserResponse(user, token));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      email, 
      password, 
      name, 
      role, 
      walletAddress,
      contactNumber,
      specialization,
      availability 
    } = req.body;


    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { walletAddress }
      ]
    });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email or wallet address' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role-specific fields
    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      walletAddress,
      ...(role === UserRole.CUSTOMER ? { 
        contactNumber: contactNumber || '',
      } : {}),
      ...(role === UserRole.TECHNICIAN ? { 
        specialization, 
        availability: availability !== undefined ? availability : true 
      } : {})
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    // Send formatted response with role-specific data
    res.status(201).json(formatUserResponse(user, token));
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Registration failed' 
    });
  }
}; 

export const getTechnicians = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch users with the 'Technician' role, excluding their passwords
    const technicians = await User.find({ role: UserRole.TECHNICIAN }).select('-password');
    res.status(200).json(technicians);
  } catch (error) {
    console.error('Get technicians error:', error);
    res.status(500).json({ message: 'Failed to retrieve technicians' });
  }
};

export const getTechnicianById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const technician = await User.findOne({ _id: id, role: UserRole.TECHNICIAN }).select('-password');
    
    if (!technician) {
      res.status(404).json({ message: 'Technician not found' });
      return;
    }
    
    res.status(200).json(technician);
  } catch (error) {
    console.error(`Get technician by ID error:`, error);
    res.status(500).json({ message: 'Failed to retrieve technician' });
  }
};

export const updateTechnician = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, contactNumber, specialization, availability, password } = req.body;

    // Find the technician to ensure they exist
    const technician = await User.findOne({ _id: id, role: UserRole.TECHNICIAN });
    if (!technician) {
      res.status(404).json({ message: 'Technician not found' });
      return;
    }

    // Prepare data for update
    const updateData: any = {
      name,
      email: email.toLowerCase(),
      contactNumber,
      specialization,
      availability,
    };

    // If a new password is provided, validate and hash it
    if (password) {
      if (password.length < 6) {
        res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Perform the update
    const updatedTechnician = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    if (!updatedTechnician) {
      res.status(404).json({ message: 'Failed to update technician' });
      return;
    }

    res.status(200).json(updatedTechnician);

  } catch (error: any) {
    console.error('Update technician error:', error);
    // Handle potential duplicate email errors
    if (error.code === 11000 && error.keyPattern?.email) {
      res.status(400).json({ message: 'This email address is already in use.' });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete technician
export const deleteTechnician = async (req: Request, res: Response) => {
  console.log("three controls")
  try {
    const deleted = await Technicain.findByIdAndDelete(req.params.id);
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

export const metamaskLogin = async (req: Request, res: Response) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ message: 'Missing MetaMask login data' });
    }

    const recovered = ethers.verifyMessage(message, signature);
    console.log('Recovered address:', recovered);
    console.log('Provided address:', address);

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    let user = await User.findOne({ walletAddress: address });

    if (!user) {
      return res.status(404).json({ message: 'User not found for this wallet. Please register first.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
if(token){
  await logEvent(
  'User login',
  user?.email,
  user?.role,
  { userInfo: user._id, name: user.name }
);
}
    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('MetaMask login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






