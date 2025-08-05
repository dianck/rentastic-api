"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const prisma_1 = __importDefault(require("../prisma"));
const isDebug = process.env.DEBUG === "true"; // <- revisi: DEBUG=true artinya aktif
function logDebug(message, ...optionalParams) {
    if (isDebug) {
        console.log("[DEBUG]", message, ...optionalParams);
    }
}
class UserProfileController {
    async getProfile(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ message: "Email is required" });
                return;
            }
            const user = await prisma_1.default.user.findFirst({
                where: { email },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    mobile_number: true,
                    birthdate: true,
                    gender: true,
                    residence: true,
                    isVerified: true,
                    avatar: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!user) {
                res.status(404).json({ message: "Email is not registered" });
                return;
            }
            if (!user.isVerified) {
                res.status(403).json({
                    message: "Account is not verified. Please check your email.",
                });
                return;
            }
            res.status(200).json({
                message: "Profile fetched successfully",
                user,
            });
        }
        catch (error) {
            console.error("[UserProfileController.getProfile] Error:", error);
            res.status(500).json({ message: "Internal server error", error });
        }
    }
    async updateProfile(req, res) {
        try {
            const { username, gender, bdate, bmonth, byear, residence, mobile_number, email, } = req.body;
            if (!email) {
                res.status(400).json({ message: "Email is required" });
                return;
            }
            if (!username || !gender || !bdate || !bmonth || !byear || !residence || !mobile_number) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }
            const user = await prisma_1.default.user.findFirst({ where: { email } });
            if (!user) {
                res.status(404).json({ message: "Email is not registered" });
                return;
            }
            if (!user.isVerified) {
                res.status(403).json({
                    message: "Account is not verified. Please check your email.",
                });
                return;
            }
            // Format birthdate
            const birthdate = new Date(`${byear}-${bmonth}-${bdate}`);
            if (isNaN(birthdate.getTime())) {
                res.status(400).json({ message: "Invalid birthdate" });
                return;
            }
            const updatedUser = await prisma_1.default.user.update({
                where: { email },
                data: {
                    username,
                    gender,
                    birthdate,
                    residence,
                    mobile_number,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    mobile_number: true,
                    birthdate: true,
                    gender: true,
                    residence: true,
                    avatar: true,
                    updatedAt: true,
                }
            });
            res.status(200).json({
                message: "Profile updated successfully",
                user: updatedUser,
            });
            return;
        }
        catch (error) {
            console.error("[UserProfileController.updateProfile] Error:", error);
            res.status(500).json({ message: "Internal server error", error });
            return;
        }
    }
    async updatePassword(req, res) {
        try {
            const { email, oldPassword, newPassword } = req.body;
            if (!email || !oldPassword || !newPassword) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }
            const user = await prisma_1.default.user.findFirst({ where: { email } });
            if (!user) {
                res.status(404).json({ message: "Email is not registered" });
                return;
            }
            if (!user.isVerified) {
                res.status(403).json({
                    message: "Account is not verified. Please check your email.",
                });
                return;
            }
            const isMatch = await (0, bcrypt_1.compare)(oldPassword, user.password);
            if (!isMatch) {
                res.status(401).json({ message: "Old password is incorrect" });
                return;
            }
            const salt = await (0, bcrypt_1.genSalt)(10);
            const hashedPassword = await (0, bcrypt_1.hash)(newPassword, salt);
            const updatedUser = await prisma_1.default.user.update({
                where: { email },
                data: { password: hashedPassword },
                select: {
                    id: true,
                    email: true,
                    updatedAt: true,
                },
            });
            res.status(200).json({
                message: "Password updated successfully",
                user: updatedUser,
            });
            return;
        }
        catch (error) {
            console.error("[UserProfileController.updatePassword] Error:", error);
            res.status(500).json({ message: "Internal server error", error });
            return;
        }
    }
}
exports.default = UserProfileController;
/*

curl -X POST http://localhost:8000/api/user-profile/get \
  -H "Content-Type: application/json" \
  -d '{"email":"dianck2002@gmail.com"}'

curl -X POST http://localhost:8000/api/user-profile/get \
  -H "Authorization: Bearer AsdQweZxc" \
  -H "Content-Type: application/json" \
  -d '{"email":"dianck2002@gmail.com"}'

curl -X PATCH http://localhost:8000/api/user-profile/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer AsdQweZxc" \
  -d '{
    "email": "dianck2002@gmail.com",
    "username": "Dian CK",
    "gender": "MALE",
    "bdate": "15",
    "bmonth": "08",
    "byear": "1990",
    "residence": "Jakarta",
    "mobile_number": "081234567890"
  }'


curl -X PATCH http://localhost:8000/api/user-profile/update-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer AsdQweZxc" \
  -d '{
    "email": "dianck2002@gmail.com",
    "oldPassword": "OldPass123",
    "newPassword": "NewPass456"
  }'

  */ 
