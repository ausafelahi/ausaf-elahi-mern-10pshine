const { expect } = require("chai");
const sinon = require("sinon");
const User = require("../../models/User");
const OTP = require("../../models/OTP");
const hashedOTP = require("../../utils/hashOTP");
const {
  createMockRequest,
  createMockResponse,
  testUsers,
  generateObjectId,
} = require("../helper");

describe("Password Controller", () => {
  let req, res;
  let forgotPassword, verifyOTP, resetPassword, resendOTP;
  let emailService;
  let emailServiceStubs;

  before(() => {
    delete require.cache[require.resolve("../../services/emailService")];
    delete require.cache[
      require.resolve("../../controllers/passwordResetController")
    ];

    emailService = require("../../services/emailService");

    emailServiceStubs = {
      generateOTP: sinon.stub(emailService, "generateOTP").returns("123456"),
      sendPasswordResetOTP: sinon
        .stub(emailService, "sendPasswordResetOTP")
        .resolves(true),
      sendPasswordResetConfirmation: sinon
        .stub(emailService, "sendPasswordResetConfirmation")
        .resolves(true),
    };

    const passwordController = require("../../controllers/passwordResetController");
    forgotPassword = passwordController.forgotPassword;
    verifyOTP = passwordController.verifyOTP;
    resetPassword = passwordController.resetPassword;
    resendOTP = passwordController.resendOTP;
  });

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();

    emailServiceStubs.generateOTP.resetHistory();
    emailServiceStubs.sendPasswordResetOTP.resetHistory();
    emailServiceStubs.sendPasswordResetConfirmation.resetHistory();
  });

  afterEach(() => {
    sinon.restore();

    if (!emailService.generateOTP.isSinonProxy) {
      emailServiceStubs.generateOTP = sinon
        .stub(emailService, "generateOTP")
        .returns("123456");
      emailServiceStubs.sendPasswordResetOTP = sinon
        .stub(emailService, "sendPasswordResetOTP")
        .resolves(true);
      emailServiceStubs.sendPasswordResetConfirmation = sinon
        .stub(emailService, "sendPasswordResetConfirmation")
        .resolves(true);
    }
  });

  after(() => {
    emailServiceStubs.generateOTP.restore();
    emailServiceStubs.sendPasswordResetOTP.restore();
    emailServiceStubs.sendPasswordResetConfirmation.restore();
  });

  describe("forgotPassword", () => {
    it("should send OTP to existing user email", async () => {
      const mockUser = {
        _id: generateObjectId(),
        name: testUsers.validUser.name,
        email: testUsers.validUser.email,
      };

      req.body = { email: testUsers.validUser.email };

      sinon.stub(User, "findOne").resolves(mockUser);
      sinon.stub(OTP, "deleteMany").resolves();
      sinon.stub(OTP, "create").resolves();

      await forgotPassword(req, res);

      expect(emailServiceStubs.generateOTP.called).to.be.true;
      expect(emailServiceStubs.sendPasswordResetOTP.called).to.be.true;

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
    });

    it("should return success even if user does not exist (security)", async () => {
      req.body = { email: "nonexistent@example.com" };

      sinon.stub(User, "findOne").resolves(null);

      await forgotPassword(req, res);

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
    });

    it("should handle server errors", async () => {
      req.body = { email: testUsers.validUser.email };

      sinon.stub(User, "findOne").rejects(new Error("Database error"));

      await forgotPassword(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("verifyOTP", () => {
    it("should verify valid OTP successfully", async () => {
      const otp = "123456";
      const mockOTPRecord = {
        email: testUsers.validUser.email,
        otp: "hashedOTP",
        verified: false,
        attempts: 0,
        save: sinon.stub().resolves(),
      };

      req.body = {
        email: testUsers.validUser.email,
        otp: otp,
      };

      sinon.stub(OTP, "findOne").resolves(mockOTPRecord);

      await verifyOTP(req, res);

      expect(mockOTPRecord.verified).to.be.true;
      expect(mockOTPRecord.save.called).to.be.true;

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
    });

    it("should return 400 for invalid OTP", async () => {
      req.body = {
        email: testUsers.validUser.email,
        otp: "wrong-otp",
      };

      sinon.stub(OTP, "findOne").resolves(null);

      await verifyOTP(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe("resetPassword", () => {
    it("should reset password with verified OTP", async () => {
      const mockUser = {
        _id: generateObjectId(),
        email: testUsers.validUser.email,
        password: "oldPassword",
        save: sinon.stub().resolves(),
      };

      const plainOTP = "123456";
      const mockOTPRecord = {
        email: testUsers.validUser.email,
        otp: hashedOTP(plainOTP),
        purpose: "password_reset",
        verified: true,
        _id: generateObjectId(),
      };

      req.body = {
        email: testUsers.validUser.email,
        otp: plainOTP,
        newPassword: "NewPassword123!",
      };

      sinon.stub(OTP, "findOne").resolves(mockOTPRecord);
      sinon.stub(User, "findOne").resolves(mockUser);
      sinon.stub(OTP, "deleteOne").resolves();

      await resetPassword(req, res);

      expect(res.status.called).to.be.false;
      expect(res.json.called).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: true,
        message: "Password reset successfully.",
      });
      expect(mockUser.save.called).to.be.true;
      expect(OTP.deleteOne.called).to.be.true;
    });

    it("should return 400 if OTP is not verified", async () => {
      req.body = {
        email: testUsers.validUser.email,
        otp: "123456",
        newPassword: "NewPassword123!",
      };

      sinon.stub(OTP, "findOne").resolves(null);

      await resetPassword(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it("should handle server errors", async () => {
      req.body = {
        email: testUsers.validUser.email,
        otp: "123456",
        newPassword: "NewPassword123!",
      };

      sinon.stub(OTP, "findOne").rejects(new Error("Database error"));

      await resetPassword(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("resendOTP", () => {
    it("should resend OTP to existing user", async () => {
      const mockUser = {
        _id: generateObjectId(),
        email: testUsers.validUser.email,
      };

      req.body = { email: testUsers.validUser.email };

      sinon.stub(User, "findOne").resolves(mockUser);
      sinon.stub(OTP, "deleteMany").resolves();
      sinon.stub(OTP, "create").resolves();

      await resendOTP(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].success).to.equal(true);
    });

    it("should return success even if user does not exist", async () => {
      req.body = { email: "nonexistent@example.com" };

      sinon.stub(User, "findOne").resolves(null);

      await resendOTP(req, res);

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
    });
  });
});
