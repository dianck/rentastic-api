"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const test_route_1 = __importDefault(require("./routers/test.route")); // ✅ Router tambahan (misalnya test prisma)
const PORT = Number(process.env.PORT) || 8000;
const app = (0, express_1.default)();
// 🧠 Set proxy trust *sebelum* middleware lain (untuk rate-limit, ip detection, dsb)
app.set('trust proxy', true);
// 📦 Middleware global
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 🛠 Simple healthcheck
app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'Welcome to My API!' });
});
// 🚪 Router group
const authRouter = new auth_router_1.default();
app.use('/api/auth', authRouter.getRouter());
app.use('/api', test_route_1.default); // Test route (contoh: /test-prisma)
// 🚀 Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
