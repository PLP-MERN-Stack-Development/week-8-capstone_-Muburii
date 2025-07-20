const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getLinkedStudentProfile,
  getLinkedStudentGrades
} = require("../controllers/parentController");

const router = express.Router();

// @route   GET /api/parents/me/student
// @desc    Get linked student's profile
// @access  Private (parent only)
router.get("/me/student", protect, authorize(["parent"]), getLinkedStudentProfile);

// @route   GET /api/parents/me/grades
// @desc    Get linked student's grades
// @access  Private (parent only)
router.get("/me/grades", protect, authorize(["parent"]), getLinkedStudentGrades);

module.exports = router;
