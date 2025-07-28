"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../middlewares/verify");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_login_controller_1 = __importDefault(require("../controllers/auth-login.controller"));
const auth_password_controller_1 = __importDefault(require("../controllers/auth-password.controller"));
const auth_register_controller_1 = __importDefault(require("../controllers/auth-register.controller"));
const registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 menit
    // max: 2, // Maks 5 kali register per IP per 10 menit
    max: Number(process.env.ACCOUNT_REGISTER_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
    message: "Too many registration attempts. Please try again later."
});
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 menit
    // max: 3, // Maks 5 kali register per IP per 10 menit
    max: Number(process.env.LOGIN_LIMITER) || 5, // Maks 5 kali register per IP per 10 menit
    message: "Too many login attempts. Please try again later."
});
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authRegisterController = new auth_register_controller_1.default();
        this.authLoginController = new auth_login_controller_1.default();
        this.authPasswordController = new auth_password_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/register", registerLimiter, this.authRegisterController.register);
        this.router.patch("/verify", verify_1.verifyTokenVerification, this.authRegisterController.verify);
        this.router.post("/login", loginLimiter, this.authLoginController.login);
        this.router.post("/login-google", loginLimiter, this.authLoginController.login_google);
        this.router.post("/email-conf-pwd", this.authPasswordController.emailConfirmPasswordReset);
        this.router.patch("/verify-reset-pwd", verify_1.verifyTokenVerification, this.authPasswordController.verifyResetPassword);
        this.router.post("/reset-pwd", this.authPasswordController.resetPassword);
    }
    getRouter() {
        return this.router;
    }
}
exports.default = AuthRouter;
