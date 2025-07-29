import express from 'express';
import { createUsedPart } from '../controllers/usedParts.controller';

const router = express.Router();

router.post('/', createUsedPart);

export default router;
