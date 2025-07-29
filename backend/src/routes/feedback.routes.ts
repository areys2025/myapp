// routes/feedback.routes.ts (or similar)
import express from 'express';
import { submitFeedback , getAllFeedbacks} from '../controllers/feedback.controller'; // adjust path



const router = express.Router();
router.get('/', getAllFeedbacks);
router.post('/', submitFeedback);
export default router;
