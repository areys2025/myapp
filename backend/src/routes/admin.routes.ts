import { Router } from 'express';
import {registerAdmin , getAllAdmins , updateAdmin,updateAdminAvailability ,deleteAdmin} from '../controllers/adminControl'

const router = Router();
router.post('/', registerAdmin);
router.get('/', getAllAdmins);
router.get('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id/availability', updateAdminAvailability);

export  default router;