import { Router } from "express";
import { verifyTokenVerification } from "../middlewares/verify";
import rateLimit from "express-rate-limit";
import AuthLoginController from "../controllers/auth-login.controller";
import AuthPasswordController from "../controllers/auth-password.controller";
import AuthRegisterController from "../controllers/auth-register.controller";

const registerLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 menit
    // max: 2, // Maks 5 kali register per IP per 10 menit
    max: Number(process.env.ACCOUNT_REGISTER_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
    message: "Too many registration attempts. Please try again later."
  });

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 menit
    // max: 3, // Maks 5 kali register per IP per 10 menit
    max: Number(process.env.LOGIN_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
    message: "Too many login attempts. Please try again later."
});

export default class AuthRouter{
    private router :  Router;
    private authRegisterController : AuthRegisterController;
    private authLoginController : AuthLoginController;
    private authPasswordController : AuthPasswordController;

    constructor(){
        this.router = Router();
        this.authRegisterController = new AuthRegisterController();
        this.authLoginController = new AuthLoginController();
        this.authPasswordController = new AuthPasswordController();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post("/register", registerLimiter, this.authRegisterController.register);
        this.router.patch(
            "/verify", 
            verifyTokenVerification, 
        this.authRegisterController.verify);
        this.router.post("/login", loginLimiter, this.authLoginController.login);
        this.router.post("/login-google", loginLimiter, this.authLoginController.login_google);

        this.router.post("/email-conf-pwd", this.authPasswordController.emailConfirmPasswordReset);

        this.router.patch(
            "/verify-reset-pwd", 
            verifyTokenVerification, 
        this.authPasswordController.verifyResetPassword);

        this.router.post("/reset-pwd", this.authPasswordController.resetPassword);
        
        
    }

    public getRouter(): Router{
        return this.router;
    }
}
