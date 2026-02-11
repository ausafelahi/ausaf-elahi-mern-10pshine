const { expect } = require("chai");
const sinon = require("sinon");
const Notes = require("../../models/Notes");
const {
  createMockRequest,
  createMockResponse,
  testNotes,
  generateObjectId,
} = require("../helper");

let getNotes, getNote, createNote, updateNote, deleteNote, togglePin;

describe("Notes Controller", () => {
  let req, res, userId;

  before(() => {
    const notesController = require("../../controllers/noteController");
    getNotes = notesController.getNotes;
    getNote = notesController.getNote;
    createNote = notesController.createNote;
    updateNote = notesController.updateNote;
    deleteNote = notesController.deleteNote;
    togglePin = notesController.togglePin;
  });

  beforeEach(() => {
    userId = generateObjectId();
    req = createMockRequest({
      user: { _id: userId, email: "test@example.com" },
    });
    res = createMockResponse();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getNotes", () => {
    it("should fetch all notes for a user", async () => {
      const mockNotes = [
        { ...testNotes.validNote, _id: generateObjectId(), user: userId },
        { ...testNotes.pinnedNote, _id: generateObjectId(), user: userId },
      ];

      sinon.stub(Notes, "find").returns({
        sort: sinon.stub().resolves(mockNotes),
      });

      await getNotes(req, res);

      expect(res.json.called).to.be.true;
      const jsonCall = res.json.getCall(0).args[0];
      expect(jsonCall.success).to.be.true;
    });

    it("should filter notes by search query", async () => {
      req.query = { search: "test" };

      const mockNotes = [
        { ...testNotes.validNote, _id: generateObjectId(), user: userId },
      ];

      sinon.stub(Notes, "find").returns({
        sort: sinon.stub().resolves(mockNotes),
      });

      await getNotes(req, res);

      expect(res.json.called).to.be.true;
    });

    it("should filter notes by tag", async () => {
      req.query = { tag: "important" };

      const mockNotes = [
        { ...testNotes.pinnedNote, _id: generateObjectId(), user: userId },
      ];

      sinon.stub(Notes, "find").returns({
        sort: sinon.stub().resolves(mockNotes),
      });

      await getNotes(req, res);

      expect(res.json.called).to.be.true;
    });

    it("should handle errors when fetching notes", async () => {
      sinon.stub(Notes, "find").throws(new Error("Database error"));

      await getNotes(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("getNote", () => {
    it("should fetch a single note by id", async () => {
      const noteId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: userId,
      };

      req.params = { id: noteId.toString() };

      sinon.stub(Notes, "findById").resolves(mockNote);

      await getNote(req, res);

      expect(res.json.called).to.be.true;
    });

    it("should return 404 if note not found", async () => {
      req.params = { id: generateObjectId().toString() };

      sinon.stub(Notes, "findById").resolves(null);

      await getNote(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 403 if user is not authorized", async () => {
      const noteId = generateObjectId();
      const differentUserId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: differentUserId,
      };

      req.params = { id: noteId.toString() };

      sinon.stub(Notes, "findById").resolves(mockNote);

      await getNote(req, res);

      expect(res.status.calledWith(403)).to.be.true;
    });
  });

  describe("createNote", () => {
    it("should create a new note successfully", async () => {
      const noteId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: userId,
      };

      req.body = testNotes.validNote;

      sinon.stub(Notes, "create").resolves(mockNote);

      await createNote(req, res);

      expect(res.status.calledWith(201)).to.be.true;
    });

    it("should handle creation errors", async () => {
      req.body = testNotes.validNote;

      sinon.stub(Notes, "create").rejects(new Error("Database error"));

      await createNote(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("updateNote", () => {
    it("should update a note successfully", async () => {
      const noteId = generateObjectId();
      const existingNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: userId,
      };
      const updatedNote = {
        ...existingNote,
        title: "Updated Title",
      };

      req.params = { id: noteId.toString() };
      req.body = { title: "Updated Title" };

      sinon.stub(Notes, "findById").resolves(existingNote);
      sinon.stub(Notes, "findByIdAndUpdate").resolves(updatedNote);

      await updateNote(req, res);

      expect(res.json.called).to.be.true;
    });

    it("should return 404 if note not found", async () => {
      req.params = { id: generateObjectId().toString() };
      req.body = { title: "Updated Title" };

      sinon.stub(Notes, "findById").resolves(null);

      await updateNote(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 403 if user is not authorized", async () => {
      const noteId = generateObjectId();
      const differentUserId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: differentUserId,
      };

      req.params = { id: noteId.toString() };
      req.body = { title: "Updated Title" };

      sinon.stub(Notes, "findById").resolves(mockNote);

      await updateNote(req, res);

      expect(res.status.calledWith(403)).to.be.true;
    });
  });

  describe("deleteNote", () => {
    it("should delete a note successfully", async () => {
      const noteId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: userId,
        deleteOne: sinon.stub().resolves(),
      };

      req.params = { id: noteId.toString() };

      sinon.stub(Notes, "findById").resolves(mockNote);

      await deleteNote(req, res);

      expect(mockNote.deleteOne.called).to.be.true;
      expect(res.json.called).to.be.true;
    });

    it("should return 404 if note not found", async () => {
      req.params = { id: generateObjectId().toString() };

      sinon.stub(Notes, "findById").resolves(null);

      await deleteNote(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 403 if user is not authorized", async () => {
      const noteId = generateObjectId();
      const differentUserId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: differentUserId,
      };

      req.params = { id: noteId.toString() };

      sinon.stub(Notes, "findById").resolves(mockNote);

      await deleteNote(req, res);

      expect(res.status.calledWith(403)).to.be.true;
    });
  });

  describe("togglePin", () => {
    it("should toggle pin status successfully", async () => {
      const noteId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: userId,
        isPinned: false,
        save: sinon.stub().resolves(),
      };

      req.params = { id: noteId.toString() };

      sinon.stub(Notes, "findById").resolves(mockNote);

      await togglePin(req, res);

      expect(mockNote.isPinned).to.be.true;
      expect(mockNote.save.called).to.be.true;
    });

    it("should return 404 if note not found", async () => {
      req.params = { id: generateObjectId().toString() };

      sinon.stub(Notes, "findById").resolves(null);

      await togglePin(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });

    it("should return 403 if user is not authorized", async () => {
      const noteId = generateObjectId();
      const differentUserId = generateObjectId();
      const mockNote = {
        _id: noteId,
        ...testNotes.validNote,
        user: differentUserId,
      };

      req.params = { id: noteId.toString() };

      sinon.stub(Notes, "findById").resolves(mockNote);

      await togglePin(req, res);

      expect(res.status.calledWith(403)).to.be.true;
    });
  });
});
