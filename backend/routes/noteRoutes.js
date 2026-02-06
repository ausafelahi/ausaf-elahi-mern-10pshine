const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
} = require("../controllers/noteController");
const { protect } = require("../middleware/auth");

const noteValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
];

router.use(protect);

router.route("/").get(getNotes).post(noteValidation, createNote);

router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

router.patch("/:id/pin", togglePin);

const noteRoutes = router;
module.exports = noteRoutes;
