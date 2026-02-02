const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

connectDB();

app.use(pinoHttp({ logger }));

app.use(express.json());

app.get("/", (req, res) => {
  req.log.info("Root route hit");
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
