import  Express  from "express";
const router = Express.Router();
import { forgotPassword } from "../controllers/forgot-password";
router.post('/', forgotPassword);


export default router;