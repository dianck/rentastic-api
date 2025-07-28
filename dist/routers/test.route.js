"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prismaTest_controller_1 = require("../controllers/prismaTest.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Terapkan middleware otentikasi
router.get('/test-prisma', auth_1.authenticateToken, prismaTest_controller_1.testPrismaConnection);
// router.get('/test-prisma', testPrismaConnection);
exports.default = router;
