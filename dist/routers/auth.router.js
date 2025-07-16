"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const verify_1 = require("../middlewares/verify");
// import { authenticateToken } from "../middlewares/auth";
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// import { verifyToken } from "../middlewares/verify";
const registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 menit
    max: 2, // Maks 5 kali register per IP per 10 menit
    // max: Number(process.env.ACCOUNT_REGISTER_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
    message: "Too many registration attempts. Please try again later."
});
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 menit
    max: 2, // Maks 5 kali register per IP per 10 menit
    // max: Number(process.env.LOGIN_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
    message: "Too many login attempts. Please try again later."
});
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/register", registerLimiter, this.authController.register);
        this.router.patch("/verify", verify_1.verifyTokenVerification, this.authController.verify);
        // this.router.post("/login", this.authController.login);
        //
        //
        this.router.post("/login", loginLimiter, this.authController.login);
        this.router.post("/email-conf-pwd", this.authController.emailConfirmPasswordReset);
        this.router.patch("/verify-reset-pwd", verify_1.verifyTokenVerification, this.authController.verifyResetPassword);
        // this.router.post("/reset-pwd", this.authController.resetPassword.bind(this.authController));        
        this.router.post("/reset-pwd", this.authController.resetPassword);
    }
    getRouter() {
        // this.initializeRoutes();
        return this.router;
    }
}
exports.default = AuthRouter;
