const { expect } = require("chai");
const sinon = require("sinon");
const User = require("../../models/User");
const Token = require("../../models/Token");
const jwtUtils = require("../../utils/jwt");
const jwt = require("jsonwebtoken");
const {
  createMockRequest,
  createMockResponse,
  testUsers,
  generateObjectId,
} = require("../helper");

let registerUser, loginUser, logoutUser, getMe;

describe("Auth Controller", () => {
  let req, res;

  before(() => {
    const authController = require("../../controllers/authController");
    registerUser = authController.registerUser;
    loginUser = authController.loginUser;
    logoutUser = authController.logoutUser;
    getMe = authController.getMe;
  });

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const userId = generateObjectId();
      const mockUser = {
        _id: userId,
        name: testUsers.validUser.name,
        email: testUsers.validUser.email,
        password: "hashedPassword",
      };

      req.body = testUsers.validUser;

      sinon.stub(User, "findOne").resolves(null);
      sinon.stub(User, "create").resolves(mockUser);
      sinon.stub(jwtUtils, "generateToken").returns("test-token");

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.called).to.be.true;

      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
      expect(jsonCall.data._id).to.equal(userId);
      expect(jsonCall.data.name).to.equal(mockUser.name);
      expect(jsonCall.data.email).to.equal(mockUser.email);
      expect(jsonCall.data.token).to.be.a("string");
    });

    it("should return 400 if user already exists", async () => {
      req.body = testUsers.validUser;

      sinon
        .stub(User, "findOne")
        .resolves({ email: testUsers.validUser.email });

      await registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.false;
      expect(jsonCall.message).to.equal("User already exists");
    });

    it("should handle server errors gracefully", async () => {
      req.body = testUsers.validUser;

      sinon.stub(User, "findOne").rejects(new Error("Database error"));

      await registerUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.false;
      expect(jsonCall.message).to.equal("Database error");
    });
  });

  describe("loginUser", () => {
    it("should login user with valid credentials", async () => {
      const userId = generateObjectId();
      const mockUser = {
        _id: userId,
        name: testUsers.validUser.name,
        email: testUsers.validUser.email,
        matchPassword: sinon.stub().resolves(true),
      };

      req.body = {
        email: testUsers.validUser.email,
        password: testUsers.validUser.password,
      };

      sinon.stub(User, "findOne").returns({
        select: sinon.stub().resolves(mockUser),
      });
      sinon.stub(jwtUtils, "generateToken").returns("test-token");

      await loginUser(req, res);

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
      expect(jsonCall.data._id).to.equal(userId);
      expect(jsonCall.data.email).to.equal(mockUser.email);
      expect(jsonCall.data.token).to.be.a("string");
    });

    it("should return 401 if user not found", async () => {
      req.body = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      sinon.stub(User, "findOne").returns({
        select: sinon.stub().resolves(null),
      });

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.false;
      expect(jsonCall.message).to.equal("Invalid credentials");
    });

    it("should return 401 if password is incorrect", async () => {
      const mockUser = {
        email: testUsers.validUser.email,
        matchPassword: sinon.stub().resolves(false),
      };

      req.body = {
        email: testUsers.validUser.email,
        password: "wrongpassword",
      };

      sinon.stub(User, "findOne").returns({
        select: sinon.stub().resolves(mockUser),
      });

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.false;
      expect(jsonCall.message).to.equal("Invalid credentials");
    });
  });

  describe("logoutUser", () => {
    it("should logout user successfully", async () => {
      const userId = generateObjectId();
      const token = "test-jwt-token";

      req.user = { _id: userId, email: testUsers.validUser.email };
      req.token = token;

      sinon.stub(jwt, "decode").returns({
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      sinon.stub(Token, "create").resolves({});

      await logoutUser(req, res);

      expect(Token.create.called).to.be.true;
      const createCall = Token.create.getCall(0).args[0];
      expect(createCall.token).to.equal(token);
      expect(createCall.user).to.equal(userId);
      expect(createCall.expiresAt).to.be.instanceOf(Date);

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
      expect(jsonCall.message).to.equal("Logged out successfully");
    });

    it("should handle logout errors", async () => {
      req.user = { _id: generateObjectId(), email: testUsers.validUser.email };
      req.token = "test-token";

      sinon
        .stub(jwt, "decode")
        .returns({ exp: Math.floor(Date.now() / 1000) + 3600 });
      sinon.stub(Token, "create").rejects(new Error("Database error"));

      await logoutUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("getMe", () => {
    it("should return current user profile", async () => {
      const userId = generateObjectId();
      const mockUser = {
        _id: userId,
        name: testUsers.validUser.name,
        email: testUsers.validUser.email,
      };

      req.user = { _id: userId };

      sinon.stub(User, "findById").resolves(mockUser);

      await getMe(req, res);

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
      expect(jsonCall.data._id).to.equal(userId);
      expect(jsonCall.data.name).to.equal(mockUser.name);
      expect(jsonCall.data.email).to.equal(mockUser.email);
    });

    it("should handle errors when fetching user profile", async () => {
      req.user = { _id: generateObjectId() };

      sinon.stub(User, "findById").rejects(new Error("User not found"));

      await getMe(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });
});
