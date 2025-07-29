import express from 'express';
import {
  createTechnician,
  getAllTechnicians,
  getTechnicianById,
  updateTechnician,
  deleteTechnician
} from '../controllers/techController';

const router = express.Router();

router.post('/', createTechnician);
router.get('/', getAllTechnicians);
router.get('/:id', getTechnicianById);
router.put('/:id', updateTechnician);
router.delete('/:id', deleteTechnician);

export default router;
