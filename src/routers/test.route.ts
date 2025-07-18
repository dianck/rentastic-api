import { Router } from 'express';
import { testPrismaConnection } from '../controllers/prismaTest.controller';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Terapkan middleware otentikasi
// router.get('/test-prisma', authenticateToken, testPrismaConnection);
router.get('/test-prisma', testPrismaConnection);

export default router;
