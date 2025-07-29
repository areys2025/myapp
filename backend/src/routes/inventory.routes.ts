import express from 'express';
import {
  createItem,
  updateItem,
  getAllItems,
  getItemById,
  deleteItem,
} from '../controllers/inventoryController';

const router = express.Router();

router.post('/', createItem);
router.put('/:id', updateItem);
router.get('/', getAllItems);
router.get('/:_id', getItemById);
router.delete('/:id', deleteItem);

export default router;
