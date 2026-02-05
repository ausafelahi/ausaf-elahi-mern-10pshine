const Notes = require("../models/Notes");
const { validationResult } = require("express-validator");

const getNotes = async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = { user: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    const notes = await Notes.find(query).sort({ isPinned: -1, createdAt: -1 });

    req.log.info(`Fetched ${notes.length} notes for user: ${req.user.email}`);

    res.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    req.log.error(`Get notes error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (!note) {
      req.log.warn(`Note not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      req.log.warn(
        `Unauthorized access attempt to note ${req.params.id} by user ${req.user.email}`,
      );
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this note",
      });
    }

    req.log.info(`Note retrieved: ${note._id} by user: ${req.user.email}`);

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    req.log.error(`Get note error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.log.warn(
        { errors: errors.array() },
        "Validation errors in note creation",
      );
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, content, tags, isPinned, color } = req.body;

    const note = await Notes.create({
      title,
      content,
      tags,
      isPinned,
      color,
      user: req.user._id,
    });

    req.log.info(`Note created: ${note._id} by user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    req.log.error(`Create note error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);

    if (!note) {
      req.log.warn(`Note not found for update: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      req.log.warn(
        `Unauthorized update attempt on note ${req.params.id} by user ${req.user.email}`,
      );
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this note",
      });
    }

    note = await Notes.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    req.log.info(`Note updated: ${note._id} by user: ${req.user.email}`);

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    req.log.error(`Update note error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (!note) {
      req.log.warn(`Note not found for deletion: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      req.log.warn(
        `Unauthorized delete attempt on note ${req.params.id} by user ${req.user.email}`,
      );
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this note",
      });
    }

    await note.deleteOne();

    req.log.info(`Note deleted: ${req.params.id} by user: ${req.user.email}`);

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    req.log.error(`Delete note error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const togglePin = async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (!note) {
      req.log.warn(`Note not found for pin toggle: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      req.log.warn(
        `Unauthorized pin toggle attempt on note ${req.params.id} by user ${req.user.email}`,
      );
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this note",
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    req.log.info(
      `Note pin toggled: ${note._id} (isPinned: ${note.isPinned}) by user: ${req.user.email}`,
    );

    res.json({
      success: true,
      data: note,
    });
  } catch (error) {
    req.log.error(`Toggle pin error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
};
