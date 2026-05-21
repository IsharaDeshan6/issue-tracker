import {Router} from "express";
import {getMe, registerUser} from "../controllers/auth.controller";
import {protect} from "../middleware/auth.middleware";


const router = Router();

//public routes
router.post('/register', registerUser);
router.post('/login', registerUser);


//protected route
router.get('/me', protect, getMe);

export default router;
