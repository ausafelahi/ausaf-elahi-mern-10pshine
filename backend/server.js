require("dotenv").config();
const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");

const app = express();

connectDB();

app.use(pinoHttp({ logger }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  req.log.info("Root route hit");
  res.json({
    success: true,
    message: "Nodus API Server",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  req.log.info("Health check");
  res.json({
    success: true,
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use((req, res) => {
  req.log.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  app.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
