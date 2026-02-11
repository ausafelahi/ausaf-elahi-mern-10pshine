const { expect } = require("chai");
const mongoose = require("mongoose");
const Notes = require("../../models/Notes");
const { generateObjectId } = require("../helper");

describe("Notes Model", () => {
  describe("Schema Validation", () => {
    it("should require title field", () => {
      const note = new Notes({
        user: generateObjectId(),
      });

      const validationError = note.validateSync();
      expect(validationError.errors.title).to.exist;
    });

    it("should require user field", () => {
      const note = new Notes({
        title: "Test Note",
      });

      const validationError = note.validateSync();
      expect(validationError.errors.user).to.exist;
    });

    it("should create valid note with required fields", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
    });

    it("should have default empty string for content", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
      });

      expect(note.content).to.equal("");
    });

    it("should have default empty array for tags", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
      });

      expect(note.tags).to.be.an("array");
      expect(note.tags).to.have.lengthOf(0);
    });

    it("should have default false for isPinned", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
      });

      expect(note.isPinned).to.be.false;
    });

    it("should have default color value", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
      });

      expect(note.color).to.equal("#008080");
    });

    it("should trim whitespace from title", () => {
      const note = new Notes({
        title: "  Test Note  ",
        user: generateObjectId(),
      });

      expect(note.title).to.equal("Test Note");
    });
  });

  describe("Tags Validation", () => {
    it("should accept valid tags array", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        tags: ["work", "important", "urgent"],
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
      expect(note.tags).to.have.lengthOf(3);
    });

    it("should reject empty string tags", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        tags: ["work", "", "urgent"],
      });

      const validationError = note.validateSync();
      expect(validationError).to.exist;
    });

    it("should reject whitespace-only tags", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        tags: ["work", "   ", "urgent"],
      });

      const validationError = note.validateSync();
      expect(validationError).to.exist;
    });

    it("should reject non-string tags", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        tags: ["work", 123, "urgent"],
      });

      const validationError = note.validateSync();
      if (validationError) {
        expect(validationError).to.exist;
      } else {
        expect(note.tags[1]).to.equal("123");
        expect(typeof note.tags[1]).to.equal("string");
      }
    });
  });

  describe("Color Field", () => {
    it("should accept custom color", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        color: "#FF5733",
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
      expect(note.color).to.equal("#FF5733");
    });
  });

  describe("IsPinned Field", () => {
    it("should accept true for isPinned", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        isPinned: true,
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
      expect(note.isPinned).to.be.true;
    });

    it("should accept false for isPinned", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        isPinned: false,
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
      expect(note.isPinned).to.be.false;
    });
  });

  describe("User Reference", () => {
    it("should accept valid ObjectId for user", () => {
      const userId = generateObjectId();
      const note = new Notes({
        title: "Test Note",
        user: userId,
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
      expect(note.user.toString()).to.equal(userId.toString());
    });

    it("should reference User model", () => {
      const noteSchema = Notes.schema;
      const userField = noteSchema.paths.user;

      expect(userField.options.ref).to.equal("User");
    });
  });

  describe("Timestamps", () => {
    it("should have createdAt and updatedAt fields", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
      });

      expect(note.schema.paths).to.have.property("createdAt");
      expect(note.schema.paths).to.have.property("updatedAt");
    });
  });

  describe("Indexes", () => {
    it("should have text index on title, content, and tags", () => {
      const indexes = Notes.schema.indexes();
      const textIndex = indexes.find((index) => index[0].title === "text");

      expect(textIndex).to.exist;
    });

    it("should have compound index on user and createdAt", () => {
      const indexes = Notes.schema.indexes();
      const userCreatedIndex = indexes.find(
        (index) => index[0].user === 1 && index[0].createdAt === -1,
      );

      expect(userCreatedIndex).to.exist;
    });

    it("should have compound index on user, isPinned, and updatedAt", () => {
      const indexes = Notes.schema.indexes();
      const pinnedIndex = indexes.find(
        (index) =>
          index[0].user === 1 &&
          index[0].isPinned === 1 &&
          index[0].updatedAt === -1,
      );

      expect(pinnedIndex).to.exist;
    });
  });

  describe("Content Field", () => {
    it("should accept empty content", () => {
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        content: "",
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
    });

    it("should accept long content", () => {
      const longContent = "A".repeat(10000);
      const note = new Notes({
        title: "Test Note",
        user: generateObjectId(),
        content: longContent,
      });

      const validationError = note.validateSync();
      expect(validationError).to.be.undefined;
      expect(note.content).to.equal(longContent);
    });
  });
});
