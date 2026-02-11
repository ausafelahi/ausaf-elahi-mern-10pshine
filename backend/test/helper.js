const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const generateTestToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "1d",
  });
};

const createMockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    user: null,
    token: null,
    log: {
      info: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub(),
    },
    ...overrides,
  };
};

const createMockResponse = () => {
  const res = {
    statusCode: 200,
    data: null,
  };

  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().callsFake((data) => {
    res.data = data;
    return res;
  });
  res.send = sinon.stub().callsFake((data) => {
    res.data = data;
    return res;
  });

  return res;
};

const testUsers = {
  validUser: {
    name: "Test User",
    email: "test@example.com",
    password: "Password123!",
  },
  anotherUser: {
    name: "Another User",
    email: "another@example.com",
    password: "Password456!",
  },
};

const testNotes = {
  validNote: {
    title: "Test Note",
    content: "This is a test note content",
    tags: ["test", "sample"],
    isPinned: false,
    color: "#008080",
  },
  pinnedNote: {
    title: "Pinned Note",
    content: "This is a pinned note",
    tags: ["important"],
    isPinned: true,
    color: "#FF5733",
  },
};

const generateObjectId = () => {
  return new mongoose.Types.ObjectId();
};

const createMockValidationResult = (errors = []) => {
  return () => ({
    isEmpty: () => errors.length === 0,
    array: () => errors,
  });
};

module.exports = {
  generateTestToken,
  createMockRequest,
  createMockResponse,
  testUsers,
  testNotes,
  generateObjectId,
  createMockValidationResult,
};
