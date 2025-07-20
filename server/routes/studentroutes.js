const express = require("express");
const {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
  getStudentGrades,
  getStudentGPA
} = require("../controllers/studentController");

const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/students/:id
// @desc    Get student profile
// @access  Private (student, parent, or admin)
router.get("/:id", protect, getStudentProfile);

// @route   POST /api/students
// @desc    Create student profile
// @access  Private (developer or admin)
router.post("/", protect, authorize(["developer", "admin"]), createStudentProfile);

// @route   PUT /api/students/:id
// @desc    Update student profile
// @access  Private (owner or admin)
router.put("/:id", protect, authorize(["developer", "admin"]), updateStudentProfile);

// @route   GET /api/students/:id/grades
// @desc    Get all grades for student
// @access  Private (student, parent, or admin)
router.get("/:id/grades", protect, getStudentGrades);

// @route   GET /api/students/:id/gpa
// @desc    Get GPA for student
// @access  Private (student, parent, or admin)
router.get("/:id/gpa", protect, getStudentGPA);

module.exports = router;
