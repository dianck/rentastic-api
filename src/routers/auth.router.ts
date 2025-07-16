import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyTokenVerification } from "../middlewares/verify";
// import { authenticateToken } from "../middlewares/auth";
import rateLimit from "express-rate-limit";

// import { verifyToken } from "../middlewares/verify";

const registerLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 menit
    max: Number(process.env.ACCOUNT_REGISTER_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
    message: "Too many registration attempts. Please try again later."
  });

const loginLimiter = rateLimit({
windowMs: 10 * 60 * 1000, // 10 menit
max: Number(process.env.LOGIN_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
message: "Too many login attempts. Please try again later."
});

export default class AuthRouter{
    private router :  Router;
    private authController : AuthController;

    constructor(){
        this.router = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post("/register", registerLimiter, this.authController.register);
        this.router.patch(
            "/verify", 
            verifyTokenVerification, 
        this.authController.verify);
        // this.router.post("/login", this.authController.login);
        //
        //
        this.router.post("/login", loginLimiter, this.authController.login);
        this.router.post("/email-conf-pwd", this.authController.emailConfirmPasswordReset);

        this.router.patch(
            "/verify-reset-pwd", 
            verifyTokenVerification, 
        this.authController.verifyResetPassword);

        // this.router.post("/reset-pwd", this.authController.resetPassword.bind(this.authController));        
        this.router.post("/reset-pwd", this.authController.resetPassword);
        
        
    }

    public getRouter(): Router{
        // this.initializeRoutes();
        return this.router;
    }
}