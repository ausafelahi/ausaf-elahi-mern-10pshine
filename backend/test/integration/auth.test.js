const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");
const logger = require("../../config/logger");
const authRoutes = require("../../routes/authRoutes");
const User = require("../../models/User");
const { testUsers } = require("../helper");

describe("Auth Integration Tests", () => {
  let mongoServer, app;

  before(async function () {
    this.timeout(30000);

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    await mongoose.connect(mongoUri);

    app = express();
    app.use(pinoHttp({ logger }));
    app.use(cors());
    app.use(express.json());
    app.use("/api/auth", authRoutes);
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUsers.validUser)
        .expect(201);

      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property(
        "email",
        testUsers.validUser.email,
      );
      expect(res.body.data).to.have.property("token");
    });

    it("should not register duplicate user", async () => {
      await request(app).post("/api/auth/register").send(testUsers.validUser);

      const res = await request(app)
        .post("/api/auth/register")
        .send(testUsers.validUser)
        .expect(400);

      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property("message", "User already exists");
    });

    it("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com" })
        .expect(400);

      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property("errors");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUsers.validUser);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUsers.validUser.email,
          password: testUsers.validUser.password,
        })
        .expect(200);

      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property("token");
    });

    it("should not login with invalid password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUsers.validUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(res.body).to.have.property("success", false);
      expect(res.body).to.have.property("message", "Invalid credentials");
    });

    it("should not login with non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(res.body).to.have.property("success", false);
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUsers.validUser);

      token = res.body.data.token;
    });

    it("should get user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.have.property(
        "email",
        testUsers.validUser.email,
      );
    });

    it("should not get profile without token", async () => {
      const res = await request(app).get("/api/auth/me").expect(401);

      expect(res.body).to.have.property("success", false);
    });
  });
});
