// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import AuthRouter from './routers/auth.router';
import testRouter from './routers/test.route'; // ✅ Router tambahan (misalnya test prisma)

const PORT: number = Number(process.env.PORT) || 8000;

const app: Application = express();

// 🧠 Set proxy trust *sebelum* middleware lain (untuk rate-limit, ip detection, dsb)
app.set('trust proxy', true);

// 📦 Middleware global
app.use(cors());
app.use(express.json());

// 🛠 Simple healthcheck
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to My API!' });
});

// 🚪 Router group
const authRouter = new AuthRouter();
app.use('/api/auth', authRouter.getRouter());
app.use('/api', testRouter); // Test route (contoh: /test-prisma)

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
