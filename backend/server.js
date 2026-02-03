const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();

connectDB();

app.use(pinoHttp({ logger }));

app.use(express.json());

app.get("/", (req, res) => {
  req.log.info("Root route hit");
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
