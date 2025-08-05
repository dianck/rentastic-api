import { Router } from "express";
import rateLimit from "express-rate-limit";
import UserProfileController from "../controllers/user-profile.controller";
import { authenticateToken } from "../middlewares/auth";
// import UserProfileController from "../controllers/user-profile";

const getProfileLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: Number(process.env.PROFILE_REQUEST_LIMITER) || 10,
  message: "Too many requests. Please try again later.",
});

export default class UserProfileRouter {
  private router: Router;
  private userProfileController: UserProfileController;

  constructor() {
    this.router = Router();
    this.userProfileController = new UserProfileController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/get", authenticateToken, this.userProfileController.getProfile);
    this.router.patch("/update", this.userProfileController.updateProfile);
    this.router.patch("/update-password", this.userProfileController.updatePassword);

  }

  public getRouter(): Router {
    return this.router;
  }
}
