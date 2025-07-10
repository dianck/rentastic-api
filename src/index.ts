import dotenv from 'dotenv';
dotenv.config();

import cors from "cors";
import express, { Application, Request, Response } from 'express';
import AuthRouter from "./routers/auth.router";
import testRouter from "./routers/test.route"; // ✅ Tambahkan import ini



const PORT: number = 8000;


const app: Application = express();
app.use(express.json())
app.use(cors()); 

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Welcom to My API!' })
    // res.send('Hello World!');
});

// Perbaikan: Hindari nama variabel yang sama dengan class
const authRouter = new AuthRouter();
app.use("/api/auth", authRouter.getRouter());
app.use("/api", testRouter); // ✅ Mount test router di /api


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
