import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./Dto/register.dto.js";
import * as authController from "./auth.controller.js"
import ResetPasswordDto from "./Dto/resetPassword.dto.js";
import ForgotPasswordDto from "./Dto/forgotPassword.dto.js";
import LoginDto from "./Dto/login.dto.js";
import { authenticate } from "./auth.middleware.js";


const router = Router();
router.post("/register", validate(RegisterDto), authController.register)
router.post("/verify-email/:token", authController.verifyUser);

router.post("/forgot-password", validate(ForgotPasswordDto), authController.forgotPassword)
router.put("/reset-password/:resetToken", validate(ResetPasswordDto), authController.resetPassword);

router.post("/login", validate(LoginDto), authController.login);
router.post("/logout", authenticate, authController.logout)

router.post("/renew-access-token", authController.renewAccessToken);

export default router;