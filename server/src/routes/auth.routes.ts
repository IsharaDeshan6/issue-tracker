import {Router} from "express";
import {getMe, loginUser, registerUser} from "../controllers/auth.controller";
import {protect} from "../middleware/auth.middleware";
import {loginSchema, registerSchema, validate} from "../validators/auth.validator";


const router = Router();

//public routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);


//protected route
router.get('/me', protect, getMe);

export default router;
