import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { forgotPassword } from '../controllers/forgot-password';
import { 
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getTechnicians,
  updateTechnicianAvailability
} from '../controllers/user.controller';
import { updateUserProfile, changeUserPassword } from '../controllers/user.controller';
const router = Router();

// User management routes
router.get('/users', authenticateToken,getUsers);
router.get('/technicians', getTechnicians);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id', authenticateToken, updateUserProfile);

router.patch('/technicians/:id/availability', updateTechnicianAvailability);
router.patch('/registAdmin/:id/availability', updateTechnicianAvailability);

router.put('/:id', updateUserProfile); // Profile update
router.put('/:id/password', changeUserPassword); // Password update
router.post('/forgot-password', forgotPassword);

export default router; 