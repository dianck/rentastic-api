import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyTokenVerification } from "../middlewares/verify";
import { authenticateToken } from "../middlewares/auth";

// import { verifyToken } from "../middlewares/verify";


export default class AuthRouter{
    private router :  Router;
    private authController : AuthController;

    constructor(){
        this.router = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post("/register", this.authController.register);
        this.router.patch(
            "/verify", 
            verifyTokenVerification, 
        this.authController.verify);
        this.router.post("/login", authenticateToken, this.authController.login);
        this.router.post("/email-conf-pwd", this.authController.emailConfirmPasswordReset);

        this.router.patch(
            "/verify-reset-pwd", 
            verifyTokenVerification, 
        this.authController.verifyResetPassword);

        // this.router.post("/reset-pwd", this.authController.resetPassword.bind(this.authController));        
        this.router.post("/reset-pwd", this.authController.resetPassword);
        
        
    }

    public getRouter(): Router{
        this.initializeRoutes();
        return this.router;
    }
}