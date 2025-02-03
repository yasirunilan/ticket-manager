import { Router } from "express";
import authController from "../../controllers/authController.js";
import { validate } from "../../middlewares/validator.js";
import authSchema from "../../schema/auth.js";
import authenticate from '../../middlewares/authenticator.js';

const router = Router();

router.post("/login", validate(authSchema.loginSchema), authenticate('local'), authController.login);

export default router;
