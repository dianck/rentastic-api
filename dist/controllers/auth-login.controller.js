"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import prisma from "../../prisma";
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = __importDefault(require("../prisma"));
const isDebug = process.env.DEBUG === "false";
function logDebug(message, ...optionalParams) {
    if (isDebug) {
        console.log("[DEBUG]", message, ...optionalParams);
    }
}
class AuthLoginController {
    async login(req, res) {
        try {
            const { login, password } = req.body;
            const user = await prisma_1.default.user.findFirst({
                where: {
                    OR: [
                        { username: login },
                        { email: login }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password: true,
                    avatar: true,
                    isVerified: true,
                    role: true,
                    auth_type: true,
                    isAvailable: true,
                    // Jangan ambil points langsung (array), akan kita jumlahkan terpisah
                }
            });
            if (!user) {
                res.status(404).send({ message: "User not found" });
                return;
            }
            const isPasswordValid = await (0, bcrypt_1.compare)(password, user.password);
            if (!isPasswordValid) {
                res.status(401).send({ message: "Invalid password" });
                return;
            }
            if (!user.isVerified) {
                res.status(402).send({ message: "Account not verified, please check your email verification!" });
                return;
            }
            const payload = { id: user.id };
            const token = (0, jsonwebtoken_1.sign)(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
            const { password: _, ...userWithoutPassword } = user;
            res.status(200).send({
                message: "Login OK",
                user: {
                    ...userWithoutPassword,
                },
                token
            });
        }
        catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }
    async login_google(req, res) {
        try {
            const { email, name, picture } = req.body;
            if (!email) {
                res.status(400).json({ message: "Email is required" });
                return;
            }
            const user = await prisma_1.default.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password: true,
                    avatar: true,
                    auth_type: true,
                    isVerified: true,
                    isAvailable: true,
                    role: true,
                },
            });
            if (user) {
                console.log("isAvailable: ", user.isAvailable);
                if (!user.isAvailable) {
                    res.status(403).json({ message: "User is blocked" });
                    return;
                }
                const token = (0, jsonwebtoken_1.sign)({ id: user.id }, process.env.SECRET_KEY, {
                    expiresIn: "1h",
                });
                res.status(200).json({
                    message: "Login success",
                    user,
                    token,
                });
            }
            else {
                const salt = await (0, bcrypt_1.genSalt)(10);
                const dummyPassword = await (0, bcrypt_1.hash)("", salt);
                const newUser = await prisma_1.default.user.create({
                    data: {
                        email,
                        username: name,
                        avatar: picture,
                        isVerified: true,
                        isAvailable: true,
                        role: "USER",
                        auth_type: "GOOGLE",
                        password: dummyPassword,
                    },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true,
                        auth_type: true,
                        isVerified: true,
                        isAvailable: true,
                        role: true,
                    },
                });
                const token = (0, jsonwebtoken_1.sign)({ id: newUser.id }, process.env.SECRET_KEY, {
                    expiresIn: "1h",
                });
                res.status(201).json({
                    message: "User created & logged in",
                    user: newUser,
                    token,
                });
            }
        }
        catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }
}
exports.default = AuthLoginController;
/*

curl -X GET http://localhost:8000/api

curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "budi",
    "email": "hapegyjo@forexnews.bg",
    "password": "asd123"
  }'


curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "graha",
    "password": "Asd123"
  }'

curl -X POST http://localhost:8000/api/auth/login-google \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dianck2002@gmail.com",
    "name": "Dian Candra Kusuma",
    "picture": "dck.png"
  }'

curl -X PATCH http://localhost:8000/api/auth/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsImlhdCI6MTc1MTQ0MTgwOCwiZXhwIjoxNzUxNDQyNDA4fQ.dWvOCUTZtrdtbY910Gw6817oBTw6TuqL17CiVIBBM7c"
  
for i in {1..4}; do
  curl -X POST https://cash-mgmt-be.vercel.app/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"user'$i'", "email":"user'$i'@test.com", "password":"123456"}'
done



for i in {1..4}; do
  curl -X POST https://cash-mgmt-be.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "login": "graha",
      "password": "Asd123"
    }'
done

for i in {1..4}; do
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "login": "graha",
      "password": "Asd123"
    }'
done


*/ 
