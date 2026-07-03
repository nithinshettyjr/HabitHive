import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth";
import habitRoutes from "./routes/habits";
import journalRoutes from "./routes/journal";
import achievementRoutes from "./routes/achievements";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? "5000", 10);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is missing!");
  process.exit(1);
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Root route – simple health endpoint
app.get("/", (_req, res) => {
  res.json({ status: "OK", message: "DailyFlow API is running", version: "1.0.0" });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", message: "Server is running", uptime: process.uptime() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/achievements", achievementRoutes);

// (Removed duplicate health route – original is defined at line 39)

// Error handling (moved after 404)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// (Removed duplicate simple 404 handler – detailed handler retained below)

// 404 handler – placed after all routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler – must be last
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Free the port or change the PORT env variable.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

export default app;
