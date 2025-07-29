import { Router } from 'express';
import { 
  login, 
  register, 
  metamaskLogin, 
  getTechnicians, 
  getTechnicianById, 
  updateTechnician, 
  deleteTechnician
} from '../controllers/auth.controller';
import User from '../models/user.model';
import {deleteAdmin, registerAdmin} from '../controllers/adminControl'
import express from 'express';
import { forgotPassword } from '../controllers/forgot-password'; // adjust path
const router = express.Router();
import { resetPassword } from '../controllers/forgot-password';

// General Auth Routes
router.post('/login', login);
router.post('/register', register); // Handles registration for all roles
router.post('/metamask-login', metamaskLogin);
router.post("/api/regisadmin",registerAdmin)
// Technician-specific routes
router.get('/technicians', getTechnicians);
router.get('/technicians/:id', getTechnicianById);
router.put('/technicians/:id', updateTechnician);
router.delete('/technicians/:id', deleteTechnician);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// WARNING: This route includes passworhds - FOR DEVELOPMENT ONLY
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}); // Include all fields including password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});




export default router;