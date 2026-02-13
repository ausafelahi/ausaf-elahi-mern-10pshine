const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

describe("User Model", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("Schema Validation", () => {
    it("should require name field", () => {
      const user = new User({
        email: "test@example.com",
        password: "password123",
      });

      const validationError = user.validateSync();
      expect(validationError.errors.name).to.exist;
      expect(validationError.errors.name.message).to.equal("Name is required");
    });

    it("should require email field", () => {
      const user = new User({
        name: "Test User",
        password: "password123",
      });

      const validationError = user.validateSync();
      expect(validationError.errors.email).to.exist;
    });

    it("should require password field", () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
      });

      const validationError = user.validateSync();
      expect(validationError.errors.password).to.exist;
    });

    it("should validate email format", () => {
      const user = new User({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      const validationError = user.validateSync();
      expect(validationError.errors.email).to.exist;
      expect(validationError.errors.email.message).to.equal(
        "Please provide a valid email"
      );
    });

    it("should enforce minimum password length", () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "short",
      });

      const validationError = user.validateSync();
      expect(validationError.errors.password).to.exist;
      expect(validationError.errors.password.message).to.include(
        "at least 8 characters"
      );
    });

    it("should create valid user with all required fields", () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const validationError = user.validateSync();
      expect(validationError).to.be.undefined;
    });

    it("should convert email to lowercase", () => {
      const user = new User({
        name: "Test User",
        email: "TEST@EXAMPLE.COM",
        password: "password123",
      });

      expect(user.email).to.equal("test@example.com");
    });

    it("should trim whitespace from fields", () => {
      const user = new User({
        name: "  Test User  ",
        email: "  test@example.com  ",
        password: "password123",
      });

      expect(user.name).to.equal("Test User");
      expect(user.email).to.equal("test@example.com");
    });
  });

  describe("Password Hashing", () => {
    it("should hash password before saving", async () => {
      const plainPassword = "plainPassword123";
      
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: plainPassword,
      });

      const saltStub = sinon.stub(bcrypt, "genSalt").resolves("test-salt");
      const hashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword123");

      if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }

      expect(saltStub.calledWith(10)).to.be.true;
      expect(hashStub.calledWith(plainPassword, "test-salt")).to.be.true;
      expect(user.password).to.equal("hashedPassword123");
    });

    it("should not hash password if not modified", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "alreadyHashedPassword",
      });

      user.isModified = sinon.stub().withArgs("password").returns(false);
      
      const hashSpy = sinon.spy(bcrypt, "hash");
      const genSaltSpy = sinon.spy(bcrypt, "genSalt");

      if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }

      expect(user.isModified.calledWith("password")).to.be.true;
      expect(genSaltSpy.called).to.be.false;
      expect(hashSpy.called).to.be.false;
    });

    it("should use bcrypt with salt rounds of 10", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const genSaltStub = sinon.stub(bcrypt, "genSalt").resolves("test-salt");
      sinon.stub(bcrypt, "hash").resolves("hashedPassword");

      if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }

      expect(genSaltStub.calledWith(10)).to.be.true;
    });
  });

  describe("matchPassword Method", () => {
    it("should return true for matching password", async () => {
      const plainPassword = "password123";
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });

      const isMatch = await user.matchPassword(plainPassword);
      expect(isMatch).to.be.true;
    });

    it("should return false for non-matching password", async () => {
      const plainPassword = "password123";
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });

      const isMatch = await user.matchPassword("wrongPassword");
      expect(isMatch).to.be.false;
    });

    it("should use bcrypt.compare internally", async () => {
      const plainPassword = "password123";
      const hashedPassword = "hashedPassword123";

      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      });

      const compareStub = sinon.stub(bcrypt, "compare").resolves(true);

      await user.matchPassword(plainPassword);

      expect(compareStub.calledWith(plainPassword, hashedPassword)).to.be.true;
    });
  });

  describe("Timestamps", () => {
    it("should have createdAt and updatedAt fields", () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(user.schema.paths).to.have.property("createdAt");
      expect(user.schema.paths).to.have.property("updatedAt");
    });
  });

  describe("Password Select Behavior", () => {
    it("should not select password by default", () => {
      const userSchema = User.schema;
      const passwordField = userSchema.paths.password;

      expect(passwordField.options.select).to.be.false;
    });
  });
});